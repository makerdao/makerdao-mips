import { ConfigService } from "@nestjs/config";
import { PullResult, Response, SimpleGit } from "simple-git";
import { IGitFile } from "../interfaces/mips.interface";
export declare class SimpleGitService {
    private configService;
    git: SimpleGit;
    private readonly logger;
    constructor(configService: ConfigService);
    cloneRepository(): Response<string>;
    pull(remote?: string, branch?: string): Response<PullResult>;
    getFiles(): Promise<IGitFile[]>;
}
