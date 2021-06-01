import { ConfigService } from "@nestjs/config";
import { GraphQLClient } from "graphql-request";
export declare class GithubService {
    private configService;
    graphQLClient: GraphQLClient;
    githubRepository: string;
    githubRepositoryOwner: string;
    constructor(configService: ConfigService);
    pullRequests(pullRequests: any, after?: string): Promise<any>;
    pullRequestsLast(pullRequests: any, last: number): Promise<any>;
}
