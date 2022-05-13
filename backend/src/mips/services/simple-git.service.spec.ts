import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { SimpleGitService } from "./simple-git.service";

describe("SimpleGitService", () => {
  let module: TestingModule;
  let simpleGitService: SimpleGitService;
  let configService: ConfigService;
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

    simpleGitService = module.get(SimpleGitService);
    configService = module.get(ConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  jest.setTimeout(3 * 60 * 1000);

  describe("cloneRepository", () => {
    it("clone repository", async () => {
      const cloneMessage = 'clone';

      const clone = jest.fn(() => {
        return Promise.resolve(cloneMessage);
      });
      (simpleGitService as any).git = {
        clone,
      };

      const result = await simpleGitService.cloneRepository();

      expect(result).toEqual(cloneMessage);
      expect(clone).toHaveBeenCalledTimes(1);
      expect(clone).toHaveBeenCalledWith(
        configService.get<string>(Env.RepoPath),
        `${process.cwd()}/${configService.get<string>(
          Env.FolderRepositoryName
        )}`,
      );
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});