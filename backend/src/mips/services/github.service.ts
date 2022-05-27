import { Env } from "@app/env";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLClient, RequestDocument } from "graphql-request";

@Injectable()
export class GithubService {
  graphQLClient: GraphQLClient;

  githubRepository: string;
  githubRepositoryOwner: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>(Env.GithubUrlApiEndpoint);
    const token = this.configService.get<string>(Env.GitAccessApiToken);

    this.githubRepository = this.configService.get<string>(
      Env.GithubRepository
    );
    this.githubRepositoryOwner = this.configService.get<string>(
      Env.GithubRepositoryOwner
    );

    this.graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  async pullRequests(pullRequests: RequestDocument, after?: string): Promise<any> {
    return this.graphQLClient.request(pullRequests, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
      after,
    });
  }

  async pullRequestsLast(pullRequestsLast: any, last: number): Promise<any> {
    return this.graphQLClient.request(pullRequestsLast, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
      last,
    });
  }

  async openIssue(openIssue: any, title: string, body: string): Promise<any> {
    return this.graphQLClient.request(openIssue, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
      title,
      body,
    });
  }
}
