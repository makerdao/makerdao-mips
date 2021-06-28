"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_request_1 = require("graphql-request");
const env_1 = require("../../env");
const definitions_graphql_1 = require("../graphql/definitions.graphql");
let GithubService = class GithubService {
    constructor(configService) {
        this.configService = configService;
        const endpoint = this.configService.get(env_1.Env.GithubUrlApiEndpoint);
        const token = this.configService.get(env_1.Env.GitAccessApiToken);
        this.githubRepository = this.configService.get(env_1.Env.GithubRepository);
        this.githubRepositoryOwner = this.configService.get(env_1.Env.GithubRepositoryOwner);
        this.graphQLClient = new graphql_request_1.GraphQLClient(endpoint, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    }
    async pullRequests(pullRequests, after = "") {
        if (after) {
            return await this.graphQLClient.request(pullRequests, {
                name: this.githubRepository,
                owner: this.githubRepositoryOwner,
                after: after,
            });
        }
        return await this.graphQLClient.request(pullRequests, {
            name: this.githubRepository,
            owner: this.githubRepositoryOwner,
        });
    }
    async pullRequestsLast(pullRequests, last) {
        return await this.graphQLClient.request(definitions_graphql_1.pullRequestsLast, {
            name: this.githubRepository,
            owner: this.githubRepositoryOwner,
            last: last,
        });
    }
};
GithubService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GithubService);
exports.GithubService = GithubService;
//# sourceMappingURL=github.service.js.map