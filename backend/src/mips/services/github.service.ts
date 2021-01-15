import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { GraphQLClient } from "graphql-request";

import { Env } from "@app/env";
import {
  pullRequests,
  pullRequestsTotalClosed,
  pullRequestsTotalOpen,
} from "../graphql/definitions.graphql";

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

  async pullRequests(): Promise<any> {
    return await this.graphQLClient.request(pullRequests, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
    });
  }

  async pullRequestsOpen(): Promise<any> {
    return await this.graphQLClient.request(pullRequestsTotalOpen, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
    });
  }

  async pullRequestsClosed(): Promise<any> {
    return await this.graphQLClient.request(pullRequestsTotalClosed, {
      name: this.githubRepository,
      owner: this.githubRepositoryOwner,
    });
  }
}
