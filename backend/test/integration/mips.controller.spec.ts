import { HttpException, HttpStatus } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language, MIP } from "../../src/mips/entities/mips.entity";
import { MIPsController } from "../../src/mips/mips.controller";
import { MIPsModule } from "../../src/mips/mips.module";
import { mipData, mipData_2, mipNumber_1, mipNumber_2, smartSearchFieldMock, statusResultMock, tagResultMock } from "../../src/mips/services/data-test/data";
import { MIPsService } from "../../src/mips/services/mips.service";
const faker = require("faker");

describe('MIPsController', () => {
  let module: TestingModule;
  let controller: MIPsController;
  let mipsService: MIPsService;
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

    faker.seed('MIPsController');

    controller = module.get<MIPsController>(MIPsController);
    mipsService = module.get<MIPsService>(MIPsService);
  });

  describe('findAll', () => {
    it('should return an empty array when no mip is found', async () => {
      const { items: mip } = await controller.findAll(Language.English);

      expect(mip).toBeDefined();
      expect(mip.length).toBe(0);
    });

    it('should throw an error trying to build filters', async () => {
      try {
        await controller.findAll(Language.English);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    describe('existing data', () => {
      let mip_1;
      let mip_2;
      let expectedMip_1;
      let expectedMip_2;

      beforeEach(async () => {
        mip_1 = await mipsService.create({
          ...mipData,
          language: Language.Spanish,
        });
        expectedMip_1 = {
          ...mipData,
          _id: mip_1._id,
        };
        delete expectedMip_1.file;
        delete expectedMip_1.sectionsRaw;
        mip_2 = await mipsService.create({
          ...mipData_2,
          language: Language.English,
        });
        expectedMip_2 = {
          ...mipData_2,
          _id: mip_2._id,
        };
        delete expectedMip_2.file;
        delete expectedMip_2.sectionsRaw;
      });

      it('should return an array of mips', async () => {
        const { items: mip } = await controller.findAll();

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([
          expectedMip_2,
        ]);
      });

      it('should return an array of mips with one element (using limit)', async () => {
        const limit = faker.datatype.number({
          min: 1,
          max: 30,
        });
        const { items: mip } = await controller.findAll(`${limit}`);

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an empty array of mips with one element (using limit and page)', async () => {
        const limit = faker.datatype.number({
          min: 1,
          max: 30,
        });
        const page = faker.datatype.number({
          min: 0,
          max: 1,
        });
        const { items: mip } = await controller.findAll(`${limit}`, `${page}`);

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(page === 0 ? 1 : 0);
      });

      it('should return an array of mips with one element (using lang)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, Language.English);

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an array of mips with one element (using search)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, `MIP${mipNumber_2}`);

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an array of mips with one element (using filters)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, undefined, {
          contains: [
            {
              field: 'filename',
              value: `MIP${mipNumber_2}`,
            }
          ],
          notcontains: [
            {
              field: 'filename',
              value: `MIP${mipNumber_1}`,
            }
          ],
          notequals: [
            {
              field: 'filename',
              value: `MIP${mipNumber_1}/mip${mipNumber_1}.md`,
            }
          ],
          equals: [
            {
              field: 'filename',
              value: `MIP${mipNumber_2}/mip${mipNumber_2}.md`,
            }
          ],
          inarray: [{
            field: 'filename',
            value: [`MIP${mipNumber_2}/mip${mipNumber_2}.md`],
          }],
        });

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      afterEach(async () => {
        await mipsService.update(mip_1._id, {
          ...mip_1,
          language: Language.English,
        });
        const { items: mips } = await mipsService.findAll({ limit: 10, page: 0 });
        await mipsService.deleteManyByIds(
          mips.map((mip) => mip._id)
        );
      });
    });
  });

  describe('smartSearch', () => {
    it('shoud return an array with no mips by tags', async () => {
      const mips = await controller.smartSearch('tags', '');

      expect(mips).toBeDefined();
      expect(mips.length).toEqual(0);
    });

    it('shoud return an array with no mips by status', async () => {
      const mips = await controller.smartSearch('status', '');

      expect(mips).toBeDefined();
      expect(mips.length).toEqual(0);
    });

    it('shoud throw an error by incorrect field name', async () => {
      try {
        await controller.smartSearch(smartSearchFieldMock, '');
      } catch (error) {
        expect(error).toEqual(new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Field ${smartSearchFieldMock} invalid`,
          },
          HttpStatus.BAD_REQUEST
        ));
      }
    });

    describe('existing data', () => {
      let mip_1;
      let mip_2;
      let expectedMip_1;
      let expectedMip_2;

      beforeEach(async () => {
        mip_1 = await mipsService.create({
          ...mipData,
          language: Language.Spanish,
        });
        expectedMip_1 = {
          ...mipData,
          _id: mip_1._id,
        };
        delete expectedMip_1.file;
        delete expectedMip_1.sectionsRaw;
        mip_2 = await mipsService.create({
          ...mipData_2,
          language: Language.English,
        });
        expectedMip_2 = {
          ...mipData_2,
          _id: mip_2._id,
        };
        delete expectedMip_2.file;
        delete expectedMip_2.sectionsRaw;
      });

      it('should return an emty array by tag in wrong language', async () => {
        const mips = await controller.smartSearch('tags', mip_1.tags[0], Language.English);

        expect(mips).toBeDefined();
        expect(mips.length).toEqual(0);
      });

      it('should return an emty array by status in wrong language', async () => {
        const mips = await controller.smartSearch('status', mip_2.status, Language.Spanish);

        expect(mips).toBeDefined();
        expect(mips.length).toEqual(0);
      });

      it('should return one mip by tag', async () => {
        const mips = await controller.smartSearch('tags', mip_1.tags[0], Language.Spanish);

        expect(mips).toBeDefined();
        expect(mips.length).toEqual(1);
        expect(mips[0]).toEqual(tagResultMock);
      });

      it('should return one mip by status', async () => {
        const mips = await controller.smartSearch('status', mip_2.status, Language.English);

        expect(mips).toBeDefined();
        expect(mips.length).toEqual(1);
        expect(mips[0]).toEqual(statusResultMock);
      });

      afterEach(async () => {
        await mipsService.update(mip_1._id, {
          ...mip_1,
          language: Language.English,
        });
        const { items: mips } = await mipsService.findAll({ limit: 10, page: 0 });
        await mipsService.deleteManyByIds(
          mips.map((mip) => mip._id)
        );
      });
    });
  });

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
