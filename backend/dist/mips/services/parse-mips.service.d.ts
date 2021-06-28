import { ConfigService } from "@nestjs/config";
import { IGitFile, ISynchronizeData, IPreamble } from "../interfaces/mips.interface";
import { MIPsService } from "./mips.service";
import { SimpleGitService } from "./simple-git.service";
import { MarkedService } from "./marked.service";
import { MIP } from "../entities/mips.entity";
import { GithubService } from "./github.service";
import { PullRequestService } from "./pull-requests.service";
export declare class ParseMIPsService {
    private simpleGitService;
    private mipsService;
    private configService;
    private githubService;
    private markedService;
    private pullRequestService;
    baseDir: string;
    private readonly logger;
    constructor(simpleGitService: SimpleGitService, mipsService: MIPsService, configService: ConfigService, githubService: GithubService, markedService: MarkedService, pullRequestService: PullRequestService);
    loggerMessage(message: string): void;
    parse(): Promise<boolean>;
    synchronizeData(filesGit: IGitFile[], filesDB: Map<string, IGitFile>): Promise<ISynchronizeData>;
    parseLexerData(fileString: string, item: IGitFile): MIP;
    setSubproposalValue(mipName: string): number;
    parsePreamble(data: string, subproposal?: boolean): IPreamble;
    parseSections(file: string): Promise<any>;
}
