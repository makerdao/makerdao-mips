import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { PullRequest, PullRequestDoc } from "../entities/pull-request.entity";

@Injectable()
export class PullRequestService {
  constructor(
    @InjectModel(PullRequest.name)
    private readonly pullRequestDoc: Model<PullRequestDoc>
  ) {}

  async create(pullRequest: PullRequest): Promise<any> {
    const updated = await this.pullRequestDoc.findOneAndUpdate({}, pullRequest);

    if (!updated) {
      return this.pullRequestDoc.create(pullRequest);
    }

    return updated;
  }

  findOne(): Promise<PullRequest> {
    return this.pullRequestDoc.findOne({}).select(["-__v"]).exec();
  }
}
