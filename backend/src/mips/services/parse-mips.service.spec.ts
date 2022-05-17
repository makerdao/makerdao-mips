import { Env } from "@app/env";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { readFile } from "fs/promises";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language } from "../entities/mips.entity";
import {
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
  mipData,
  mipData_2,
  mipFile,
  mipMapMock,
  mipMock,
  synchronizeDataMock,
  totalCountMock,
  headingOutComponentSummaryParsed,
  mipWithoutNameMock,
  filesGitMock,
  mapKeyMock
} from "./data-test/data";
import { GithubService } from "./github.service";
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

describe("Parse MIPs service", () => {
  let service: ParseMIPsService;
  let configService: ConfigService;
  let module: TestingModule;
  let mongoMemoryServer;



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
    SimpleGitService.prototype.saveMetaVars = jest.fn(() => Promise.resolve());
    PullRequestService.prototype.create = jest.fn(() => Promise.resolve(faker.datatype.boolean()));
    Logger.prototype.log = jest.fn();
    Logger.prototype.error = jest.fn();
    MIPsService.prototype.groupProposal = jest.fn(() => Promise.resolve([mipMock]));
    MIPsService.prototype.setMipsFather = jest.fn(() => Promise.resolve([faker.datatype.boolean()]));
    ParseMIPsService.prototype.updateSubproposalCountField = jest.fn(() => Promise.resolve());
    MIPsService.prototype.deleteManyByIds = jest.fn(() => Promise.resolve());
    MIPsService.prototype.update = jest.fn(() => Promise.resolve(mipMock));
    MIPsService.prototype.insertMany = jest.fn();
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

  describe('parse', () => {
    beforeEach(async () => {
      jest.spyOn(
        ParseMIPsService.prototype,
        'synchronizeData'
      ).mockReturnValueOnce(
        Promise.resolve(synchronizeDataMock)
      );
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
        .mockReturnValueOnce(Promise.resolve(mipWithoutNameMock));
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
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith({
        mip: mipWithoutNameMock,
        item: filesGitMock[0],
        TODO: "Convert into a notification Service"
      });
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

  describe("Syncronize data", () => {
    it("should return the empty mip parse", async () => {
      service.baseDir = `${process.cwd()}/src/mips/services/data-test`;
      const files = new Map();

      const sinchronizeData = await service.synchronizeData(
        [
          {
            hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
            filename: mipData_2.filename,
            language: Language.English
          },
        ],
        files
      );

      const result = { creates: 1, deletes: 0, updates: 0 };
      expect(sinchronizeData).toMatchObject(result);
    });
  });

  describe("Parse Lexer data", () => {
    it("should return the empty mip parse", async () => {
      const mip = service.parseLexerData("", {
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        language: Language.English
      });

      expect(mip).toMatchObject({
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        file: "",
      });
    });

    it("should return the full mip parse", async () => {
      const mip = service.parseLexerData(mipFile, {
        filename: mipData.filename,
        hash: mipData.hash,
        language: Language.English
      });

      expect(mip).toMatchObject(mipData);
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

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
