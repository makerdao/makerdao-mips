import * as mongoose from "mongoose";
export declare type PullRequestDoc = PullRequest & mongoose.Document;
export declare class File {
    path: string;
}
export declare class Files {
    nodes: File[];
    totalCount: number;
}
export declare class Author {
    login: string;
}
export declare class PullRequest {
    state: string;
    url: string;
    title: string;
    createdAt: string;
    body: string;
    author: Author;
    files: Files;
}
export declare const PullRequestSchema: mongoose.Schema<any, mongoose.Model<any>>;
