import { Model } from "mongoose";
import { Filters, PaginationQueryDto } from "../dto/query.dto";
import { MIP, MIPsDoc } from "../entities/mips.entity";
import { IGitFile, IMIPs } from "../interfaces/mips.interface";
import { ParseQueryService } from "./parse-query.service";
export declare class MIPsService {
    private readonly mipsDoc;
    private readonly parseQueryService;
    constructor(mipsDoc: Model<MIPsDoc>, parseQueryService: ParseQueryService);
    groupProposal(): Promise<string[]>;
    findAll(paginationQuery?: PaginationQueryDto, order?: string, search?: string, filter?: Filters, select?: string): Promise<any>;
    buildFilter(search: string, filter?: Filters): Promise<any>;
    buildSmartMongoDBQuery(ast: any): any;
    isValidObjectId(id: string): boolean;
    validField(field: string, value: any): any;
    findOneByMipName(mipName: string): Promise<MIP>;
    smartSearch(field: string, value: string): Promise<MIP[]>;
    findOneByFileName(filename: string): Promise<MIP>;
    getSummaryByMipName(mipName: string): Promise<MIP>;
    findOneByProposal(proposal: string): Promise<MIP[]>;
    create(mIPs: IMIPs): Promise<MIP>;
    insertMany(mips: MIP[] | any): Promise<MIPsDoc>;
    getAll(): Promise<Map<string, IGitFile>>;
    deleteManyByIds(ids: string[]): Promise<void>;
    deleteMany(): Promise<void>;
    update(id: string, mIPs: MIP): Promise<MIP>;
    remove(id: string): Promise<{
        n: number;
        ok: number;
        deletedCount: number;
    }>;
}
