import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import * as marked from "marked";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { markedLexerMock, markedMock } from "./data-test/data";
import { MarkedService } from "./marked.service";
const faker = require("faker");

jest.mock("marked", () => {
    const mock = jest.fn(() => markedMock);
    (mock as any).lexer = () => {
        return markedLexerMock;
    };
    return mock;
});

describe("MarkedService", () => {
    let module: TestingModule;
    let markedService: MarkedService;
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

        faker.seed('MarkedService');

        markedService = module.get(MarkedService);
    });

    it("should be defined", () => {
        expect(markedService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        marked.lexer = jest.fn(() => markedLexerMock);
    });

    jest.setTimeout(3 * 60 * 1000);

    describe("markedLexer", () => {
        it("divide into tokens", async () => {
            const data = faker.random.word();

            const result = markedService.markedLexer(data);

            expect(result).toBeDefined();
            expect(result).toEqual(markedLexerMock);
            expect(marked.lexer).toHaveBeenCalledTimes(1);
            expect(marked.lexer).toHaveBeenCalledWith(data);
        });
    });

    describe('markedHtml', () => {
        it("convert to html", async () => {
            const data = faker.random.word();

            const result = markedService.markedHtml(data);

            expect(result).toBeDefined();
            expect(result).toEqual(markedMock);
            expect(marked).toHaveBeenCalledTimes(1);
            expect(marked).toHaveBeenCalledWith(data);
        });
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});