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

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    
    jest.setTimeout(3 * 60 * 1000);

    it("markedLexer", async () => {
        const data = "test";

        const markedLexerMock = jest.spyOn(
            marked,
            "lexer"
        ).mockReturnValueOnce(
            [{ type: "text", value: "test" }]
        );

        const result = markedService.markedLexer(data);

        expect(result).toBeDefined();
        expect(result).toEqual([{ type: "text", value: "test" }]);
        expect(markedLexerMock).toHaveBeenCalledTimes(1);
        expect(markedLexerMock).toHaveBeenCalledWith(data);
    });

    it("markedHtml", async () => {
        const data = "test";

        const result = markedService.markedHtml(data);

        expect(result).toBeDefined();
        expect(result).toEqual('test');
        expect(marked).toHaveBeenCalledTimes(1);
        expect(marked).toHaveBeenCalledWith(data);
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});