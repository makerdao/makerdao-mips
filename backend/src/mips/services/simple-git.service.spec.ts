import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { cloneMessageMock, fileNameMock, getFilesResultMock, getLongerFilesResultMock, hashMock, languageMock, longerRawResultMock, pullErrorMock, pullMock, rawResultMock } from "./data-test/data";
import { SimpleGitService } from "./simple-git.service";
const faker = require("faker");

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
      expect(fetch).toBeCalledWith({ '--all': 'true' });
      expect(reset).toBeCalledTimes(1);
      expect(reset).toBeCalledWith(["--hard", "origin/master"]);
    });
  });

  describe('getFiles', () => {
    it('get files', async () => {
      jest.spyOn(SimpleGitService.prototype, 'getLanguage').mockReturnValueOnce(languageMock);

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
    });
    
    it('get longer files', async () => {
      raw.mockReturnValue(longerRawResultMock);
      jest.spyOn(SimpleGitService.prototype, 'getLanguage').mockReturnValueOnce(languageMock);

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
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});