import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language, MIP } from "../entities/mips.entity";
import { MIPsModule } from "../mips.module";
import { mipData } from "./data-test/data";
import { MIPsService } from "./mips.service";
const faker = require("faker");

describe("MIPsService", () => {
    let module: TestingModule;
    let mipsService: MIPsService;
    let mongoMemoryServer;
    let exec;
    let sort;
    let select;
    let find;

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

        faker.seed('MIPsService');

        mipsService = module.get(MIPsService);
    });

    it("should be defined", () => {
        expect(mipsService).toBeDefined();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.restoreAllMocks();

        exec = jest.fn(async () => [mipData]);
        sort = jest.fn(() => ({ exec }));
        select = jest.fn(() => ({ sort }));
        find = jest.fn(() => ({ select }));
        (mipsService as any).mipsDoc = { find };
    });

    jest.setTimeout(3 * 60 * 1000);

    describe('findOneByProposal', () => {
        it("findOneByProposal", async () => {
            const proposal = faker.random.word();

            const result = await mipsService.findOneByProposal(proposal);

            expect(result).toEqual([mipData]);
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
    });

    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});