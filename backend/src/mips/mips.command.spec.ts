import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ParseMIPsCommand } from "./mips.command";
import { MIPsModule } from "./mips.module";
import { errorDropMock } from "./services/data-test/data";
import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
const faker = require("faker");

describe('ParseMIPsCommand', () => {
  let service: ParseMIPsCommand;
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

    service = module.get<ParseMIPsCommand>(ParseMIPsCommand);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    MIPsService.prototype.dropDatabase = jest.fn(() => Promise.resolve());
    ParseMIPsService.prototype.parse = jest.fn(() => Promise.resolve(faker.datatype.boolean()));
    console.log = jest.fn();
  });

  jest.setTimeout(3 * 60 * 1000);

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe('drop', () => {
    it('drop database', async () => {
      await service.drop();

      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith("Database Droped: ", undefined);
    });

    it('error drop database', async () => {
      jest.spyOn(MIPsService.prototype, 'dropDatabase')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      await service.drop();

      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("An Error happend on Droping the Database");
      expect(console.log).toHaveBeenCalledWith(errorDropMock);
    });
  });

  describe('parse', () => {
    it('parse mips', async () => {
      await service.parse();

      expect(ParseMIPsService.prototype.parse).toHaveBeenCalledTimes(1);
      expect(ParseMIPsService.prototype.parse).toHaveBeenCalledWith();
    });
  });

  describe('dropUp', () => {
    it('drop database and parse again', async () => {
      await service.dropUp();

      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(ParseMIPsService.prototype.parse).toHaveBeenCalledTimes(1);
      expect(ParseMIPsService.prototype.parse).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("PLEASE AVOID USING THIS FUNCTION");
      expect(console.log).toHaveBeenCalledWith("Database Droped: ", undefined);
    });

    it('drop database', async () => {
      jest.spyOn(MIPsService.prototype, 'dropDatabase')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      await service.dropUp();

      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledTimes(1);
      expect(MIPsService.prototype.dropDatabase).toHaveBeenCalledWith();
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith("An Error happend on Droping the Database");
      expect(console.log).toHaveBeenCalledWith(errorDropMock);
      expect(ParseMIPsService.prototype.parse).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});