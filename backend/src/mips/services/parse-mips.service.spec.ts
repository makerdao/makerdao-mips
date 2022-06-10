import { Env } from "@app/env";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { readFile } from "fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  openIssue,
  pullRequests,
  pullRequestsAfter,
  pullRequestsCount,
  pullRequestsLast
} from "../graphql/definitions.graphql";
import { MIPsModule } from "../mips.module";
import {
  components,
  componentSummary,
  countMock,
  edgesMock,
  gitFileMock,
  titleParsed,
  componentSummaryParsed,
  mipData_2,
  mipFile,
  mipMapMock,
  mipMock,
  synchronizeDataMock,
  totalCountMock,
  headingOutComponentSummaryParsed,
  mipWithoutNameMock,
  filesGitMock,
  mapKeyMock,
  referenceMock,
  preambleMock,
  paragraphSummaryMock,
  mipNumber_2,
  markedListMock,
  mipNumber_1,
  sectionNameMock,
  authorMock,
  contributorsMock,
  dateProposedMock,
  dateRatifiedMock,
  dependenciesMock,
  titleMock,
  statusMock,
  replacesMock,
  typesMock,
  votingPortalLinkMock,
  forumLinkMock,
  tagsMock,
  openIssuemock,
  extraMock,
  errorUpdateMock,
  componentSummaryParsed_1,
} from "./data-test/data";
import { GithubService } from "./github.service";
import { MarkedService } from "./marked.service";
import { MIPsService } from "./mips.service";
import { ParseMIPsService } from "./parse-mips.service";
import { PullRequestService } from "./pull-requests.service";
import { SimpleGitService } from "./simple-git.service";
const marked = require("marked");
const faker = require("faker");

jest.mock("fs/promises", () => {
  return {
    readFile: jest.fn(() => 'test')
  };
});

describe("ParseMIPsService", () => {
  let service: ParseMIPsService;
  let configService: ConfigService;
  let module: TestingModule;
  let mongoMemoryServer;

  let countPreambleDefined = 2;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();

    module = await Test.createTestingModule({
      imports: [
        MIPsModule,
        ConfigModule.forRoot({
          isGlobal: true
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            uri: mongoMemoryServer.getUri(),
            useCreateIndex: true,
            useFindAndModify: false,
          }),
          inject: [ConfigService],
        }),
      ]
    }).compile();

    faker.seed('ParseMIPsService');

    service = module.get<ParseMIPsService>(ParseMIPsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    SimpleGitService.prototype.pull = jest.fn(() => null);
    SimpleGitService.prototype.getFiles = jest.fn(() => Promise.resolve([gitFileMock]));
    MIPsService.prototype.getAll = jest.fn(() => Promise.resolve(mipMapMock));
    PullRequestService.prototype.count = jest.fn(() => Promise.resolve(countMock));
    GithubService.prototype.pullRequests = jest.fn(() => Promise.resolve({
      repository: {
        pullRequests: {
          totalCount: totalCountMock,
        }
      }
    }));
    GithubService.prototype.pullRequestsLast = jest.fn(() => Promise.resolve({
      repository: {
        pullRequests: {
          nodes: {
            edges: [edgesMock]
          },
        }
      }
    }));
    GithubService.prototype.openIssue = jest.fn(() => Promise.resolve(openIssuemock));
    SimpleGitService.prototype.saveMetaVars = jest.fn(() => Promise.resolve());
    PullRequestService.prototype.create = jest.fn(() => Promise.resolve(faker.datatype.boolean()));
    Logger.prototype.log = jest.fn();
    Logger.prototype.error = jest.fn();
    MIPsService.prototype.groupProposal = jest.fn(() => Promise.resolve([mipMock]));
    MIPsService.prototype.setMipsFather = jest.fn(() => Promise.resolve([faker.datatype.boolean()]));
    MIPsService.prototype.deleteManyByIds = jest.fn(() => Promise.resolve());
    MIPsService.prototype.update = jest.fn(() => Promise.resolve(mipMock));
    MIPsService.prototype.insertMany = jest.fn();
    MIPsService.prototype.findAll = jest.fn(() => Promise.resolve({
      items: [mipMock],
      total: faker.datatype.number(),
    }));
    MarkedService.prototype.markedLexer = jest.fn(() => markedListMock);
    console.log = jest.fn();
  });

  describe('loggerMessage', () => {
    it('base case', async () => {
      const message = 'test';

      const mockLogger = jest.spyOn(
        Logger.prototype,
        'log'
      ).mockReturnValueOnce();

      service.loggerMessage(message);

      expect(mockLogger).toHaveBeenCalledTimes(1);
      expect(mockLogger).toHaveBeenCalledWith(message);
    });
  });

  describe('updateSubproposalCountField', () => {
    it('update subproposal', async () => {
      await service.updateSubproposalCountField();

      expect(MIPsService.prototype.findAll).toBeCalledTimes(2);
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: "",
          }],
        },
        "_id mipName proposal",
      );
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: undefined,
          }],
        },
        "_id mipName proposal",
      );
      expect(MIPsService.prototype.update).toBeCalledTimes(1);
      expect(MIPsService.prototype.update).toBeCalledWith(
        mipMock._id,
        mipMock,
      );
      expect(Logger.prototype.error).not.toBeCalled();
    });

    it('error during update', async () => {
      jest.spyOn(MIPsService.prototype, 'update')
        .mockImplementationOnce(async () => {
          throw new Error(errorUpdateMock);
        });

      await service.updateSubproposalCountField();

      expect(MIPsService.prototype.findAll).toBeCalledTimes(2);
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: "",
          }],
        },
        "_id mipName proposal",
      );
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 0,
          page: 0,
        },
        "",
        "",
        {
          equals: [{
            field: "proposal",
            value: undefined,
          }],
        },
        "_id mipName proposal",
      );
      expect(MIPsService.prototype.update).toBeCalledTimes(1);
      expect(MIPsService.prototype.update).toBeCalledWith(
        mipMock._id,
        mipMock,
      );
      expect(Logger.prototype.error).toBeCalledTimes(1);
      expect(Logger.prototype.error).toBeCalledWith(new Error(errorUpdateMock));

    });
  });

  describe('parse', () => {
    beforeEach(async () => {
      jest.spyOn(ParseMIPsService.prototype, 'synchronizeData')
        .mockReturnValueOnce(
          Promise.resolve(synchronizeDataMock)
        );
      jest.spyOn(ParseMIPsService.prototype, 'updateSubproposalCountField')
        .mockReturnValueOnce(Promise.resolve());
    });

    it('with no existing pull requests', async () => {
      let countPullRequest = 2;

      PullRequestService.prototype.count = jest.fn(() => Promise.resolve(0));

      GithubService.prototype.pullRequests = jest.fn(async () => {
        const pullRequest = {
          repository: {
            pullRequests: {
              nodes: {
                edges: [`test_${countPullRequest}`]
              },
              pageInfo: {
                hasNextPage: true,
                endCursor: `test_${countPullRequest}`,
              },
            }
          }
        };
        if (countPullRequest > 0) {
          countPullRequest = countPullRequest - 1;
        }
        else {
          pullRequest.repository.pullRequests.pageInfo.hasNextPage = false;
        }
        return pullRequest;
      });

      GithubService.prototype.pullRequestsLast = jest.fn(async () => {
        return {
          repository: {
            pullRequests: {
              nodes: {
                edges: ['test']
              },
              pageInfo: {
                hasNextPage: true,
                endCursor: 'test',
              },
              totalCount: 2,
            }
          }
        };
      });

      const result = await service.parse();

      expect(result).toBeTruthy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getFiles).toBeCalledWith();
      expect(MIPsService.prototype.getAll).toBeCalledTimes(1);
      expect(MIPsService.prototype.getAll).toBeCalledWith();
      expect(PullRequestService.prototype.count).toBeCalledTimes(1);
      expect(PullRequestService.prototype.count).toBeCalledWith();
      expect(GithubService.prototype.pullRequests).toBeCalledTimes(3);
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequestsCount
      );
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequests
      );
      expect(GithubService.prototype.pullRequests).toHaveBeenCalledWith(
        pullRequestsAfter,
        'test_1',
      );
      expect(ParseMIPsService.prototype.synchronizeData).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.synchronizeData).toBeCalledWith(
        [gitFileMock],
        mipMapMock,
      );
      expect(GithubService.prototype.pullRequestsLast).not.toBeCalled();
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledWith();
      expect(PullRequestService.prototype.create).toBeCalledTimes(2);
      expect(PullRequestService.prototype.create).toHaveBeenCalledWith({
        edges: ['test_1'],
      });
      expect(PullRequestService.prototype.create).toHaveBeenCalledWith({
        edges: ['test_0'],
      });
      expect(Logger.prototype.log).toBeCalledTimes(2);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Synchronize Data ===> ${JSON.stringify(synchronizeDataMock)}`,
      );
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Mips with subproposals data ===> ${JSON.stringify([mipMock])}`
      );
      expect(MIPsService.prototype.groupProposal).toBeCalledTimes(1);
      expect(MIPsService.prototype.groupProposal).toBeCalledWith();
      expect(MIPsService.prototype.setMipsFather).toBeCalledTimes(1);
      expect(MIPsService.prototype.setMipsFather).toBeCalledWith([mipMock._id]);
      expect(ParseMIPsService.prototype.updateSubproposalCountField).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.updateSubproposalCountField).toBeCalledWith();
    });

    it('with existing pull requests', async () => {
      const result = await service.parse();

      expect(result).toBeTruthy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getFiles).toBeCalledWith();
      expect(MIPsService.prototype.getAll).toBeCalledTimes(1);
      expect(MIPsService.prototype.getAll).toBeCalledWith();
      expect(PullRequestService.prototype.count).toBeCalledTimes(1);
      expect(PullRequestService.prototype.count).toBeCalledWith();
      expect(GithubService.prototype.pullRequests).toBeCalledTimes(1);
      expect(GithubService.prototype.pullRequests).toBeCalledWith(
        pullRequestsCount
      );
      expect(GithubService.prototype.pullRequestsLast).toBeCalledTimes(1);
      expect(GithubService.prototype.pullRequestsLast).toBeCalledWith(
        pullRequestsLast,
        totalCountMock - countMock,
      );
      expect(ParseMIPsService.prototype.synchronizeData).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.synchronizeData).toBeCalledWith(
        [gitFileMock],
        mipMapMock,
      );
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.saveMetaVars).toBeCalledWith();
      expect(PullRequestService.prototype.create).toBeCalledTimes(1);
      expect(PullRequestService.prototype.create).toBeCalledWith({
        edges: [edgesMock],
      });
      expect(Logger.prototype.log).toBeCalledTimes(3);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Synchronize Data ===> ${JSON.stringify(synchronizeDataMock)}`,
      );
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        `Mips with subproposals data ===> ${JSON.stringify([mipMock])}`
      );
      expect(MIPsService.prototype.groupProposal).toBeCalledTimes(1);
      expect(MIPsService.prototype.groupProposal).toBeCalledWith();
      expect(MIPsService.prototype.setMipsFather).toBeCalledTimes(1);
      expect(MIPsService.prototype.setMipsFather).toBeCalledWith([mipMock._id]);
      expect(ParseMIPsService.prototype.updateSubproposalCountField).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.updateSubproposalCountField).toBeCalledWith();
    });

    it('error while pull', async () => {

      SimpleGitService.prototype.pull = jest.fn(() => {
        throw new Error("forcing error");
      });

      const result = await service.parse();

      expect(result).toBeFalsy();
      expect(SimpleGitService.prototype.pull).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.pull).toBeCalledWith(
        'origin',
        configService.get(Env.RepoBranch),
      );
      expect(SimpleGitService.prototype.getFiles).not.toBeCalled();
      expect(MIPsService.prototype.getAll).not.toBeCalled();
      expect(PullRequestService.prototype.count).not.toBeCalled();
      expect(GithubService.prototype.pullRequests).not.toBeCalled();
      expect(GithubService.prototype.pullRequestsLast).not.toBeCalled();
      expect(ParseMIPsService.prototype.synchronizeData).not.toBeCalled();
      expect(SimpleGitService.prototype.saveMetaVars).not.toBeCalled();
      expect(PullRequestService.prototype.create).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
      expect(MIPsService.prototype.groupProposal).not.toBeCalled();
      expect(MIPsService.prototype.setMipsFather).not.toBeCalled();
      expect(ParseMIPsService.prototype.updateSubproposalCountField).not.toBeCalled();
    });
  });

  describe('parseMIP', () => {
    beforeEach(async () => {
      jest.spyOn(
        ParseMIPsService.prototype,
        "parseLexerData"
      ).mockReturnValueOnce(
        mipMock
      );
    });

    it('parse new mip', async () => {
      const isNewMIP = true;
      const baseUrl = `${process.cwd()}/${configService.get<string>(
        Env.FolderRepositoryName
      )}`;

      const result = await service.parseMIP(mipMock, isNewMIP);

      expect(result).toBeDefined();
      expect(result).toEqual(mipMock);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Parse new mip item update => ${mipMock.filename}`);
      expect(readFile).toBeCalledTimes(1);
      expect(readFile).toBeCalledWith(
        `${baseUrl}/${mipMock.filename}`,
        'utf-8'
      );
      expect(ParseMIPsService.prototype.parseLexerData).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseLexerData).toBeCalledWith(
        'test',
        mipMock,
      );
    });

    it('parse not new mip', async () => {
      const isNewMIP = false;
      const baseUrl = `${process.cwd()}/${configService.get<string>(
        Env.FolderRepositoryName
      )}`;

      const result = await service.parseMIP(mipMock, isNewMIP);

      expect(result).toBeDefined();
      expect(result).toEqual(mipMock);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Parse mip item update => ${mipMock.filename}`);
      expect(readFile).toBeCalledTimes(1);
      expect(readFile).toBeCalledWith(
        `${baseUrl}/${mipMock.filename}`,
        'utf-8'
      );
      expect(ParseMIPsService.prototype.parseLexerData).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseLexerData).toBeCalledWith(
        'test',
        mipMock,
      );
    });
  });

  describe('deleteMipsFromMap', () => {
    it('delete mips by ids', async () => {

      await service.deleteMipsFromMap(mipMapMock);

      expect(MIPsService.prototype.deleteManyByIds).toBeCalledTimes(1);
      expect(MIPsService.prototype.deleteManyByIds).toBeCalledWith([mipMock._id]);
    });
  });

  describe('updateIfDifferentHash', () => {
    beforeEach(async () => {
      jest.spyOn(
        ParseMIPsService.prototype,
        'parseMIP'
      ).mockReturnValueOnce(
        Promise.resolve(mipMock)
      );
    });

    it('different hash', async () => {
      const mip_2 = {
        ...mipMock,
        hash: 'hash_2',
      };

      const result = await service.updateIfDifferentHash(mipMock, mip_2);

      expect(result).toBeTruthy();
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledWith(mip_2, false);
      expect(MIPsService.prototype.update).toBeCalledTimes(1);
      expect(MIPsService.prototype.update).toBeCalledWith(mipMock._id, mipMock);
      expect(Logger.prototype.error).not.toBeCalled();
    });

    it('different hash and error while update', async () => {
      const mip_2 = {
        ...mipMock,
        hash: 'hash_2',
      };

      MIPsService.prototype.update = jest.fn(async () => {
        throw new Error('Forcing error');
      });

      const result = await service.updateIfDifferentHash(mipMock, mip_2);

      expect(result).toBeTruthy();
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledWith(mip_2, false);
      expect(MIPsService.prototype.update).toBeCalledTimes(1);
      expect(MIPsService.prototype.update).toBeCalledWith(mipMock._id, mipMock);
      expect(Logger.prototype.error).toBeCalledTimes(1);
      expect(Logger.prototype.error).toBeCalledWith('Forcing error');
    });

    it('same hash', async () => {
      const result = await service.updateIfDifferentHash(mipMock, mipMock);

      expect(result).toBeFalsy();
      expect(ParseMIPsService.prototype.parseMIP).not.toBeCalled();
      expect(MIPsService.prototype.update).not.toBeCalled();
      expect(Logger.prototype.error).not.toBeCalled();
    });
  });

  describe('synchronizeData', () => {
    beforeEach(async () => {
      jest.spyOn(ParseMIPsService.prototype, 'updateIfDifferentHash')
        .mockReturnValueOnce(Promise.resolve(true));
      jest.spyOn(ParseMIPsService.prototype, 'deleteMipsFromMap')
        .mockReturnValueOnce(Promise.resolve());
    });

    it('new MIP', async () => {
      jest.spyOn(ParseMIPsService.prototype, 'parseMIP')
        .mockReturnValue(Promise.resolve(mipWithoutNameMock));
      jest.spyOn(ParseMIPsService.prototype, 'sendIssue')
        .mockReturnValue(Promise.resolve());
      const result = await service.synchronizeData(
        filesGitMock,
        mipMapMock,
      );

      expect(result).toEqual({
        creates: 1,
        deletes: 1,
        updates: 0,
      });
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledWith(filesGitMock[0], true);
      expect(ParseMIPsService.prototype.sendIssue).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.sendIssue).toBeCalledWith([{
        mipPath: filesGitMock[0].filename,
      }]);
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(
        `Mips with problems to parse ==> ${(mipWithoutNameMock.mip, mipWithoutNameMock.mipName, mipWithoutNameMock.filename)
        }`
      );
      expect(ParseMIPsService.prototype.updateIfDifferentHash).not.toBeCalled();
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledWith(
        mipMapMock,
      );
      expect(MIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(MIPsService.prototype.insertMany).toBeCalledWith(
        [mipWithoutNameMock],
      );
    });

    it('new MIP and error while parseMIP', async () => {
      jest.spyOn(
        ParseMIPsService.prototype,
        'parseMIP'
      ).mockImplementationOnce(async () => {
        throw new Error('Forcing error');
      });

      const result = await service.synchronizeData(
        filesGitMock,
        mipMapMock,
      );

      expect(result).toEqual({
        creates: 0,
        deletes: 1,
        updates: 0,
      });
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parseMIP).toBeCalledWith(filesGitMock[0], true);
      expect(console.log).not.toBeCalled();
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(
        'Forcing error'
      );
      expect(ParseMIPsService.prototype.updateIfDifferentHash).not.toBeCalled();
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledWith(
        mipMapMock,
      );
      expect(MIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(MIPsService.prototype.insertMany).toBeCalledWith([]);
    });

    it('no new MIP', async () => {
      jest.spyOn(ParseMIPsService.prototype, 'parseMIP')
        .mockReturnValueOnce(Promise.resolve(mipWithoutNameMock));
      const result = await service.synchronizeData(
        [{
          ...mipMock,
          filename: mapKeyMock,
        }],
        mipMapMock,
      );

      expect(result).toEqual({
        creates: 0,
        deletes: 0,
        updates: 1,
      });
      expect(ParseMIPsService.prototype.parseMIP).not.toBeCalled();
      expect(console.log).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
      expect(ParseMIPsService.prototype.updateIfDifferentHash).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.updateIfDifferentHash).toBeCalledWith(
        gitFileMock,
        {
          ...mipMock,
          filename: mapKeyMock,
        },
      );
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.deleteMipsFromMap).toBeCalledWith(
        new Map(),
      );
      expect(MIPsService.prototype.insertMany).toBeCalledTimes(1);
      expect(MIPsService.prototype.insertMany).toBeCalledWith([]);
    });
  });

  describe('sendIssue', () => {
    it('', async () => {
      console.log = jest.fn();
      await service.sendIssue([{
        mipPath: filesGitMock[0].filename,
      }]);

      expect(GithubService.prototype.openIssue).toBeCalledTimes(1);
      expect(GithubService.prototype.openIssue).toBeCalledWith(
        openIssue,
        "MIPs with problems to parse",
        `
# Some problems where found on this MIPS:


>MIP Path: ${filesGitMock[0].filename}



`
      );
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith(openIssuemock);
    });
  });

  describe('getComponentsSection', () => {
    it('has component summary', async () => {
      const result = service.getComponentsSection(mipFile);

      expect(result).toEqual(componentSummary);
    });

    it("hasn't component summary", async () => {
      const data = 'test';

      const result = service.getComponentsSection(data);

      expect(result).toEqual('');
    });

    it('component summary without end', async () => {
      const data = "**MIP0c1: Core Principles\n\nsomething";

      const result = service.getComponentsSection(data);

      expect(result).toEqual('**MIP0c1: Core Principles\n\nsomething');
    });
  });

  describe('getDataFromComponentText', () => {
    it('get splited components', async () => {
      const result = service.getDataFromComponentText(componentSummary);

      expect(result).toEqual(components);
    });
  });

  describe('parseMipsNamesComponentsSubproposals', () => {
    it('is on component summary', async () => {
      const markedFile: any[] = marked.lexer(mipFile);
      const element = markedFile[12];
      const isOnComponentSummary = true;

      const result = service.parseMipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        componentSummaryParsed
      );
    });

    it('is on component summary title', async () => {
      const markedFile: any[] = marked.lexer(mipFile);
      const element = markedFile[37];
      const isOnComponentSummary = true;

      const result = service.parseMipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        componentSummaryParsed_1
      );
    });

    it('heading not on component summary', async () => {
      const markedFile: any[] = marked.lexer(mipFile);
      const element = markedFile[0];
      const isOnComponentSummary = false;

      const result = service.parseMipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        titleParsed
      );
    });

    it('not heading that is not on component summary', async () => {
      const markedFile: any[] = marked.lexer(mipFile);
      const element = markedFile[203];
      const isOnComponentSummary = false;

      const result = service.parseMipsNamesComponentsSubproposals(
        element,
        isOnComponentSummary
      );

      expect(result).toEqual(
        headingOutComponentSummaryParsed
      );
    });
  });

  describe('parseReferenceList', () => {
    it('parse reference token list', async () => {
      const items = [{
        tokens: [{
          tokens: [
            {
              href: referenceMock.link,
              text: referenceMock.name,
            },
            {
              text: faker.random.word(),
            }
          ]
        }],
      }];

      const result = (service as any).parseReferenceList(items);

      expect(result).toEqual([{
        name: referenceMock.name,
        link: referenceMock.link,
      }]);
    });
  });

  describe('parseReferencesTokens', () => {
    it('parse reference tokens when is a text', async () => {
      const item = {
        type: 'text',
        text: referenceMock.name,
        href: referenceMock.link,
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([{
        name: referenceMock.name,
        link: "",
      }]);
    });

    it('parse reference tokens when is a link', async () => {
      const item = {
        type: 'link',
        text: referenceMock.name,
        href: referenceMock.link,
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([referenceMock]);
    });

    it('parse reference tokens when have tokens', async () => {
      const item = {
        tokens: [{
          text: referenceMock.name,
          href: referenceMock.link,
        }],
      };

      const result = (service as any).parseReferencesTokens(item);

      expect(result).toEqual([referenceMock]);
    });

    it('parse reference tokens emty result', async () => {
      const result = (service as any).parseReferencesTokens({});

      expect(result).toEqual([]);
    });
  });

  describe('parseReferences', () => {
    beforeEach(() => {
      jest.spyOn(ParseMIPsService.prototype as any, 'parseReferenceList')
        .mockReturnValueOnce([referenceMock]);
      jest.spyOn(ParseMIPsService.prototype as any, 'parseReferencesTokens')
        .mockReturnValueOnce([referenceMock]);
    });

    it('next type is a list', () => {
      const item = {
        type: 'list',
        items: [{
          tokens: [{
            tokens: [{
              text: referenceMock.name,
              href: referenceMock.link,
            }],
          }],
        }],
      };

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([referenceMock]);
      expect((ParseMIPsService.prototype as any).parseReferenceList).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseReferenceList).toBeCalledWith(item.items);
      expect((ParseMIPsService.prototype as any).parseReferencesTokens).not.toBeCalled();
    });

    it('next type is a single item', () => {
      const item = {
        tokens: [{
          tokens: [{
            text: referenceMock.name,
            href: referenceMock.link,
          }],
        }],
      };

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([referenceMock]);
      expect((ParseMIPsService.prototype as any).parseReferencesTokens).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseReferencesTokens).toBeCalledWith(item.tokens[0]);
      expect((ParseMIPsService.prototype as any).parseReferenceList).not.toBeCalled();
    });

    it('next type has nothing', () => {
      const item = {};

      const result = (service as any).parseReferences(item);

      expect(result).toEqual([]);
      expect((ParseMIPsService.prototype as any).parseReferencesTokens).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferenceList).not.toBeCalled();
    });
  });

  describe('parseParagraphSummary', () => {
    it('parse list of paragraph summary', () => {
      const list = [{
        type: 'list',
        depth: faker.datatype.number({
          min: 3
        }),
        raw: faker.random.word(),
      }];

      const result = (service as any).parseParagraphSummary(list);

      expect(result).toEqual(list[0].raw);
    });
  });

  describe('parseNotTitleHeading', () => {
    beforeEach(() => {
      jest.spyOn(ParseMIPsService.prototype as any, 'parsePreamble')
        .mockReturnValueOnce(preambleMock);
      jest.spyOn(ParseMIPsService.prototype as any, 'setSubproposalValue')
        .mockReturnValueOnce(countMock);
      jest.spyOn(ParseMIPsService.prototype as any, 'parseParagraphSummary')
        .mockReturnValueOnce(paragraphSummaryMock);
      jest.spyOn(ParseMIPsService.prototype as any, 'parseReferences')
        .mockReturnValueOnce([referenceMock]);
    });

    it('parse preamble', () => {
      const list = [
        {
          text: 'Preamble',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];
      const item = {
        ...filesGitMock[0],
        filename: `${faker.random.word()}-`,
      };

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        item,
      );

      expect(result).toEqual({
        mip: {
          ...mipData_2,
          mipName: preambleMock.mipName,
          subproposal: countMock,
        },
        preamble: {
          ...preambleMock,
          mip: mipNumber_2,
        },
        isOnComponentSummary: false,
      });
      expect((ParseMIPsService.prototype as any).parsePreamble).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parsePreamble).toBeCalledWith(list[1].text, true);
      expect((ParseMIPsService.prototype as any).setSubproposalValue).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).setSubproposalValue).toBeCalledWith(preambleMock.mipName);
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse subproposal preamble', () => {
      const list = [
        {
          text: 'Preamble',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        filesGitMock[0],
      );

      expect(result).toEqual({
        mip: mipData_2,
        preamble: preambleMock,
        isOnComponentSummary: false,
      });
      expect((ParseMIPsService.prototype as any).parsePreamble).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parsePreamble).toBeCalledWith(list[1].text);
      expect((ParseMIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse sentence summary', () => {
      const list = [
        {
          text: 'Sentence Summary',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        mip: {
          ...mipData_2,
          sentenceSummary: list[1].raw,
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseMIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse paragraph summary', () => {
      const list = [
        {
          text: 'Paragraph Summary',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        mip: {
          ...mipData_2,
          paragraphSummary: paragraphSummaryMock,
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).toBeCalledWith([list[1]]);
      expect((ParseMIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferences).not.toBeCalled();
    });

    it('parse references', () => {
      const list = [
        {
          text: 'References',
          raw: faker.random.word(),
        },
        {
          text: faker.random.word(),
          raw: faker.random.word(),
        }
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        mip: {
          ...mipData_2,
          references: [referenceMock],
        },
        preamble: undefined,
        isOnComponentSummary: false,
      });
      expect((ParseMIPsService.prototype as any).parseReferences).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseReferences).toBeCalledWith(list[1]);
      expect((ParseMIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
    });

    it('parse other headings', () => {
      const list = [
        {
          text: 'Component Summary Section',
          raw: faker.random.word(),
        },
      ];

      const result = (service as any).parseNotTitleHeading(
        list,
        mipData_2,
        filesGitMock,
      );

      expect(result).toEqual({
        mip: mipData_2,
        preamble: undefined,
        isOnComponentSummary: true,
      });
      expect((ParseMIPsService.prototype as any).parsePreamble).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).setSubproposalValue).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseParagraphSummary).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseReferences).not.toBeCalled();
    });
  });

  describe('extractMipNumberFromMipName', () => {
    it('extract mip number', async () => {
      const result = (service as any).extractMipNumberFromMipName(`${totalCountMock}`);

      expect(result).toEqual(`000${totalCountMock}`);
    });

    it('extract mip number', async () => {
      const result = (service as any).extractMipNumberFromMipName(mapKeyMock);

      expect(result).toEqual(mapKeyMock);
    });
  });

  describe("parseLexerData", () => {
    beforeEach(() => {
      jest.spyOn(ParseMIPsService.prototype, 'getComponentsSection')
        .mockReturnValueOnce(componentSummary);
      jest.spyOn(ParseMIPsService.prototype, 'getDataFromComponentText')
        .mockReturnValueOnce(components);
      jest.spyOn(ParseMIPsService.prototype, 'parseMipsNamesComponentsSubproposals')
        .mockReturnValueOnce(componentSummaryParsed);
      jest.spyOn(ParseMIPsService.prototype as any, 'parseNotTitleHeading')
        .mockImplementationOnce((_list, mip, _item) => {
          if (countPreambleDefined > 0) {
            countPreambleDefined--;
            return {
              mip: mip,
              preamble: preambleMock,
              isOnComponentSummary: false,
            };
          }
          return {
            preamble: null,
            mip,
            isOnComponentSummary: false,
          };
        });
      jest.spyOn(ParseMIPsService.prototype as any, 'extractMipNumberFromMipName')
        .mockReturnValueOnce(`${mipNumber_1}`);
    });

    it('parse lexer data', () => {
      const result = service.parseLexerData(
        mipFile,
        filesGitMock[0],
      );

      expect(result).toEqual({
        mipName: `MIP${mipNumber_1}`,
        hash: filesGitMock[0].hash,
        file: mipFile,
        language: filesGitMock[0].language,
        filename: filesGitMock[0].filename,
        sections: [
          {
            depth: markedListMock[0].depth,
            heading: markedListMock[0].text,
          },
          {
            depth: markedListMock[1].depth,
            heading: markedListMock[1].text,
            mipComponent: sectionNameMock,
          },
        ],
        sectionsRaw: [componentSummaryParsed, undefined],
        references: [],
        components,
        author: preambleMock.author,
        contributors: preambleMock.contributors,
        dateProposed: preambleMock.dateProposed,
        dateRatified: preambleMock.dateRatified,
        dependencies: preambleMock.dependencies,
        extra: preambleMock.extra,
        mip: preambleMock.mip,
        replaces: preambleMock.replaces,
        status: preambleMock.status,
        title: markedListMock[0].text,
        types: preambleMock.types,
        tags: preambleMock.tags,
        subproposalsCount: 0,
        votingPortalLink: preambleMock.votingPortalLink,
        forumLink: preambleMock.forumLink,
        mipCodeNumber: `${mipNumber_1}`,
      });
      expect(ParseMIPsService.prototype.getComponentsSection).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.getComponentsSection).toBeCalledWith(mipFile);
      expect(ParseMIPsService.prototype.getDataFromComponentText).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.getDataFromComponentText).toBeCalledWith(componentSummary);
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: mipFile,
          language: filesGitMock[0].language,
          filename: filesGitMock[0].filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              mipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          mipName: 'MIP' + mipNumber_1,
          components,
        },
        filesGitMock[0],
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).toBeCalledWith('MIP' + mipNumber_1);
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('MIP not inside the MIP folder', () => {
      try {
        service.parseLexerData(
          mipFile,
          {
            ...filesGitMock[0],
            filename: faker.random.word(),
          },
        );
      } catch (error) {
        expect(error.message).toEqual("MIP filename not inside a MIP folder");
      }

      expect(ParseMIPsService.prototype.getComponentsSection).not.toBeCalled();
      expect(ParseMIPsService.prototype.getDataFromComponentText).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).not.toBeCalled();
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).not.toBeCalled();
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('filename includes -', () => {
      const filename: string = `MIP${mipNumber_1}/MIP${mipNumber_1}-.md`;
      const result = service.parseLexerData(
        mipFile,
        {
          ...filesGitMock[0],
          filename,
        },
      );

      expect(result).toEqual({
        proposal: `MIP${mipNumber_1}`,
        hash: filesGitMock[0].hash,
        file: mipFile,
        language: filesGitMock[0].language,
        filename,
        sections: [
          {
            depth: markedListMock[0].depth,
            heading: markedListMock[0].text,
          },
          {
            depth: markedListMock[1].depth,
            heading: markedListMock[1].text,
            mipComponent: sectionNameMock,
          },
        ],
        sectionsRaw: [componentSummaryParsed, undefined],
        references: [],
        author: preambleMock.author,
        contributors: preambleMock.contributors,
        dateProposed: preambleMock.dateProposed,
        dateRatified: preambleMock.dateRatified,
        dependencies: preambleMock.dependencies,
        extra: preambleMock.extra,
        mip: preambleMock.mip,
        replaces: preambleMock.replaces,
        status: preambleMock.status,
        title: markedListMock[0].text,
        types: preambleMock.types,
        tags: preambleMock.tags,
        subproposalsCount: 0,
        votingPortalLink: preambleMock.votingPortalLink,
        forumLink: preambleMock.forumLink,
        mipCodeNumber: `${mipNumber_1}`,
      });
      expect(ParseMIPsService.prototype.getComponentsSection).not.toBeCalled();
      expect(ParseMIPsService.prototype.getDataFromComponentText).not.toBeCalled();
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: mipFile,
          language: filesGitMock[0].language,
          filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              mipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          proposal: `MIP${mipNumber_1}`,
        },
        {
          ...filesGitMock[0],
          filename,
        },
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).toBeCalledWith(undefined);
      expect(Logger.prototype.log).not.toBeCalled();
    });

    it('preamble empty', () => {
      const result = service.parseLexerData(
        mipFile,
        filesGitMock[0],
      );

      expect(result).toEqual(undefined);
      expect(ParseMIPsService.prototype.getComponentsSection).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.getComponentsSection).toBeCalledWith(mipFile);
      expect(ParseMIPsService.prototype.getDataFromComponentText).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.getDataFromComponentText).toBeCalledWith(componentSummary);
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledTimes(1);
      expect((ParseMIPsService.prototype as any).parseNotTitleHeading).toBeCalledWith(
        [markedListMock[1]],
        {
          hash: filesGitMock[0].hash,
          file: mipFile,
          language: filesGitMock[0].language,
          filename: filesGitMock[0].filename,
          sections: [
            {
              depth: markedListMock[0].depth,
              heading: markedListMock[0].text,
            },
            {
              depth: markedListMock[1].depth,
              heading: markedListMock[1].text,
              mipComponent: sectionNameMock,
            },
          ],
          sectionsRaw: [],
          references: [],
          mipName: 'MIP' + mipNumber_1,
          components,
        },
        filesGitMock[0],
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toBeCalledTimes(2);
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[0],
        false,
      );
      expect(ParseMIPsService.prototype.parseMipsNamesComponentsSubproposals).toHaveBeenCalledWith(
        markedListMock[1],
        false,
      );
      expect(Logger.prototype.log).toBeCalledTimes(1);
      expect(Logger.prototype.log).toBeCalledWith(`Preamble empty ==> ${JSON.stringify(filesGitMock[0])}`);
      expect((ParseMIPsService.prototype as any).extractMipNumberFromMipName).not.toBeCalled();
    });
  });

  describe('setSubproposalValue', () => {
    it('calculate subpropousal value', () => {
      const result = service.setSubproposalValue(
        `MIP${mipNumber_1}cSP${mipNumber_2}`,
      );

      expect(result).toEqual(parseInt(
        mipNumber_1 + (mipNumber_2 === 10 ? '' : '0') + mipNumber_2
      ));
    });
  });

  describe('parseSections', () => {
    it('marked section', async () => {
      const result = await service.parseSections(mipFile);

      expect(result).toEqual(markedListMock);
      expect(MarkedService.prototype.markedLexer).toBeCalledTimes(1);
      expect(MarkedService.prototype.markedLexer).toBeCalledWith(mipFile);
    });
  });

  describe("Parse Preamble", () => {
    it("should return the empty preamble", async () => {
      const data = faker.random.word();

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject({});
    });

    it("should return the full preamble", async () => {
      const data =
        "MIP#: 0\nTitle: The Maker Improvement Proposal Framework\nAuthor(s): Charles St.Louis (@CPSTL), Rune Christensen (@Rune23)\nContributors: @LongForWisdom\nType: Process\nStatus: Accepted\nDate Proposed: 2020-04-06\nDate Ratified: 2020-05-02\nDependencies: n/a\nReplaces: n/a\n";

      const result = {
        mip: 0,
        preambleTitle: "The Maker Improvement Proposal Framework",
        author: ["Charles St.Louis (@CPSTL)", "Rune Christensen (@Rune23)"],
        contributors: ["@LongForWisdom"],
        types: "Process",
        status: "Accepted",
        dateProposed: "2020-04-06",
        dateRatified: "2020-05-02",
        dependencies: ["n/a"],
        replaces: "n/a",
      };

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject(result);
    });
  });

  describe('parsePreamble', () => {
    it('emty preamble', () => {
      const result = service.parsePreamble(mipFile);

      expect(result).toEqual({
        author: authorMock,
        contributors: contributorsMock,
        dateProposed: dateProposedMock,
        dateRatified: dateRatifiedMock,
        dependencies: dependenciesMock,
        mip: mipNumber_1,
        preambleTitle: titleMock,
        replaces: replacesMock,
        status: statusMock,
        types: typesMock,
        votingPortalLink: votingPortalLinkMock,
        forumLink: forumLinkMock,
        tags: [tagsMock],
        extra: [extraMock],
      });
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
