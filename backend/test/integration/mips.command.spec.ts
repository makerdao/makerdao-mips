import { ParseMIPsCommand } from "@app/mips/mips.command";
import { ParseMIPsService } from "@app/mips/services/parse-mips.service";
import { PullRequestService } from "@app/mips/services/pull-requests.service";
import { SimpleGitService } from "@app/mips/services/simple-git.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../../src/mips/mips.module";
import { MIPsService } from "../../src/mips/services/mips.service";
const faker = require("faker");

describe('ParseMIPsCommand', () => {
  
  let mipsCommandService: ParseMIPsCommand;
  let mipsService: MIPsService;
  let simpleGitService: SimpleGitService;
  let pullRequestService: PullRequestService;
  let module: TestingModule;
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

    faker.seed('ParseMIPsCommand');

    mipsCommandService = module.get<ParseMIPsCommand>(ParseMIPsCommand);
    mipsService = module.get<MIPsService>(MIPsService);
    simpleGitService = module.get<SimpleGitService>(SimpleGitService);
    pullRequestService = module.get<PullRequestService>(PullRequestService);

    ParseMIPsService.prototype.sendIssue = jest.fn();
  });

  jest.setTimeout(3 * 60 * 1000);

  describe('parse', () => {
    it('should save all the MIPs', async () => {
      await mipsCommandService.parse();

      const { items: mips } = await mipsService.findAll({ limit: 10, page: 0 });
      expect(mips.length).toBeGreaterThan(0);

      const metavars = await simpleGitService.getMetaVars();
      expect(metavars.length).toBeGreaterThan(0);

      const countPullRequests = await pullRequestService.count();
      expect(countPullRequests).toBeGreaterThan(0);
    });

    afterEach(async () => {
        const { items: mips } = await mipsService.findAll({ limit: 10, page: 0 });
        await mipsService.deleteManyByIds(
          mips.map((mip) => mip._id)
        );
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
