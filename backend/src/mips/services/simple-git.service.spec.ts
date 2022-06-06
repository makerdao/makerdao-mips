import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language } from "../entities/mips.entity";
import { MIPsModule } from "../mips.module";
import { cloneMessageMock, errorReadFileMock, fileNameMock, getFilesResultMock, getLongerFilesResultMock, hashMock, languageFileNameMock, languageMock, longerRawResultMock, pullErrorMock, pullMock, rawResultMock, readFileResultMock, translationMetaVarsMock } from "./data-test/data";
import { SimpleGitService } from "./simple-git.service";
import { readFile } from "fs/promises";
import { Logger } from "@nestjs/common";
const faker = require("faker");

jest.mock("fs/promises", () => {
  return {
    readFile: jest.fn(async () => readFileResultMock),
  };
});

describe("SimpleGitService", () => {
  let module: TestingModule;
  let simpleGitService: SimpleGitService;
  let configService: ConfigService;
  let mongoMemoryServer;

  let clone;
  let pull;
  let fetch;
  let reset;
  let countFailedPullCalls = 0;
  let raw;
  let deleteMany;
  let insertMany;
  let find;

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

    faker.seed('SimpleGitService');

    simpleGitService = module.get(SimpleGitService);
    configService = module.get(ConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    console.log = jest.fn();
    clone = jest.fn(async () => {
      return cloneMessageMock;
    });
    pull = jest.fn(async () => {
      if (countFailedPullCalls > 0) {
        countFailedPullCalls--;
        throw new Error(pullErrorMock);
      }
      return pullMock;
    });
    raw = jest.fn(async () => rawResultMock);
    fetch = jest.fn();
    reset = jest.fn();
    (simpleGitService as any).git = {
      clone,
      pull,
      fetch,
      reset,
      raw,
    };
    deleteMany = jest.fn();
    insertMany = jest.fn();
    find = jest.fn(async () => translationMetaVarsMock);
    (simpleGitService as any).metaDocument = {
      deleteMany,
      insertMany,
      find,
    };
    Logger.prototype.error = jest.fn();
  });

  jest.setTimeout(3 * 60 * 1000);

  describe("cloneRepository", () => {
    it("clone repository", async () => {
      const result = await simpleGitService.cloneRepository();

      expect(result).toEqual(cloneMessageMock);
      expect(clone).toHaveBeenCalledTimes(1);
      expect(clone).toHaveBeenCalledWith(
        configService.get<string>(Env.RepoPath),
        `${process.cwd()}/${configService.get<string>(
          Env.FolderRepositoryName
        )}`,
      );
    });
  });

  describe('pull', () => {
    it('pull commits', async () => {
      const result = await simpleGitService.pull();

      expect(result).toEqual(pullMock);
      expect(pull).toBeCalledTimes(1);
      expect(pull).toHaveBeenCalledWith(
        'origin',
        'master',
      );
    });

    it('error during pull', async () => {
      countFailedPullCalls = 1;

      const result = await simpleGitService.pull();

      expect(result).toEqual(pullMock);
      expect(pull).toBeCalledTimes(2);
      expect(pull).toHaveBeenNthCalledWith(
        1,
        'origin',
        'master',
      );
      expect(pull).toHaveBeenNthCalledWith(
        2,
        'origin',
        'master',
      );
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith({
        error: new Error(pullErrorMock),
        text: 'Error autoresolved by hard reset origin/master strategy',
      });
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(['--all']);
      expect(reset).toBeCalledTimes(1);
      expect(reset).toBeCalledWith(["--hard", "origin/master"]);
    });
  });

  describe('getLanguage', () => {
    it('get language from file name', async () => {
      const result = await simpleGitService.getLanguage(languageFileNameMock);

      expect(result).toEqual(languageMock);
    });

    it('get default language', async () => {
      const result = await simpleGitService.getLanguage(languageMock);

      expect(result).toEqual(Language.English);
    });
  });

  describe('getFiles', () => {
    beforeEach(() => {
      jest.spyOn(SimpleGitService.prototype, 'getLanguage').mockReturnValue(languageMock);
    });

    it('get files', async () => {
      const result = await simpleGitService.getFiles();

      expect(result).toEqual(getFilesResultMock);
      expect(raw).toBeCalledTimes(2);
      expect(raw).toHaveBeenNthCalledWith(
        1,
        [
          "ls-files",
          "-s",
          configService.get<string>(Env.FolderPattern),
        ]
      );
      expect(raw).toHaveBeenNthCalledWith(
        2,
        [
          "ls-files",
          "-s",
          "I18N",
        ]
      );
      expect(SimpleGitService.prototype.getLanguage).toBeCalledTimes(2);
      expect(SimpleGitService.prototype.getLanguage).toHaveBeenCalledWith(fileNameMock + '.md');
    });

    it('get longer files', async () => {
      raw.mockReturnValue(longerRawResultMock);

      const result = await simpleGitService.getFiles();

      expect(result).toEqual(getLongerFilesResultMock);
      expect(raw).toBeCalledTimes(2);
      expect(raw).toHaveBeenNthCalledWith(
        1,
        [
          "ls-files",
          "-s",
          configService.get<string>(Env.FolderPattern),
        ]
      );
      expect(raw).toHaveBeenNthCalledWith(
        2,
        [
          "ls-files",
          "-s",
          "I18N",
        ]
      );
      expect(SimpleGitService.prototype.getLanguage).toBeCalledTimes(2);
      expect(SimpleGitService.prototype.getLanguage).toHaveBeenCalledWith(fileNameMock + ' ' + fileNameMock + '.md');
    });

    it('error in raw', async () => {
      raw.mockImplementationOnce(() => {
        throw new Error(errorReadFileMock);
      });

      const result = await simpleGitService.getFiles();

      expect(result).toEqual(new Error(errorReadFileMock));
      expect(raw).toBeCalledTimes(1);
      expect(raw).toBeCalledWith([
        "ls-files",
        "-s",
        configService.get<string>(Env.FolderPattern),
      ]);
      expect(Logger.prototype.error).toBeCalledTimes(1);
      expect(Logger.prototype.error).toBeCalledWith(
        new Error(errorReadFileMock)
      );
      expect(SimpleGitService.prototype.getLanguage).not.toBeCalled();
    });
  });

  describe('saveMetaVars', () => {
    it('save metavars', async () => {
      await simpleGitService.saveMetaVars();

      expect(deleteMany).toBeCalledTimes(1);
      expect(deleteMany).toBeCalledWith({});
      expect(insertMany).toBeCalledTimes(1);
      expect(insertMany).toBeCalledWith(translationMetaVarsMock);
    });

    it('error while read file', async () => {
      (readFile as any).mockImplementationOnce(() => {
        throw new Error(errorReadFileMock);
      });

      await simpleGitService.saveMetaVars();

      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith({ error: new Error(errorReadFileMock) })
      expect(deleteMany).toBeCalledTimes(1);
      expect(deleteMany).toBeCalledWith({});
      expect(insertMany).toBeCalledTimes(1);
      expect(insertMany).toBeCalledWith([]);
    });
  });

  describe('getMetaVars', () => {
    it('get metavars', async () => {
      const result = await simpleGitService.getMetaVars();

      expect(result).toEqual(translationMetaVarsMock);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({});
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});