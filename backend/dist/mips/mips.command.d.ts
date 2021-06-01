import { ParseMIPsService } from "./services/parse-mips.service";
import { MIPsService } from "./services/mips.service";
export declare class ParseMIPsCommand {
    private readonly parseMIPsService;
    private readonly mipsService;
    constructor(parseMIPsService: ParseMIPsService, mipsService: MIPsService);
    parse(): Promise<void>;
}
