import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language } from "../../src/mips/entities/mips.entity";
import { MIPsController } from "../../src/mips/mips.controller";
import { MIPsModule } from "../../src/mips/mips.module";
import { mipData, mipData_2 } from "../../src/mips/services/data-test/data";
import { MIPsService } from "../../src/mips/services/mips.service";

describe('MIPsController', () => {
  let module: TestingModule;
  let controller: MIPsController;
  let mipsService: MIPsService;
  let mongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    console.log(mongoMemoryServer.getUri());

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
      let expectedMip_2;

      beforeEach(async () => {
        mip_1 = await mipsService.create({
          ...mipData,
          language: Language.Spanish,
        });
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
        const { items: mip } = await controller.findAll('1');

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an empty array of mips with one element (using limit and page)', async () => {
        const { items: mip } = await controller.findAll('1', '2');

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(0);
      });

      it('should return an array of mips with one element (using lang)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, Language.English);

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an array of mips with one element (using search)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, 'MIP1');

        expect(mip).toBeDefined();
        expect(mip.length).toEqual(1);
        expect(mip).toEqual([expectedMip_2]);
      });

      it('should return an array of mips with one element (using filters)', async () => {
        const { items: mip } = await controller.findAll(undefined, undefined, undefined, undefined, undefined, undefined, {
          contains: [
            {
              field: 'filename',
              value: 'MIP1',
            }
          ],
          notcontains: [
            {
              field: 'filename',
              value: 'MIP0',
            }
          ],
          notequals: [
            {
              field: 'filename',
              value: 'MIP0/mip0.md',
            }
          ],
          equals: [
            {
              field: 'filename',
              value: 'MIP1/mip1.md',
            }
          ],
          inarray: [{
            field: 'filename',
            value: ['MIP1/mip1.md'],
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

  afterAll(async () => {
    await module.close();
    await mongoMemoryServer.stop();
  });
});
