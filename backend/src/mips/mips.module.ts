import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MIP, MIPsSchema } from "./entities/mips.entity";
import { MIPsController } from "./mips.controller";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { SimpleGitService } from "./services/simple-git.service";
import { MarkedService } from "./services/marked.service";
import { GithubService } from "./services/github.service";
import { PullRequest, PullRequestSchema } from "./entities/pull-request.entity";
import { PullRequestService } from "./services/pull-requests.service";
import { ParseMIPsCommand } from "./mips.command";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: MIP.name,
        collection: MIP.name,
        useFactory: () => {
          const schema = MIPsSchema;
          schema.index({ filename: 1, hash: 1 }, { unique: true });
          return schema;
        },
      },
      {
        name: PullRequest.name,
        collection: PullRequest.name,
        useFactory: () => {
          const schema = PullRequestSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [MIPsController],
  providers: [
    MIPsService,
    SimpleGitService,
    ParseMIPsService,
    SimpleGitService,
    MarkedService,
    GithubService,
    PullRequestService,
    ParseMIPsCommand,
  ],
})
export class MIPsModule {}
