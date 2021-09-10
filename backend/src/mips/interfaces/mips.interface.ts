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

// MIP#: 0
// Title: The Maker Improvement Proposal Framework
// Author(s): Charles St.Louis (@CPSTL), Rune Christensen (@Rune23)
// Contributors: @LongForWisdom
// Type: Process
// Status: Accepted
// Date Proposed: 2020-04-06
// Date Ratified: 2020-05-02
// Dependencies: n/a
// Replaces: n/a
export interface IPreamble {
  mip?: number;
  title?: string;
  preambleTitle?: string;
  mipName?: string;
  author?: string[];
  contributors?: string[];
  tags?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
}
