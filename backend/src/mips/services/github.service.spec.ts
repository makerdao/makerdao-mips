import { Env } from "@app/env";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphQLClient, RequestDocument } from "graphql-request";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { GithubService } from "./github.service";


describe("GithubService", () => {
    let githubService: GithubService;
    let module: TestingModule;
    let configService: ConfigService;
    let mongoMemoryServer;

    const pullRequestsMock: RequestDocument = {
        definitions: [],
        kind: "Document",
    };

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

        githubService = module.get<GithubService>(GithubService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it("should be defined", () => {
        expect(githubService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    jest.setTimeout(3 * 60 * 1000);

    it("pullRequests: without after", async () => {
        const mockRequest = jest.spyOn(
            GraphQLClient.prototype,
            "request"
        ).mockReturnValueOnce(
            Promise.resolve("test")
        );

        const result = await githubService.pullRequests(pullRequestsMock);

        expect(result).toBeDefined();
        expect(result).toEqual("test");
        expect(mockRequest).toHaveBeenCalledTimes(1);
        expect(mockRequest).toHaveBeenCalledWith(pullRequestsMock, {
            name: configService.get<string>(
                Env.GithubRepository
            ),
            owner: configService.get<string>(
                Env.GithubRepositoryOwner
            ),
        });
    });

    it("pullRequests: with after", async () => {
        const after = "test";

        const mockRequest = jest.spyOn(
            GraphQLClient.prototype,
            "request"
        ).mockReturnValueOnce(
            Promise.resolve("test")
        );

        const result = await githubService.pullRequests(
            pullRequestsMock,
            after,
        );

        expect(result).toBeDefined();
        expect(result).toEqual("test");
        expect(mockRequest).toHaveBeenCalledTimes(1);
        expect(mockRequest).toHaveBeenCalledWith(pullRequestsMock, {
            name: configService.get<string>(
                Env.GithubRepository
            ),
            owner: configService.get<string>(
                Env.GithubRepositoryOwner
            ),
            after,
        });
    });

    it("pullRequestsLast", async () => {
        const last = 2;

        const mockRequest = jest.spyOn(
            GraphQLClient.prototype,
            "request"
        ).mockReturnValueOnce(
            Promise.resolve("test")
        );

        const result = await githubService.pullRequestsLast(
            pullRequestsMock,
            last,
        );

        expect(result).toBeDefined();
        expect(result).toEqual("test");
        expect(mockRequest).toHaveBeenCalledTimes(1);
        expect(mockRequest).toHaveBeenCalledWith(pullRequestsMock, {
            name: configService.get<string>(
                Env.GithubRepository
            ),
            owner: configService.get<string>(
                Env.GithubRepositoryOwner
            ),
            last,
        });

    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});