import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import * as marked from "marked";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { MarkedService } from "./marked.service";

jest.mock("marked", () => {
    const mock = jest.fn(() => 'test');
    (mock as any).lexer = () => {
        return [{ type: "text", value: "test" }];
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

        markedService = module.get(MarkedService);
    });

    it("should be defined", () => {
        expect(markedService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        marked.lexer = jest.fn(() => [{ type: "text", value: "test" }]);
    });
    
    jest.setTimeout(3 * 60 * 1000);

    describe("markedLexer", () => {
        it("divide into tokens", async () => {
            const data = "test";
            
            const result = markedService.markedLexer(data);

            expect(result).toBeDefined();
            expect(result).toEqual([{ type: "text", value: "test" }]);
            expect(marked.lexer).toHaveBeenCalledTimes(1);
            expect(marked.lexer).toHaveBeenCalledWith(data);
        });
    });

    describe('markedHtml', () => {
        it("convert to html", async () => {
            const data = "test";

            const result = markedService.markedHtml(data);

            expect(result).toBeDefined();
            expect(result).toEqual('test');
            expect(marked).toHaveBeenCalledTimes(1);
            expect(marked).toHaveBeenCalledWith(data);
        });
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});