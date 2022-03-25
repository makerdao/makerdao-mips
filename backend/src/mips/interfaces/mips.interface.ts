import { Language, Reference, Section } from "../entities/mips.entity";

export interface IMIPs {
  id?: string;
  file?: string;
  filename?: string;
  language?: Language;
  hash?: string;
  mip?: number;
  mipName?: string;
  subproposal?: number;
  proposal?: string;
  title?: string;
  preambleTitle?: string;
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
  subproposalsCount?: number;
  votingPortalLink?: string;
  forumLink?: string;
  mipCodeNumber?:string;
}

export interface IGitFile {
  _id?: string;
  filename: string;
  hash: string;
  language: Language;
}
export interface ISynchronizeData {
  creates: number;
  updates: number;
  deletes: number;
}

export interface IPreamble {
  mip?: number;
  title?: string;
  preambleTitle?: string;
  mipName?: string;
  author?: string[];
  extra?: string[];
  contributors?: string[];
  tags?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
  votingPortalLink?: string;
  forumLink?: string;
}
