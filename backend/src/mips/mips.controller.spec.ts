import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MetaDocument } from "./entities/meta.entity";
import { Language } from "./entities/mips.entity";
import { MIPsController } from "./mips.controller";
import { MIPsModule } from "./mips.module";
import { components, errorDropMock, fieldMock, filtersMock, languageMock, limitMock, metaVarsMock, mipData_2, mipNameMock, mipNumber_1, mipNumber_2, orderMock, pageMock, parseResultMock, pullRequestMock, requestCallBackMock, searchMock, selectMock, valueMock } from "./services/data-test/data";
import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { PullRequestService } from "./services/pull-requests.service";
import { SimpleGitService } from "./services/simple-git.service";
const faker = require("faker");
import * as crypto from "crypto";
import { Env } from "@app/env";
const digest = jest.fn(() => valueMock)
const update = jest.fn(() => {
  return {
    digest,
  } as any;
});
(crypto.createHmac as any) = jest.fn(() => {
  return {
    update,
  };
});
(crypto.timingSafeEqual as any) = jest.fn(() => true)


describe('MIPsController', () => {
  let controller: MIPsController;
  let module: TestingModule;
  let configService: ConfigService;
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

    controller = module.get<MIPsController>(MIPsController);
    configService = module.get<ConfigService>(ConfigService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    MIPsService.prototype.findAll = jest.fn(() => Promise.resolve([mipData_2]));
    MIPsService.prototype.smartSearch = jest.fn(() => Promise.resolve([mipData_2]));
    MIPsService.prototype.findOneByMipName = jest.fn(() => Promise.resolve({
      ...mipData_2,
      proposal: undefined,
    }));
    MIPsService.prototype.findOneByFileName = jest.fn(() => Promise.resolve(mipData_2));
    MIPsService.prototype.findByProposal = jest.fn(() => Promise.resolve([mipData_2]));
    MIPsService.prototype.getMipLanguagesAvailables = jest.fn(() => Promise.resolve(languageMock));
    MIPsService.prototype.getSummaryByMipName = jest.fn(() => Promise.resolve(mipData_2));
    MIPsService.prototype.getSummaryByMipComponent = jest.fn(() => Promise.resolve({
      ...mipData_2,
      components: [components[0]]
    }));
    SimpleGitService.prototype.getMetaVars = jest.fn(() => Promise.resolve(metaVarsMock as any as MetaDocument[]));
    PullRequestService.prototype.aggregate = jest.fn(() => Promise.resolve(pullRequestMock));
    ParseMIPsService.prototype.loggerMessage = jest.fn();
    ParseMIPsService.prototype.parse = jest.fn(() => Promise.resolve(parseResultMock));
  });

  jest.setTimeout(3 * 60 * 1000);

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('find all mips', async () => {
      const result = await controller.findAll(
        limitMock,
        pageMock,
        orderMock,
        selectMock,
        languageMock,
        searchMock,
        filtersMock,
      );

      expect(result).toEqual([mipData_2]);
      expect(MIPsService.prototype.findAll).toBeCalledTimes(1);
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: limitMock,
          page: pageMock,
        },
        orderMock,
        searchMock,
        filtersMock,
        selectMock,
        languageMock,
      );
    });

    it('error while find all mips', async () => {
      jest.spyOn(MIPsService.prototype, 'findAll')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      try {
        await controller.findAll(
          null,
          pageMock,
          orderMock,
          selectMock,
          languageMock,
          searchMock,
          filtersMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(MIPsService.prototype.findAll).toBeCalledTimes(1);
      expect(MIPsService.prototype.findAll).toBeCalledWith(
        {
          limit: 10,
          page: pageMock,
        },
        orderMock,
        searchMock,
        filtersMock,
        selectMock,
        languageMock,
      );
    });
  });

  describe('findOneByMipName', () => {
    it('find mip by mip name', async () => {
      const result = await controller.findOneByMipName(mipNameMock);

      expect(result).toEqual({
        mip: {
          ...mipData_2,
          proposal: undefined,
        },
        pullRequests: pullRequestMock,
        subproposals: [mipData_2],
        languagesAvailables: languageMock,
        metaVars: metaVarsMock,
      });
      expect(MIPsService.prototype.findOneByMipName).toBeCalledTimes(1);
      expect(MIPsService.prototype.findOneByMipName).toBeCalledWith(
        mipNameMock,
        undefined,
      );
      expect(MIPsService.prototype.findByProposal).toBeCalledTimes(1);
      expect(MIPsService.prototype.findByProposal).toBeCalledWith(mipData_2.mipName);
      expect(PullRequestService.prototype.aggregate).toBeCalledTimes(1);
      expect(PullRequestService.prototype.aggregate).toBeCalledWith(mipData_2.filename);
      expect(MIPsService.prototype.getMipLanguagesAvailables).toBeCalledTimes(1);
      expect(MIPsService.prototype.getMipLanguagesAvailables).toBeCalledWith(mipNameMock);
      expect(SimpleGitService.prototype.getMetaVars).toBeCalledTimes(1);
      expect(SimpleGitService.prototype.getMetaVars).toBeCalledWith();
    });

    it('find mip by mip name', async () => {
      PullRequestService.prototype.aggregate = jest.fn(() => {
        throw new Error(errorDropMock);
      });

      try {
        await controller.findOneByMipName(mipNameMock);
      } catch (error) {
        expect(error.message).toEqual(errorDropMock);
      }

      expect(MIPsService.prototype.findOneByMipName).toBeCalledTimes(1);
      expect(MIPsService.prototype.findOneByMipName).toBeCalledWith(
        mipNameMock,
        undefined,
      );
      expect(MIPsService.prototype.findByProposal).toBeCalledTimes(1);
      expect(MIPsService.prototype.findByProposal).toBeCalledWith(mipData_2.mipName);
      expect(PullRequestService.prototype.aggregate).toBeCalledTimes(1);
      expect(PullRequestService.prototype.aggregate).toBeCalledWith(mipData_2.filename);
      expect(MIPsService.prototype.getMipLanguagesAvailables).not.toBeCalled();
      expect(SimpleGitService.prototype.getMetaVars).not.toBeCalled();
    });

    it('error find mip by mip name', async () => {
      MIPsService.prototype.findOneByMipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneByMipName(mipNameMock);
      } catch (error) {
        expect(error.message).toEqual(`MIPs with name ${mipNameMock} not found`);
      }

      expect(MIPsService.prototype.findOneByMipName).toBeCalledTimes(2);
      expect(MIPsService.prototype.findOneByMipName).toBeCalledWith(
        mipNameMock,
        undefined,
      );
      expect(MIPsService.prototype.findOneByMipName).toBeCalledWith(
        mipNameMock,
        Language.English,
      );
      expect(MIPsService.prototype.findByProposal).not.toBeCalled();
      expect(PullRequestService.prototype.aggregate).not.toBeCalled();
      expect(MIPsService.prototype.getMipLanguagesAvailables).not.toBeCalled();
      expect(SimpleGitService.prototype.getMetaVars).not.toBeCalled();
    });
  });

  describe('smartSearch', () => {
    it('search by field', async () => {
      const result = await controller.smartSearch(
        fieldMock,
        valueMock,
      );

      expect(result).toEqual([mipData_2]);
      expect(MIPsService.prototype.smartSearch).toBeCalledTimes(1);
      expect(MIPsService.prototype.smartSearch).toBeCalledWith(
        fieldMock,
        valueMock,
        undefined,
      );
    });

    it('error while search', async () => {
      jest.spyOn(MIPsService.prototype, 'smartSearch')
        .mockImplementationOnce(async () => {
          throw new Error(errorDropMock);
        });

      try {
        await controller.smartSearch(
          fieldMock,
          valueMock,
          languageMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(MIPsService.prototype.smartSearch).toBeCalledTimes(1);
      expect(MIPsService.prototype.smartSearch).toBeCalledWith(
        fieldMock,
        valueMock,
        languageMock,
      );
    });
  });

  describe('findOneBy', () => {
    it('find mip by filename', async () => {
      const result = await controller.findOneBy(
        'filename',
        valueMock,
      );

      expect(result).toEqual(mipData_2);
      expect(MIPsService.prototype.findOneByFileName).toBeCalledTimes(1);
      expect(MIPsService.prototype.findOneByFileName).toBeCalledWith(
        valueMock,
        undefined,
      );

      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });

    it('find mip by filename not found', async () => {
      MIPsService.prototype.findOneByFileName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'filename',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `MIP with filename ${valueMock} not found`
        );
      }

      expect(MIPsService.prototype.findOneByFileName).toBeCalledTimes(2);
      expect(MIPsService.prototype.findOneByFileName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(MIPsService.prototype.findOneByFileName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });

    it('find mip by mipName', async () => {
      const result = await controller.findOneBy(
        'mipName',
        valueMock,
      );

      expect(result).toEqual(mipData_2);
      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledTimes(1);
      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledWith(
        valueMock,
        undefined,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find mip by mipName not found', async () => {
      MIPsService.prototype.getSummaryByMipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'mipName',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `MIP with mipName ${valueMock} not found`
        );
      }

      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledTimes(2);
      expect(MIPsService.prototype.getSummaryByMipName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(MIPsService.prototype.getSummaryByMipName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find mip by mipSubproposal', async () => {
      const result = await controller.findOneBy(
        'mipSubproposal',
        valueMock,
      );

      expect(result).toEqual(mipData_2);
      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledTimes(1);
      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledWith(
        valueMock,
        undefined,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find mip by mipSubproposal not found', async () => {
      MIPsService.prototype.getSummaryByMipName = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'mipSubproposal',
          valueMock,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `MIP with mipSubproposal ${valueMock} not found`
        );
      }

      expect(MIPsService.prototype.getSummaryByMipName).toBeCalledTimes(2);
      expect(MIPsService.prototype.getSummaryByMipName).toHaveBeenCalledWith(
        valueMock,
        Language.Spanish,
      );
      expect(MIPsService.prototype.getSummaryByMipName).toHaveBeenCalledWith(
        valueMock,
        Language.English,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
    });

    it('find by mipComponent no match with standar format', async () => {
      try {
        await controller.findOneBy(
          'mipComponent',
          valueMock,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `MIP component not in the standard format, i.e. MIP10c5`
        );
      }

      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });

    it('find mip by mipComponent', async () => {
      const result = await controller.findOneBy(
        'mipComponent',
        `MIP${mipNumber_2}c${mipNumber_1}`,
      );

      expect(result).toEqual({
        ...mipData_2,
        components: [components[0]]
      });
      expect(MIPsService.prototype.getSummaryByMipComponent).toBeCalledTimes(1);
      expect(MIPsService.prototype.getSummaryByMipComponent).toBeCalledWith(
        `MIP${mipNumber_2}c${mipNumber_1}`,
        undefined,
      );
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });

    it('find mip by mipComponent not found', async () => {
      MIPsService.prototype.getSummaryByMipComponent = jest.fn(() => Promise.resolve(null));

      try {
        await controller.findOneBy(
          'mipComponent',
          `MIP${mipNumber_2}c${mipNumber_1}`,
          Language.Spanish,
        );
      } catch (error) {
        expect(error.response.message).toEqual(
          `MIP with mipComponent MIP${mipNumber_2}c${mipNumber_1} not found`
        );
      }

      expect(MIPsService.prototype.getSummaryByMipComponent).toBeCalledTimes(2);
      expect(MIPsService.prototype.getSummaryByMipComponent).toHaveBeenCalledWith(
        `MIP${mipNumber_2}c${mipNumber_1}`,
        Language.Spanish,
      );
      expect(MIPsService.prototype.getSummaryByMipComponent).toHaveBeenCalledWith(
        `MIP${mipNumber_2}c${mipNumber_1}`,
        Language.English,
      );
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });

    it('find by unsupported field', async () => {
      try {
        await controller.findOneBy(
          fieldMock,
          valueMock,
        );
      } catch (error) {
        expect(error.response.error).toEqual(
          `Field ${fieldMock} not found`
        );
      }

      expect(MIPsService.prototype.getSummaryByMipComponent).not.toBeCalled();
      expect(MIPsService.prototype.findOneByFileName).not.toBeCalled();
      expect(MIPsService.prototype.getSummaryByMipName).not.toBeCalled();
    });
  });

  describe('callback', () => {
    it('parse completed successfully', async () => {
      const result = await controller.callback(requestCallBackMock);

      expect(result).toEqual(parseResultMock);
      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).toBeCalledTimes(1);
      expect(crypto.timingSafeEqual).toBeCalledWith(
        Buffer.from(requestCallBackMock.headers["x-hub-signature"]),
        Buffer.from(`sha1=${valueMock}`),
      );
      expect(ParseMIPsService.prototype.loggerMessage).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.loggerMessage).toBeCalledWith("Webhooks works");
      expect(ParseMIPsService.prototype.parse).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parse).toBeCalledWith();
    });

    it('error while logger', async () => {
      jest.spyOn(ParseMIPsService.prototype, 'parse').mockImplementation(() => {
        throw new Error(errorDropMock);
      });

      try {
        await controller.callback(requestCallBackMock);
      } catch (error) {
        expect(error.response.error).toEqual(errorDropMock);
      }

      expect(crypto.createHmac).toBeCalledTimes(1);
      expect(crypto.createHmac).toBeCalledWith(
        'sha1',
        configService.get<string>(
          Env.WebhooksSecretToken
        ),
      );
      expect(update).toBeCalledTimes(1);
      expect(update).toBeCalledWith(JSON.stringify(requestCallBackMock.body));
      expect(digest).toBeCalledTimes(1);
      expect(digest).toBeCalledWith("hex");
      expect(crypto.timingSafeEqual).toBeCalledTimes(1);
      expect(crypto.timingSafeEqual).toBeCalledWith(
        Buffer.from(requestCallBackMock.headers["x-hub-signature"]),
        Buffer.from(`sha1=${valueMock}`),
      );
      expect(ParseMIPsService.prototype.loggerMessage).toBeCalledTimes(2);
      expect(ParseMIPsService.prototype.loggerMessage).toHaveBeenCalledWith("Webhooks works");
      expect(ParseMIPsService.prototype.loggerMessage).toHaveBeenCalledWith("Webhooks ERROR");
      expect(ParseMIPsService.prototype.parse).toBeCalledTimes(1);
      expect(ParseMIPsService.prototype.parse).toBeCalledWith();
    })
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});