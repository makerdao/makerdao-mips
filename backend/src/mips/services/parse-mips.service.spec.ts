import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Language, MIP } from "../entities/mips.entity";
import { PullRequest } from "../entities/pull-request.entity";
import { MIPsController } from "../mips.controller";
import { mipData, mipFile } from "./data-test/data";

import { GithubService } from "./github.service";
import { MarkedService } from "./marked.service";
import { MIPsService } from "./mips.service";
import { ParseMIPsService } from "./parse-mips.service";
import { ParseQueryService } from "./parse-query.service";
import { PullRequestService } from "./pull-requests.service";
import { SimpleGitService } from "./simple-git.service";

describe("Parse MIPs service", () => {
  let service: ParseMIPsService;

  const simpleGitService = {
    cloneRepository: async () => '',
    getFiles: async () => [],
    pull: async (remote = "origin", branch = "master") => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MIPsController],
      providers: [
        ParseMIPsService,
        ParseQueryService,
        MIPsService,
        ConfigService,
        GithubService,
        MarkedService,
        PullRequestService,
        SimpleGitService,
        {
          provide: getModelToken(MIP.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            insertMany: jest.fn().mockResolvedValue({}),
            deleteMany: jest.fn().mockResolvedValue({}),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(PullRequest.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(SimpleGitService)
      .useValue(simpleGitService)
      .compile();

    service = module.get<ParseMIPsService>(ParseMIPsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Syncronize data", () => {
    it("should return the empty mip parse", async () => {
      service.baseDir = `${process.cwd()}/src/mips/services/data-test`;
      const files = new Map();

      const sinchronizeData = await service.synchronizeData(
        [
          {
            hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
            filename: "MIP1/mip1.md",
            language: Language.English
          },
        ],
        files
      );

      const result = { creates: 1, deletes: 0, updates: 0 };
      expect(sinchronizeData).toMatchObject(result);
    });
  });

  describe("Parse Lexer data", () => {
    it("should return the empty mip parse", async () => {
      const mip = service.parseLexerData("", {
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        language: Language.English
      });

      expect(mip).toMatchObject({
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        file: "",
      });
    });

    it("should return the full mip parse", async () => {
      const mip = service.parseLexerData(mipFile, {
        filename: "MIP0/mip0.md",
        hash: "df06e173387edf0bc6261ff49ccd165df03c785b",
        language: Language.English
      });

      expect(mip).toMatchObject(mipData);
    });
  });

  describe("Parse Preamble", () => {
    it("should return the empty preamble", async () => {
      const data = "";

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject({});
    });

    it("should return the full preamble", async () => {
      const data =
        "MIP#: 0\nTitle: The Maker Improvement Proposal Framework\nAuthor(s): Charles St.Louis (@CPSTL), Rune Christensen (@Rune23)\nContributors: @LongForWisdom\nType: Process\nStatus: Accepted\nDate Proposed: 2020-04-06\nDate Ratified: 2020-05-02\nDependencies: n/a\nReplaces: n/a\n";

      const result = {
        mip: 0,
        preambleTitle: "The Maker Improvement Proposal Framework",
        author: ["Charles St.Louis (@CPSTL)", "Rune Christensen (@Rune23)"],
        contributors: ["@LongForWisdom"],
        types: "Process",
        status: "Accepted",
        dateProposed: "2020-04-06",
        dateRatified: "2020-05-02",
        dependencies: ["n/a"],
        replaces: "n/a",
      };
      
      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject(result);
    });
  });
});
