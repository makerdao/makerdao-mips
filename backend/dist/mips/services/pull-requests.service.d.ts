import { Model } from "mongoose";
import { PullRequestDoc } from "../entities/pull-request.entity";
export declare class PullRequestService {
    private readonly pullRequestDoc;
    constructor(pullRequestDoc: Model<PullRequestDoc>);
    create(pullRequest: any[]): Promise<any>;
    count(): Promise<number>;
    aggregate(filename: string): Promise<any>;
}
