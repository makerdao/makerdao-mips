import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Language } from "../entities/mips.entity";
import { MIPsModule } from "../mips.module";
import { andQueryMock, builtAndFilterMock, builtContainsFilterMock, builtEqualsFilterMock, builtFilterMock, builtInArrayFilterMock, builtNotContainsFilterMock, builtNotEqualFilterMock, countMock, fieldMock, filtersMock, languageMock, limitMock, mipData, mipNameMock, mipSearcheableMock, mipToBeSearcheableMock, orderMock, pageMock, parseMock, searchFieldMock, searchMock, selectMock, valueMock } from "./data-test/data";
import { MIPsService } from "./mips.service";
import { ParseQueryService } from "./parse-query.service";
const faker = require("faker");

describe("MIPsService", () => {
    let module: TestingModule;
    let mipsService: MIPsService;
    let mongoMemoryServer;
    let exec;
    let sort;
    let select;
    let find;
    let aggregate;
    let lean;
    let limit;
    let skip;
    let countDocuments;
    let execCount;
    let findOne;
    let selectOne;
    let execOne;

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

        execOne = jest.fn(async () => mipData);
        exec = jest.fn(async () => [mipData]);
        execCount = jest.fn(async () => countMock);
        lean = jest.fn(() => ({ exec }));
        limit = jest.fn(() => ({ lean }));
        skip = jest.fn(() => ({ limit }));
        sort = jest.fn(() => ({
            exec,
            skip,
        }));
        select = jest.fn(() => ({ sort, exec }));
        selectOne = jest.fn(() => ({ exec: execOne }));
        find = jest.fn(() => ({ select }));
        aggregate = jest.fn(async () => [mipData]);
        countDocuments = jest.fn(() => ({
            exec: execCount,
        }));
        findOne = jest.fn(() => ({ select: selectOne }));
        (mipsService as any).mipsDoc = {
            find,
            aggregate,
            countDocuments,
            findOne,
        };
        ParseQueryService.prototype.parse = jest.fn(() => Promise.resolve(parseMock));
    });

    jest.setTimeout(3 * 60 * 1000);

    describe('groupProposal', () => {
        it('group mips by proposal', async () => {
            const result = await mipsService.groupProposal();

            expect(result).toEqual([mipData]);
            expect(aggregate).toBeCalledTimes(1);
            expect(aggregate).toBeCalledWith([
                { $match: { proposal: { $ne: "" } } },
                { $group: { _id: "$proposal" } },
            ]);
        }
        );
    });

    describe('cleanSearchField', () => {
        it('clean search field', async () => {
            const result = mipsService.cleanSearchField("\n" + searchFieldMock);

            expect(result).toEqual(searchFieldMock);
        });
    });

    describe('searchAll', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'buildFilter')
                .mockReturnValue(Promise.resolve(builtFilterMock));
        });

        it('search all mips', async () => {
            const result = await mipsService.searchAll({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: selectMock,
                language: Language.Spanish,
            });

            expect(result).toEqual([mipData])
            expect(MIPsService.prototype.buildFilter).toBeCalledTimes(2);
            expect(MIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.Spanish
            );
            expect(MIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English
            );
            expect(find).toBeCalledTimes(2);
            expect(find).toHaveBeenNthCalledWith(
                1,
                builtFilterMock,
            );
            expect(find).toHaveBeenNthCalledWith(
                2,
                builtFilterMock,
            );
            expect(select).toBeCalledTimes(2);
            expect(select).toHaveBeenNthCalledWith(
                1,
                selectMock,
            );
            expect(select).toHaveBeenNthCalledWith(
                2,
                selectMock,
            );
            expect(sort).toBeCalledTimes(2);
            expect(sort).toHaveBeenNthCalledWith(
                1,
                orderMock,
            );
            expect(sort).toHaveBeenNthCalledWith(
                2,
                orderMock,
            );
            expect(skip).toBeCalledTimes(2);
            expect(skip).toHaveBeenNthCalledWith(
                1,
                Number(pageMock) * Number(limitMock),
            );
            expect(skip).toHaveBeenNthCalledWith(
                2,
                Number(pageMock) * Number(limitMock),
            );
            expect(limit).toBeCalledTimes(2);
            expect(limit).toHaveBeenNthCalledWith(
                1,
                Number(limitMock),
            );
            expect(limit).toHaveBeenNthCalledWith(
                2,
                Number(limitMock),
            );
            expect(lean).toBeCalledTimes(2);
            expect(lean).toHaveBeenNthCalledWith(1);
            expect(lean).toHaveBeenNthCalledWith(2);
            expect(exec).toBeCalledTimes(2);
            expect(exec).toHaveBeenNthCalledWith(1);
            expect(exec).toHaveBeenNthCalledWith(2);
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'buildFilter')
                .mockReturnValue(Promise.resolve(builtFilterMock));
            jest.spyOn(MIPsService.prototype, 'searchAll')
                .mockReturnValueOnce(Promise.resolve([mipData]));
            jest.spyOn(MIPsService.prototype, 'cleanSearchField')
                .mockReturnValueOnce(searchFieldMock);
        });

        it('find mips with custom select attributes', async () => {
            const result = await mipsService.findAll(
                {
                    limit: +limitMock,
                    page: +pageMock,
                },
                orderMock,
                '\n' + searchFieldMock,
                filtersMock,
                selectMock,
                languageMock,
            );

            expect(result).toEqual({
                total: countMock,
                items: [mipData],
            });
            expect(MIPsService.prototype.buildFilter).toBeCalledTimes(1);
            expect(MIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English,
            );
            expect(countDocuments).toBeCalledTimes(1);
            expect(countDocuments).toBeCalledWith(builtFilterMock);
            expect(execCount).toBeCalledTimes(1);
            expect(execCount).toBeCalledWith();
            expect(MIPsService.prototype.searchAll).toBeCalledTimes(1);
            expect(MIPsService.prototype.searchAll).toBeCalledWith({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: selectMock,
                language: languageMock,
            });
        });

        it('find mips with default select attributes', async () => {
            const result = await mipsService.findAll(
                {
                    limit: +limitMock,
                    page: +pageMock,
                },
                orderMock,
                '\n' + searchFieldMock,
                filtersMock,
                null,
                languageMock,
            );

            expect(result).toEqual({
                total: countMock,
                items: [mipData],
            });
            expect(MIPsService.prototype.buildFilter).toBeCalledTimes(1);
            expect(MIPsService.prototype.buildFilter).toBeCalledWith(
                searchFieldMock,
                filtersMock,
                Language.English,
            );
            expect(countDocuments).toBeCalledTimes(1);
            expect(countDocuments).toBeCalledWith(builtFilterMock);
            expect(execCount).toBeCalledTimes(1);
            expect(execCount).toBeCalledWith();
            expect(MIPsService.prototype.searchAll).toBeCalledTimes(1);
            expect(MIPsService.prototype.searchAll).toBeCalledWith({
                paginationQuery: {
                    limit: +limitMock,
                    page: +pageMock,
                },
                order: orderMock,
                search: searchFieldMock,
                filter: filtersMock,
                select: [
                    "-__v",
                    "-file",
                    "-sections",
                    "-sectionsRaw",
                    "-mipName_plain",
                    "-filename_plain",
                    "-proposal_plain",
                    "-title_plain",
                    "-sectionsRaw_plain",
                ],
                language: languageMock,
            });
        });
    });

    describe('findByProposal', () => {
        it("findByProposal", async () => {
            const proposal = faker.random.word();

            const result = await mipsService.findByProposal(proposal);

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

    describe('buildContainFilters', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(MIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with contain', async () => {
            const result = await (mipsService as any).buildContainFilters(
                filtersMock.contains
            );

            expect(result).toEqual(builtContainsFilterMock);
            expect(MIPsService.prototype.validField).toBeCalledTimes(1);
            expect(MIPsService.prototype.validField).toBeCalledWith(
                filtersMock.contains[0].field,
                filtersMock.contains[0].value,
            );
            expect(MIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(MIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.contains[0].field,
            );
        });
    });

    describe('buildEqualsFilters', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(MIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with equals', async () => {
            const result = await (mipsService as any).buildEqualsFilters(
                filtersMock.equals
            );

            expect(result).toEqual(builtEqualsFilterMock);
            expect(MIPsService.prototype.validField).toBeCalledTimes(1);
            expect(MIPsService.prototype.validField).toBeCalledWith(
                filtersMock.equals[0].field,
                filtersMock.equals[0].value,
            );
            expect(MIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(MIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.equals[0].field,
            );
        });
    });

    describe('buildInArrayFilters', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(MIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with array of values', async () => {
            const result = await (mipsService as any).buildInArrayFilters(
                filtersMock.inarray
            );

            expect(result).toEqual(builtInArrayFilterMock);
            expect(MIPsService.prototype.validField).toBeCalledTimes(1);
            expect(MIPsService.prototype.validField).toBeCalledWith(
                filtersMock.inarray[0].field,
                filtersMock.inarray[0].value[0],
            );
            expect(MIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(MIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.inarray[0].field,
            );
        });
    });

    describe('buildNotContainFilters', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(MIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters which not contain', async () => {
            const result = await (mipsService as any).buildNotContainFilters(
                filtersMock.notcontains
            );

            expect(result).toEqual(builtNotContainsFilterMock);
            expect(MIPsService.prototype.validField).toBeCalledTimes(1);
            expect(MIPsService.prototype.validField).toBeCalledWith(
                filtersMock.notcontains[0].field,
                filtersMock.notcontains[0].value,
            );
            expect(MIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(MIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.notcontains[0].field,
            );
        });
    });

    describe('buildNotEqualsFilters', () => {
        beforeEach(() => {
            jest.spyOn(MIPsService.prototype, 'validField')
                .mockImplementationOnce((_field, value) => value);
            jest.spyOn(MIPsService.prototype, 'searcheableField')
                .mockImplementationOnce((field) => field);
        });

        it('build filters with not equals', async () => {
            const result = await (mipsService as any).buildNotEqualsFilters(
                filtersMock.notequals
            );

            expect(result).toEqual(builtNotEqualFilterMock);
            expect(MIPsService.prototype.validField).toBeCalledTimes(1);
            expect(MIPsService.prototype.validField).toBeCalledWith(
                filtersMock.notequals[0].field,
                filtersMock.notequals[0].value,
            );
            expect(MIPsService.prototype.searcheableField).toBeCalledTimes(1);
            expect(MIPsService.prototype.searcheableField).toBeCalledWith(
                filtersMock.notequals[0].field,
            );
        });
    });

    describe('buildFilter', () => {
        beforeEach(() => {
            jest.spyOn((MIPsService.prototype as any), 'buildContainFilters')
                .mockReturnValueOnce(builtContainsFilterMock);
            jest.spyOn((MIPsService.prototype as any), 'buildEqualsFilters')
                .mockReturnValueOnce(builtEqualsFilterMock);
            jest.spyOn((MIPsService.prototype as any), 'buildInArrayFilters')
                .mockReturnValueOnce(builtInArrayFilterMock);
            jest.spyOn((MIPsService.prototype as any), 'buildNotContainFilters')
                .mockReturnValueOnce(builtNotContainsFilterMock);
            jest.spyOn((MIPsService.prototype as any), 'buildNotEqualsFilters')
                .mockReturnValueOnce(builtNotEqualFilterMock);
            jest.spyOn((MIPsService.prototype as any), 'buildSmartMongoDBQuery')
                .mockReturnValueOnce(builtContainsFilterMock);
        });

        it('build filters and search with $', async () => {
            const result = await mipsService.buildFilter(
                '$' + searchMock,
                filtersMock,
            );

            expect(result).toEqual({
                $and: [{
                    ...builtContainsFilterMock,
                    ...builtEqualsFilterMock,
                    ...builtInArrayFilterMock,
                    ...builtNotContainsFilterMock,
                    ...builtNotEqualFilterMock,
                    ...builtContainsFilterMock,
                    language: Language.English,
                }],
            });
            expect((MIPsService.prototype as any).buildContainFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildContainFilters).toBeCalledWith(
                filtersMock.contains
            );
            expect((MIPsService.prototype as any).buildEqualsFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildEqualsFilters).toBeCalledWith(
                filtersMock.equals
            );
            expect((MIPsService.prototype as any).buildInArrayFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildInArrayFilters).toBeCalledWith(
                filtersMock.inarray
            );
            expect((MIPsService.prototype as any).buildNotContainFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildNotContainFilters).toBeCalledWith(
                filtersMock.notcontains
            );
            expect((MIPsService.prototype as any).buildNotEqualsFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildNotEqualsFilters).toBeCalledWith(
                filtersMock.notequals
            );
            expect(ParseQueryService.prototype.parse).toBeCalledTimes(1);
            expect(ParseQueryService.prototype.parse).toBeCalledWith(
                '$' + searchMock,
            );
            expect(MIPsService.prototype.buildSmartMongoDBQuery).toBeCalledTimes(1);
            expect(MIPsService.prototype.buildSmartMongoDBQuery).toBeCalledWith(
                parseMock,
            );
        });

        it('build filters and search without $', async () => {
            const result = await mipsService.buildFilter(
                searchMock,
                filtersMock,
                Language.Spanish
            );

            expect(result).toEqual({
                ...builtContainsFilterMock,
                ...builtEqualsFilterMock,
                ...builtInArrayFilterMock,
                ...builtNotContainsFilterMock,
                ...builtNotEqualFilterMock,
                language: Language.Spanish,
                sectionsRaw_plain: {
                    $regex: new RegExp(`${searchMock}`),
                    $options: 'i',
                },
            });
            expect((MIPsService.prototype as any).buildContainFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildContainFilters).toBeCalledWith(
                filtersMock.contains
            );
            expect((MIPsService.prototype as any).buildEqualsFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildEqualsFilters).toBeCalledWith(
                filtersMock.equals
            );
            expect((MIPsService.prototype as any).buildInArrayFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildInArrayFilters).toBeCalledWith(
                filtersMock.inarray
            );
            expect((MIPsService.prototype as any).buildNotContainFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildNotContainFilters).toBeCalledWith(
                filtersMock.notcontains
            );
            expect((MIPsService.prototype as any).buildNotEqualsFilters).toBeCalledTimes(1);
            expect((MIPsService.prototype as any).buildNotEqualsFilters).toBeCalledWith(
                filtersMock.notequals
            );
            expect(ParseQueryService.prototype.parse).not.toBeCalledTimes(1);
            expect(MIPsService.prototype.buildSmartMongoDBQuery).not.toBeCalledTimes(1);
        });
    });

    describe('buildSmartMongoDBQuery', () => {
        it('build filter from query', async () => {
            const result = mipsService.buildSmartMongoDBQuery(andQueryMock);
            
            expect(result).toEqual(builtAndFilterMock);
        });

        it('query not supported', () => {
            try {
                mipsService.buildSmartMongoDBQuery(languageMock);
            } catch (error) {
                expect(error.message).toEqual('Database query not supportted');
            }
        })
    });
    afterAll(async () => {
        await module.close();
        await mongoMemoryServer.stop();
    });
});