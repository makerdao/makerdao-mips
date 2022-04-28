import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MIPsModule } from "../mips.module";
import { SimpleGitService } from "./simple-git.service";

describe("SimpleGitService", () => {
    let module: TestingModule;
    let simpleGitService: SimpleGitService;
    let configService: ConfigService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                MIPsModule,
                ConfigModule.forRoot({
                    isGlobal: true
                }),
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get<string>(Env.MongoDBUri),
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

    it("cloneRepository", async () => {

        const cloneMessage = 'clone';
        const clone = jest.fn((repoPath, localPath) => {
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

    afterAll(async () => {
        await module.close();
    });
});