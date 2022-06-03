import { Env } from "@app/env";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphQLClient } from "graphql-request";
import { MongoMemoryServer } from "mongodb-memory-server";
import { openIssue } from "../graphql/definitions.graphql";
import { MIPsModule } from "../mips.module";
import { openIssueBodyMock, openIssueTitleMock, pullRequestsMock, requestGraphql } from "./data-test/data";
import { GithubService } from "./github.service";
const faker = require("faker");


describe("GithubService", () => {
    let githubService: GithubService;
    let module: TestingModule;
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

        faker.seed('GithubService');

        githubService = module.get<GithubService>(GithubService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it("should be defined", () => {
        expect(githubService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        GraphQLClient.prototype.request = jest.fn(async () => requestGraphql as any);
    });

    jest.setTimeout(3 * 60 * 1000);

    describe("pullRequests", () => {
        it("without after", async () => {
            const result = await githubService.pullRequests(pullRequestsMock);

            expect(result).toBeDefined();
            expect(result).toEqual(requestGraphql);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledWith(pullRequestsMock, {
                name: configService.get<string>(
                    Env.GithubRepository
                ),
                owner: configService.get<string>(
                    Env.GithubRepositoryOwner
                ),
            });
        });

        it("from last one(after)", async () => {
            const after = faker.random.word();

            const result = await githubService.pullRequests(
                pullRequestsMock,
                after,
            );

            expect(result).toBeDefined();
            expect(result).toEqual(requestGraphql);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledWith(pullRequestsMock, {
                name: configService.get<string>(
                    Env.GithubRepository
                ),
                owner: configService.get<string>(
                    Env.GithubRepositoryOwner
                ),
                after,
            });
        });
    });

    describe('pullRequestsLast', () => {
        it("get last pull request", async () => {
            const last = faker.datatype.number();

            const result = await githubService.pullRequestsLast(
                pullRequestsMock,
                last,
            );

            expect(result).toBeDefined();
            expect(result).toEqual(requestGraphql);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledWith(pullRequestsMock, {
                name: configService.get<string>(
                    Env.GithubRepository
                ),
                owner: configService.get<string>(
                    Env.GithubRepositoryOwner
                ),
                last,
            });

        });
    });

    describe('openIssue', () => {
        it("open issue", async () => {
            const result = await githubService.openIssue(
                openIssue,
                openIssueTitleMock,
                openIssueBodyMock,
            );

            expect(result).toBeDefined();
            expect(result).toEqual(requestGraphql);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledTimes(1);
            expect(GraphQLClient.prototype.request).toHaveBeenCalledWith(openIssue, {
                repositoryId: configService.get<string>(
                    Env.GithubRepositoryId
                ),
                title: openIssueTitleMock,
                body: openIssueBodyMock,
            });

        });
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});