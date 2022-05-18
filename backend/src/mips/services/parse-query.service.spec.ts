import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MIPsModule } from "../mips.module";
import { tagsMock_1, tagsMock_2, tagsMock_3 } from "./data-test/data";
import { ParseQueryService } from "./parse-query.service";
const faker = require("faker");

describe('ParseQueryService', () => {
  let service: ParseQueryService;
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

    faker.seed('ParseQueryService');

    service = module.get<ParseQueryService>(ParseQueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe('parse', () => {
    it('parse query search', async () => {
      const query = `$ AND(#${tagsMock_1},OR(#${tagsMock_2},#${tagsMock_3}))`;
      const result = await service.parse(query);
      expect(result).toEqual({
        type: 'OPERATION',
        op: 'AND',
        left: [
          {
            left: [
              {
                name: `#${tagsMock_3}`,
                type: 'LITERAL',
              },
              {
                name: `#${tagsMock_2}`,
                type: "LITERAL",
              },
            ],
            op: "OR",
            type: "OPERATION",
          },
          {
            name: `#${tagsMock_1}`,
            type: "LITERAL",
          },
        ],
      });
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});