import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { cloneMessageMock, pullErrorMock, pullMock } from "./data-test/data";
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
  let countFailedPullCalls = 1;

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
    clone = jest.fn(() => {
      return Promise.resolve(cloneMessageMock);
    });
    pull = jest.fn(async () => {
      if (countFailedPullCalls > 0) {
        countFailedPullCalls--;
        throw new Error(pullErrorMock);
      }
      return pullMock;
    });
    fetch = jest.fn();
    reset = jest.fn();
    (simpleGitService as any).git = {
      clone,
      pull,
      fetch,
      reset,
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
      countFailedPullCalls = 0;
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
  })

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});