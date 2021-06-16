import { ConfigService } from "@nestjs/config";
import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { PullRequestService } from "./services/pull-requests.service";
import { Filters } from "./dto/query.dto";
export declare class MIPsController {
    private mipsService;
    private parseMIPsService;
    private pullRequestService;
    private configService;
    constructor(mipsService: MIPsService, parseMIPsService: ParseMIPsService, pullRequestService: PullRequestService, configService: ConfigService);
    findAll(limit?: string, page?: string, order?: string, select?: string, search?: string, filter?: Filters): Promise<any>;
    findOneByMipName(mipName?: string): Promise<{
        mip: import("./entities/mips.entity").MIP;
        pullRequests: any;
        subproposals: any[];
    }>;
    smartSearch(field: string, value: string): Promise<import("./entities/mips.entity").MIP[]>;
    findOneBy(field: string, value: string): Promise<any>;
    callback({ headers, body }: any): Promise<boolean>;
}
