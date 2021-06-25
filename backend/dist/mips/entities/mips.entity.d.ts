import { Document } from "mongoose";
export declare type MIPsDoc = MIP & Document;
export declare class Section {
    heading: string;
    depth: string;
}
export declare class Reference {
    name: string;
    link: string;
}
export declare class MIP {
    file: string;
    filename: string;
    hash: string;
    mip?: number;
    mipName?: string;
    subproposal?: number;
    mipFather?: boolean;
    title?: string;
    proposal?: string;
    author?: string[];
    contributors?: string[];
    tags?: string[];
    status?: string;
    types?: string;
    dateProposed?: string;
    dateRatified?: string;
    dependencies?: string[];
    replaces?: string;
    sentenceSummary?: string;
    paragraphSummary?: string;
    sections?: Section[];
    sectionsRaw?: string[];
    references?: Reference[];
}
export declare const MIPsSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
