export interface MIPs {
  id?: string;
  file?: string;
  filename?: string;
  hash?: string;
  mip?: number;
  title?: string;
  author?: string[];
  contributors?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
}

export interface GitFile {
  filePath: string;
  fileHash: string;
}

export const enum Status {
  Accepted = "Accepted",
  RFC = "RFC",
  FormalSubmision = "Formal Submission",
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
export interface Preamble {
  mip?: number;
  title?: string;
  author?: string[];
  contributors?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
}
