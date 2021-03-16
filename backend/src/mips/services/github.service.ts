import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GraphQLClient } from "graphql-request";

import { Env } from "@app/env";
import { pullRequestsLast } from "../graphql/definitions.graphql";


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

  async pullRequests(pullRequests: any, after = ""): Promise<any> {
    if (after) {
      return await this.graphQLClient.request(pullRequests, {
        name: this.githubRepository,
        owner: this.githubRepositoryOwner,
        after: after
      });
    }

    return await this.graphQLClient.request(pullRequests, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
    });    
  }

  async pullRequestsLast(pullRequests: any, last: number): Promise<any> {
    return await this.graphQLClient.request(pullRequestsLast, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
      last: last
    });    
  }
}
