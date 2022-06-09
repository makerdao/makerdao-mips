import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { countPullRequestMock, fileNameMock, insertManyMock, pullRequestMock } from "./data-test/data";
import { PullRequestService } from "./pull-requests.service";
const faker = require("faker");

describe('PullRequestService', () => {
    let pullRequestService: PullRequestService;
    let module: TestingModule;
    let mongoMemoryServer;

    let insertMany;
    let countDocuments;
    let exec;
    let aggregate;
    let execAggregate;

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

        pullRequestService = module.get(PullRequestService);
    });


    beforeEach(() => {
        exec = jest.fn(async () => countPullRequestMock);
        execAggregate = jest.fn(async () => countPullRequestMock);
        countDocuments = jest.fn(() => ({ exec }));
        insertMany = jest.fn(async () => insertManyMock);
        aggregate = jest.fn(() => ({ exec: execAggregate }));
        (pullRequestService as any).pullRequestDoc = {
            insertMany,
            countDocuments,
            aggregate,
        };
    });

    describe('create', () => {
        it('create a pull request', async () => {
            const result = await pullRequestService.create([pullRequestMock]);

            expect(result).toEqual(insertManyMock);
            expect(insertMany).toBeCalledTimes(1);
            expect(insertMany).toBeCalledWith([pullRequestMock]);
        });
    });

    describe('count', () => {
        it('count pull request', async () => {
            const result = await pullRequestService.count();

            expect(result).toEqual(countPullRequestMock);
            expect(countDocuments).toBeCalledTimes(1);
            expect(countDocuments).toBeCalledWith();
            expect(exec).toBeCalledTimes(1);
            expect(exec).toBeCalledWith();
        });
    });

    describe('aggregate', () => {
        it('aggregate pull request', async () => {
            const result = await pullRequestService.aggregate(fileNameMock);

            expect(result).toEqual(countPullRequestMock);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                { $sort: { createdAt: -1 } },
                { $match: { "files.nodes": { path: fileNameMock } } },
                {
                    $facet: {
                        open: [
                            { $match: { state: "OPEN" } },
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ],
                        close: [
                            { $match: { state: { $in: ["MERGED", "CLOSED"] } } },
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ],
                        items: [{
                            $group: {
                                _id: null, data: {
                                    $push: {
                                        id: "$_id",
                                        url: "$url",
                                        title: "$title",
                                        body: "$body",
                                        createdAt: "$createdAt",
                                        author: "$author",
                                        state: "$state"
                                    }
                                }
                            }
                        }],
                    },
                },
                {
                    $project: {
                        open: { $ifNull: [{ $arrayElemAt: ["$open.count", 0] }, 0] },
                        close: { $ifNull: [{ $arrayElemAt: ["$close.count", 0] }, 0] },
                        items: {
                            $slice: [
                                { $ifNull: [{ $arrayElemAt: ["$items.data", 0] }, []] },
                                3,
                            ],
                        },
                    },
                },
            ]);
            expect(execAggregate).toBeCalledTimes(1);
            expect(execAggregate).toBeCalledWith();
        });

        it('aggregate pull request', async () => {
            execAggregate.mockReturnValueOnce([countPullRequestMock, countPullRequestMock])

            const result = await pullRequestService.aggregate(fileNameMock);

            expect(result).toEqual(countPullRequestMock);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                { $sort: { createdAt: -1 } },
                { $match: { "files.nodes": { path: fileNameMock } } },
                {
                    $facet: {
                        open: [
                            { $match: { state: "OPEN" } },
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ],
                        close: [
                            { $match: { state: { $in: ["MERGED", "CLOSED"] } } },
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ],
                        items: [{
                            $group: {
                                _id: null, data: {
                                    $push: {
                                        id: "$_id",
                                        url: "$url",
                                        title: "$title",
                                        body: "$body",
                                        createdAt: "$createdAt",
                                        author: "$author",
                                        state: "$state"
                                    }
                                }
                            }
                        }],
                    },
                },
                {
                    $project: {
                        open: { $ifNull: [{ $arrayElemAt: ["$open.count", 0] }, 0] },
                        close: { $ifNull: [{ $arrayElemAt: ["$close.count", 0] }, 0] },
                        items: {
                            $slice: [
                                { $ifNull: [{ $arrayElemAt: ["$items.data", 0] }, []] },
                                3,
                            ],
                        },
                    },
                },
            ]);
            expect(execAggregate).toBeCalledTimes(1);
            expect(execAggregate).toBeCalledWith();
        });
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});