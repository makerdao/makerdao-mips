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
import { IGitFile, ISynchronizeData } from "../interfaces/mips.interface";
import { MIPsModule } from "../mips.module";
import { components, componentSummary, mipData, mipFile } from "./data-test/data";
import { GithubService } from "./github.service";
import { MIPsService } from "./mips.service";
import { ParseMIPsService } from "./parse-mips.service";
import { PullRequestService } from "./pull-requests.service";
import { SimpleGitService } from "./simple-git.service";
const marked = require("marked");

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

  const mipMock = {
    filename: 'test',
    hash: 'test',
    language: Language.English,
    file: 'test',
    _id: 'testId'
  };
  
  const gitFileMock: IGitFile = {
    ...mipMock,
    language: Language.English,
  };
  const mipMapMock: Map<string, IGitFile> = new Map();
  mipMapMock.set('test', gitFileMock);

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

    service = module.get<ParseMIPsService>(ParseMIPsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('loggerMessage', async () => {
    const message = 'test';

    const mockLogger = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    service.loggerMessage(message);

    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith(message);
  });

  it('parse: with no pull request', async () => {
    const synchronizeData: ISynchronizeData = {
      creates: 1,
      deletes: 1,
      updates: 1,
    };

    let countPullRequest = 2;

    const mockPull = jest.spyOn(
      SimpleGitService.prototype,
      'pull'
    ).mockReturnValueOnce(
      null
    );

    const mockGetFiles = jest.spyOn(
      SimpleGitService.prototype,
      'getFiles'
    ).mockReturnValueOnce(
      Promise.resolve([gitFileMock])
    );

    const mockGetAll = jest.spyOn(
      MIPsService.prototype,
      'getAll'
    ).mockReturnValueOnce(
      Promise.resolve(mipMapMock)
    );

    const mockCount = jest.spyOn(
      PullRequestService.prototype,
      'count'
    ).mockReturnValueOnce(
      Promise.resolve(0)
    );

    const mockPullRequests = jest.spyOn(
      GithubService.prototype,
      'pullRequests'
    ).mockImplementation(async () => {
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

    const mockPullRequestsLast = jest.spyOn(
      GithubService.prototype,
      'pullRequestsLast'
    ).mockImplementation(async () => {
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

    const mockSynchronizeData = jest.spyOn(
      ParseMIPsService.prototype,
      'synchronizeData'
    ).mockReturnValueOnce(
      Promise.resolve(synchronizeData)
    );

    const mockSaveMetaVars = jest.spyOn(
      SimpleGitService.prototype,
      'saveMetaVars'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockCreate = jest.spyOn(
      PullRequestService.prototype,
      'create'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockLogger = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValue();

    const mockGroupProposal = jest.spyOn(
      MIPsService.prototype,
      'groupProposal'
    ).mockReturnValueOnce(
      Promise.resolve([mipMock])
    );

    const mockSetMipsFather = jest.spyOn(
      MIPsService.prototype,
      'setMipsFather'
    ).mockReturnValueOnce(
      Promise.resolve([true])
    );

    const mockUpdateSubproposalCountField = jest.spyOn(
      ParseMIPsService.prototype,
      'updateSubproposalCountField'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.parse();

    expect(result).toBeTruthy();
    expect(mockPull).toBeCalledTimes(1);
    expect(mockPull).toBeCalledWith(
      'origin',
      configService.get(Env.RepoBranch),
    );
    expect(mockGetFiles).toBeCalledTimes(1);
    expect(mockGetFiles).toBeCalledWith();
    expect(mockGetAll).toBeCalledTimes(1);
    expect(mockGetAll).toBeCalledWith();
    expect(mockCount).toBeCalledTimes(1);
    expect(mockCount).toBeCalledWith();
    expect(mockPullRequests).toBeCalledTimes(3);
    expect(mockPullRequests).toHaveBeenCalledWith(
      pullRequestsCount
    );
    expect(mockPullRequests).toHaveBeenCalledWith(
      pullRequests
    );
    expect(mockPullRequests).toHaveBeenCalledWith(
      pullRequestsAfter,
      'test_1',
    );
    expect(mockSynchronizeData).toBeCalledTimes(1);
    expect(mockSynchronizeData).toBeCalledWith(
      [gitFileMock],
      mipMapMock,
    );
    expect(mockPullRequestsLast).not.toBeCalled();
    expect(mockSaveMetaVars).toBeCalledTimes(1);
    expect(mockSaveMetaVars).toBeCalledWith();
    expect(mockCreate).toBeCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith({
      edges: ['test_1'],
    });
    expect(mockCreate).toHaveBeenCalledWith({
      edges: ['test_0'],
    });
    expect(mockLogger).toBeCalledTimes(2);
    expect(mockLogger).toHaveBeenCalledWith(
      `Synchronize Data ===> ${JSON.stringify(synchronizeData)}`,
    );
    expect(mockLogger).toHaveBeenCalledWith(
      `Mips with subproposals data ===> ${JSON.stringify([mipMock])}`
      );
    expect(mockGroupProposal).toBeCalledTimes(1);
    expect(mockGroupProposal).toBeCalledWith();
    expect(mockSetMipsFather).toBeCalledTimes(1);
    expect(mockSetMipsFather).toBeCalledWith([mipMock._id]);
    expect(mockUpdateSubproposalCountField).toBeCalledTimes(1);
    expect(mockUpdateSubproposalCountField).toBeCalledWith();
  });

  it('parse: with pull request', async () => {
    const synchronizeData: ISynchronizeData = {
      creates: 1,
      deletes: 1,
      updates: 1,
    };

    const mockPull = jest.spyOn(
      SimpleGitService.prototype,
      'pull'
    ).mockReturnValueOnce(
      null
    );

    const mockGetFiles = jest.spyOn(
      SimpleGitService.prototype,
      'getFiles'
    ).mockReturnValueOnce(
      Promise.resolve([gitFileMock])
    );

    const mockGetAll = jest.spyOn(
      MIPsService.prototype,
      'getAll'
    ).mockReturnValueOnce(
      Promise.resolve(mipMapMock)
    );

    const mockCount = jest.spyOn(
      PullRequestService.prototype,
      'count'
    ).mockReturnValueOnce(
      Promise.resolve(1)
    );

    const mockPullRequests = jest.spyOn(
      GithubService.prototype,
      'pullRequests'
    ).mockImplementation(async () => {
      return {
        repository: {
          pullRequests: {
            totalCount: 2,
          }
        }
      };
    });

    const mockPullRequestsLast = jest.spyOn(
      GithubService.prototype,
      'pullRequestsLast'
    ).mockImplementation(async () => {
      return {
        repository: {
          pullRequests: {
            nodes: {
              edges: ['test']
            },
          }
        }
      };
    });

    const mockSynchronizeData = jest.spyOn(
      ParseMIPsService.prototype,
      'synchronizeData'
    ).mockReturnValueOnce(
      Promise.resolve(synchronizeData)
    );

    const mockSaveMetaVars = jest.spyOn(
      SimpleGitService.prototype,
      'saveMetaVars'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockCreate = jest.spyOn(
      PullRequestService.prototype,
      'create'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockLogger = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValue();

    const mockGroupProposal = jest.spyOn(
      MIPsService.prototype,
      'groupProposal'
    ).mockReturnValueOnce(
      Promise.resolve([mipMock])
    );

    const mockSetMipsFather = jest.spyOn(
      MIPsService.prototype,
      'setMipsFather'
    ).mockReturnValueOnce(
      Promise.resolve([true])
    );

    const mockUpdateSubproposalCountField = jest.spyOn(
      ParseMIPsService.prototype,
      'updateSubproposalCountField'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.parse();

    expect(result).toBeTruthy();
    expect(mockPull).toBeCalledTimes(1);
    expect(mockPull).toBeCalledWith(
      'origin',
      configService.get(Env.RepoBranch),
    );
    expect(mockGetFiles).toBeCalledTimes(1);
    expect(mockGetFiles).toBeCalledWith();
    expect(mockGetAll).toBeCalledTimes(1);
    expect(mockGetAll).toBeCalledWith();
    expect(mockCount).toBeCalledTimes(1);
    expect(mockCount).toBeCalledWith();
    expect(mockPullRequests).toBeCalledTimes(1);
    expect(mockPullRequests).toBeCalledWith(
      pullRequestsCount
    );
    expect(mockPullRequestsLast).toBeCalledTimes(1);
    expect(mockPullRequestsLast).toBeCalledWith(
      pullRequestsLast,
      1,
    );
    expect(mockSynchronizeData).toBeCalledTimes(1);
    expect(mockSynchronizeData).toBeCalledWith(
      [gitFileMock],
      mipMapMock,
    );
    expect(mockSaveMetaVars).toBeCalledTimes(1);
    expect(mockSaveMetaVars).toBeCalledWith();
    expect(mockCreate).toBeCalledTimes(1);
    expect(mockCreate).toBeCalledWith({
      edges: ['test'],
    });
    expect(mockLogger).toBeCalledTimes(3);
    expect(mockLogger).toHaveBeenCalledWith(
      `Synchronize Data ===> ${JSON.stringify(synchronizeData)}`,
    );
    expect(mockLogger).toHaveBeenCalledWith(
      `Mips with subproposals data ===> ${JSON.stringify([mipMock])}`
    );
    expect(mockGroupProposal).toBeCalledTimes(1);
    expect(mockGroupProposal).toBeCalledWith();
    expect(mockSetMipsFather).toBeCalledTimes(1);
    expect(mockSetMipsFather).toBeCalledWith([mipMock._id]);
    expect(mockUpdateSubproposalCountField).toBeCalledTimes(1);
    expect(mockUpdateSubproposalCountField).toBeCalledWith();
  });

  it('parse: error while pull', async () => {

    const synchronizeData: ISynchronizeData = {
      creates: 1,
      deletes: 1,
      updates: 1,
    };

    const mockPull = jest.spyOn(
      SimpleGitService.prototype,
      'pull'
    ).mockImplementationOnce(() => {
      throw new Error("forcing error");
    });

    const mockGetFiles = jest.spyOn(
      SimpleGitService.prototype,
      'getFiles'
    ).mockReturnValueOnce(
      Promise.resolve([gitFileMock])
    );

    const mockGetAll = jest.spyOn(
      MIPsService.prototype,
      'getAll'
    ).mockReturnValueOnce(
      Promise.resolve(mipMapMock)
    );

    const mockCount = jest.spyOn(
      PullRequestService.prototype,
      'count'
    ).mockReturnValueOnce(
      Promise.resolve(1)
    );

    const mockPullRequests = jest.spyOn(
      GithubService.prototype,
      'pullRequests'
    ).mockReturnValueOnce(
      Promise.resolve(null)
    );

    const mockPullRequestsLast = jest.spyOn(
      GithubService.prototype,
      'pullRequestsLast'
    ).mockReturnValueOnce(
      Promise.resolve(null)
    );

    const mockSynchronizeData = jest.spyOn(
      ParseMIPsService.prototype,
      'synchronizeData'
    ).mockReturnValueOnce(
      Promise.resolve(synchronizeData)
    );

    const mockSaveMetaVars = jest.spyOn(
      SimpleGitService.prototype,
      'saveMetaVars'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockCreate = jest.spyOn(
      PullRequestService.prototype,
      'create'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockLogger = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValue();

    const mockGroupProposal = jest.spyOn(
      MIPsService.prototype,
      'groupProposal'
    ).mockReturnValueOnce(
      Promise.resolve([mipMock])
    );

    const mockSetMipsFather = jest.spyOn(
      MIPsService.prototype,
      'setMipsFather'
    ).mockReturnValueOnce(
      Promise.resolve([true])
    );

    const mockUpdateSubproposalCountField = jest.spyOn(
      ParseMIPsService.prototype,
      'updateSubproposalCountField'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.parse();

    expect(result).toBeFalsy();
    expect(mockPull).toBeCalledTimes(1);
    expect(mockPull).toBeCalledWith(
      'origin',
      configService.get(Env.RepoBranch),
    );
    expect(mockGetFiles).not.toBeCalled();
    expect(mockGetAll).not.toBeCalled();
    expect(mockCount).not.toBeCalled();
    expect(mockPullRequests).not.toBeCalled();
    expect(mockPullRequestsLast).not.toBeCalled();
    expect(mockSynchronizeData).not.toBeCalled();
    expect(mockSaveMetaVars).not.toBeCalled();
    expect(mockCreate).not.toBeCalled();
    expect(mockLogger).not.toBeCalled();
    expect(mockGroupProposal).not.toBeCalled();
    expect(mockSetMipsFather).not.toBeCalled();
    expect(mockUpdateSubproposalCountField).not.toBeCalled();
  });

  it('parseMIP: new mip', async () => {
    const isNewMIP = true;
    const baseUrl = `${process.cwd()}/${configService.get<string>(
      Env.FolderRepositoryName
    )}`;

    const mockLog = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    const mockParseLexerData = jest.spyOn(
      ParseMIPsService.prototype,
      'parseLexerData'
    ).mockReturnValueOnce(mipMock);

    const result = await service.parseMIP(mipMock, isNewMIP);

    expect(result).toBeDefined();
    expect(result).toEqual(mipMock);
    expect(mockLog).toBeCalledTimes(1);
    expect(mockLog).toBeCalledWith(`Parse new mip item update => ${mipMock.filename}`);
    expect(readFile).toBeCalledTimes(1);
    expect(readFile).toBeCalledWith(
      `${baseUrl}/${mipMock.filename}`,
      'utf-8'
    );
    expect(mockParseLexerData).toBeCalledTimes(1);
    expect(mockParseLexerData).toBeCalledWith(
      'test',
      mipMock,
    );
  });

  it('parseMIP: not new mip', async () => {
    const isNewMIP = false;
    const baseUrl = `${process.cwd()}/${configService.get<string>(
      Env.FolderRepositoryName
    )}`;

    const mockLog = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    const mockParseLexerData = jest.spyOn(
      ParseMIPsService.prototype,
      'parseLexerData'
    ).mockReturnValueOnce(mipMock);

    const result = await service.parseMIP(mipMock, isNewMIP);

    expect(result).toBeDefined();
    expect(result).toEqual(mipMock);
    expect(mockLog).toBeCalledTimes(1);
    expect(mockLog).toBeCalledWith(`Parse mip item update => ${mipMock.filename}`);
    expect(readFile).toBeCalledTimes(1);
    expect(readFile).toBeCalledWith(
      `${baseUrl}/${mipMock.filename}`,
      'utf-8'
    );
    expect(mockParseLexerData).toBeCalledTimes(1);
    expect(mockParseLexerData).toBeCalledWith(
      'test',
      mipMock,
    );
  });

  it('deleteMipsFromMap', async () => {
    const mockDeleteManyByIds = jest.spyOn(
      MIPsService.prototype,
      'deleteManyByIds'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    await service.deleteMipsFromMap(mipMapMock);

    expect(mockDeleteManyByIds).toBeCalledTimes(1);
    expect(mockDeleteManyByIds).toBeCalledWith([mipMock._id]);
  });

  it('updateIfDifferentHash: different hash', async () => {
    const mip_2 = {
      ...mipMock,
      hash: 'hash_2',
    };

    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockReturnValueOnce(
      Promise.resolve(mipMock)
    );

    const mockUpdate = jest.spyOn(
      MIPsService.prototype,
      'update'
    ).mockReturnValueOnce(
      Promise.resolve(mipMock)
    );

    const mockError = jest.spyOn(
      Logger.prototype,
      'error'
    ).mockReturnValueOnce();

    const result = await service.updateIfDifferentHash(mipMock, mip_2);

    expect(result).toBeTruthy();
    expect(mockParseMIP).toBeCalledTimes(1);
    expect(mockParseMIP).toBeCalledWith(mip_2, false);
    expect(mockUpdate).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledWith(mipMock._id, mipMock);
    expect(mockError).not.toBeCalled();
  });

  it('updateIfDifferentHash: different hash and error while update', async () => {
    const mip_2 = {
      ...mipMock,
      hash: 'hash_2',
    };

    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockReturnValueOnce(
      Promise.resolve(mipMock)
    );

    const mockUpdate = jest.spyOn(
      MIPsService.prototype,
      'update'
    ).mockImplementationOnce(async () => {
      throw new Error('Forcing error');
    });

    const mockError = jest.spyOn(
      Logger.prototype,
      'error'
    ).mockReturnValueOnce();

    const result = await service.updateIfDifferentHash(mipMock, mip_2);

    expect(result).toBeTruthy();
    expect(mockParseMIP).toBeCalledTimes(1);
    expect(mockParseMIP).toBeCalledWith(mip_2, false);
    expect(mockUpdate).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledWith(mipMock._id, mipMock);
    expect(mockError).toBeCalledTimes(1);
    expect(mockError).toBeCalledWith('Forcing error');
  });

  it('updateIfDifferentHash: not different hash', async () => {
    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockReturnValueOnce(
      Promise.resolve(mipMock)
    );

    const mockUpdate = jest.spyOn(
      MIPsService.prototype,
      'update'
    ).mockReturnValueOnce(
      Promise.resolve(mipMock)
    );

    const mockError = jest.spyOn(
      Logger.prototype,
      'error'
    ).mockReturnValueOnce();

    const result = await service.updateIfDifferentHash(mipMock, mipMock);

    expect(result).toBeFalsy();
    expect(mockParseMIP).not.toBeCalled();
    expect(mockUpdate).not.toBeCalled();
    expect(mockError).not.toBeCalled();
  });

  it('synchronizeData: new MIP', async () => {
    const filesGit: IGitFile[] = [{
      ...mipMock,
      filename: 'test.md',
    }];

    const mip_2 = {
      ...mipMock,
      mip: undefined,
      mipName: undefined,
    };

    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockReturnValueOnce(
      Promise.resolve(mip_2)
    );

    const mockLog = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    console.log = jest.fn();

    const mockUpdateIfDifferentHash = jest.spyOn(
      ParseMIPsService.prototype,
      'updateIfDifferentHash'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockDeleteMipsFromMap = jest.spyOn(
      ParseMIPsService.prototype,
      'deleteMipsFromMap'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockInsertMany = jest.spyOn(
      MIPsService.prototype,
      'insertMany'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.synchronizeData(
      filesGit,
      mipMapMock,
    );

    expect(result).toEqual({
      creates: 1,
      deletes: 1,
      updates: 0,
    });
    expect(mockParseMIP).toBeCalledTimes(1);
    expect(mockParseMIP).toBeCalledWith(filesGit[0], false);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith({
      mip: mip_2,
      item: filesGit[0],
      TODO: "Convert into a notification Service"
    });
    expect(mockLog).toBeCalledTimes(1);
    expect(mockLog).toBeCalledWith(
      `Mips with problems to parse ==> ${(mip_2.mip, mip_2.mipName, mip_2.filename)
      }`
    );
    expect(mockUpdateIfDifferentHash).not.toBeCalled();
    expect(mockDeleteMipsFromMap).toBeCalledTimes(1);
    expect(mockDeleteMipsFromMap).toBeCalledWith(
      mipMapMock,
    );
    expect(mockInsertMany).toBeCalledTimes(1);
    expect(mockInsertMany).toBeCalledWith(
      [mip_2],
    );
  });

  it('synchronizeData: new MIP and error while parseMIP', async () => {
    const filesGit: IGitFile[] = [{
      ...mipMock,
      filename: 'test.md',
    }];

    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockImplementationOnce(async () => {
      throw new Error('Forcing error');
    });

    const mockLog = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    console.log = jest.fn();

    const mockUpdateIfDifferentHash = jest.spyOn(
      ParseMIPsService.prototype,
      'updateIfDifferentHash'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockDeleteMipsFromMap = jest.spyOn(
      ParseMIPsService.prototype,
      'deleteMipsFromMap'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockInsertMany = jest.spyOn(
      MIPsService.prototype,
      'insertMany'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.synchronizeData(
      filesGit,
      mipMapMock,
    );

    expect(result).toEqual({
      creates: 0,
      deletes: 1,
      updates: 0,
    });
    expect(mockParseMIP).toBeCalledTimes(1);
    expect(mockParseMIP).toBeCalledWith(filesGit[0], false);
    expect(console.log).not.toBeCalled();
    expect(mockLog).toBeCalledTimes(1);
    expect(mockLog).toBeCalledWith(
      'Forcing error'
    );
    expect(mockUpdateIfDifferentHash).not.toBeCalled();
    expect(mockDeleteMipsFromMap).toBeCalledTimes(1);
    expect(mockDeleteMipsFromMap).toBeCalledWith(
      mipMapMock,
    );
    expect(mockInsertMany).toBeCalledTimes(1);
    expect(mockInsertMany).toBeCalledWith([]);
  });

  it('synchronizeData: no new MIP', async () => {
    const mip_2 = {
      ...mipMock,
      mip: undefined,
      mipName: undefined,
    };

    const mockParseMIP = jest.spyOn(
      ParseMIPsService.prototype,
      'parseMIP'
    ).mockReturnValueOnce(
      Promise.resolve(mip_2)
    );

    const mockLog = jest.spyOn(
      Logger.prototype,
      'log'
    ).mockReturnValueOnce();

    console.log = jest.fn();

    const mockUpdateIfDifferentHash = jest.spyOn(
      ParseMIPsService.prototype,
      'updateIfDifferentHash'
    ).mockReturnValueOnce(
      Promise.resolve(true)
    );

    const mockDeleteMipsFromMap = jest.spyOn(
      ParseMIPsService.prototype,
      'deleteMipsFromMap'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const mockInsertMany = jest.spyOn(
      MIPsService.prototype,
      'insertMany'
    ).mockReturnValueOnce(
      Promise.resolve()
    );

    const result = await service.synchronizeData(
      [mipMock],
      mipMapMock,
    );

    expect(result).toEqual({
      creates: 0,
      deletes: 0,
      updates: 1,
    });
    expect(mockParseMIP).not.toBeCalled();
    expect(console.log).not.toBeCalled();
    expect(mockLog).not.toBeCalled();
    expect(mockUpdateIfDifferentHash).toBeCalledTimes(1);
    expect(mockUpdateIfDifferentHash).toBeCalledWith(
      gitFileMock,
      mipMock,
    );
    expect(mockDeleteMipsFromMap).toBeCalledTimes(1);
    expect(mockDeleteMipsFromMap).toBeCalledWith(
      new Map(),
    );
    expect(mockInsertMany).toBeCalledTimes(1);
    expect(mockInsertMany).toBeCalledWith(
      [],
    );
  });

  it('getComponentsSection: component summary', async () => {
    const result = service.getComponentsSection(mipFile);

    expect(result).toEqual(componentSummary);
  });

  it('getComponentsSection: no component summary', async () => {
    const data = 'test';

    const result = service.getComponentsSection(data);

    expect(result).toEqual('');
  });

  it('getComponentsSection: component summary without end', async () => {
    const data = "**MIP0c1: Core Principles\n\nsomething";

    const result = service.getComponentsSection(data);

    expect(result).toEqual('**MIP0c1: Core Principles\n\nsomething');
  });

  it('getDataFromComponentText', async () => {
    const result = service.getDataFromComponentText(componentSummary);

    expect(result).toEqual(components);
  });

  it('parseMipsNamesComponentsSubproposals: is on component summary', async () => {
    const markedFile: any[] = marked.lexer(mipFile);
    const element = markedFile[12];
    const isOnComponentSummary = true;

    const result = service.parseMipsNamesComponentsSubproposals(
      element,
      isOnComponentSummary
    );

    expect(result).toEqual(
      `## Component Summary\n\n`
    );
  });

  it('parseMipsNamesComponentsSubproposals: heading not on component summary', async () => {
    const markedFile: any[] = marked.lexer(mipFile);
    const element = markedFile[0];
    const isOnComponentSummary = false;

    const result = service.parseMipsNamesComponentsSubproposals(
      element,
      isOnComponentSummary
    );

    expect(result).toEqual(
      `# MIP0: The Maker Improvement Proposal Framework\n\n`
    );
  });

  it('parseMipsNamesComponentsSubproposals: not heading that is not on component summary', async () => {
    const markedFile: any[] = marked.lexer(mipFile);
    const element = markedFile[203];
    const isOnComponentSummary = false;

    const result = service.parseMipsNamesComponentsSubproposals(
      element,
      isOnComponentSummary
    );

    expect(result).toEqual(
      'MIP0c13 is a Process MIP component that allows the removal of core personnel using a subproposal. [MIP0c13](mips/details/MIP0#MIP0c13 "smart-Component") subproposals have the following parameters:'
    );
  });

  describe("Syncronize data", () => {
    it("should return the empty mip parse", async () => {
      service.baseDir = `${process.cwd()}/src/mips/services/data-test`;
      const files = new Map();

      const sinchronizeData = await service.synchronizeData(
        [
          {
            hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
            filename: "MIP1/mip1.md",
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
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        language: Language.English
      });

      expect(mip).toMatchObject(mipData);
    });
  });

  describe("Parse Preamble", () => {
    it("should return the empty preamble", async () => {
      const data = "";

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
