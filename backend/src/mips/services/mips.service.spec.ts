import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language, MIP } from "../entities/mips.entity";
import { MIPsModule } from "../mips.module";
import { mipData } from "./data-test/data";
import { MIPsService } from "./mips.service";

describe("MIPsService", () => {
    let module: TestingModule;
    let mipsService: MIPsService;
    let mongoMemoryServer;

    const mipMock: MIP = mipData;

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
                    useFactory: async (configService: ConfigService) => ({
                        uri: mongoMemoryServer.getUri(),
                        useCreateIndex: true,
                        useFindAndModify: false,
                    }),
                    inject: [ConfigService],
                }),
            ]
        }).compile();

        mipsService = module.get(MIPsService);
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    jest.setTimeout(3 * 60 * 1000);

    it("findOneByProposal", async () => {
        const proposal = "test";

        const exec = jest.fn(async () => {
            return [mipMock];
        });

        const sort = jest.fn((arg) => {
            return {
                exec,
            };
        });

        const select = jest.fn((arg) => {
            return {
                sort,
            };
        });

        const find = jest.fn((arg) => {
            return {
                select,
            };
        });

        (mipsService as any).mipsDoc = {
            find,
        };

        const result = await mipsService.findOneByProposal(proposal);
        expect(result).toEqual([mipMock]);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith({
            proposal_plain: proposal,
            language: Language.English
        });
        expect(select).toHaveBeenCalledTimes(1);
        expect(select).toHaveBeenCalledWith([
            "title",
            "mipName"
        ]);
        expect(sort).toHaveBeenCalledTimes(1);
        expect(sort).toHaveBeenCalledWith("mip subproposal");
        expect(exec).toHaveBeenCalledTimes(1);
        expect(exec).toHaveBeenCalledWith();
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});