import { readFile } from "fs/promises";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GitFile, Preamble } from "../interfaces/mips.interface";
import { MIPsService } from "./mips.service";

import { SimpleGitService } from "./simple-git.service";

import { Env } from "@app/env";
import { MarkedService } from "./marked.service";
import { MIP } from "../entities/mips.entity";

@Injectable()
export class ParseMIPsService {
  baseDir: string;
  constructor(
    private simpleGitService: SimpleGitService,
    private mipsService: MIPsService,
    private configService: ConfigService,
    private markedService: MarkedService
  ) {
    this.baseDir = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName
    )}`;
  }

  async parse(): Promise<boolean> {
    try {
      this.simpleGitService.pull();
      const files: GitFile[] = await this.simpleGitService.getFiles();

      const mips: MIP[] = [];

      for (const file of files) {
        const dir = `${this.baseDir}/${file.filePath}`;

        if (file.filePath.includes("placeholder.md")) {
          continue;
        }

        const fileString = await readFile(dir, "utf-8");

        const preamble = this.parseLexerData(fileString);

        if (preamble) {
          mips.push({
            hash: file.fileHash,
            file: fileString,
            filename: file.filePath,
            author: preamble.author,
            contributors: preamble.contributors,
            dateProposed: preamble.dateProposed,
            dateRatified: preamble.dateRatified,
            dependencies: preamble.dependencies,
            mip: preamble.mip,
            replaces: preamble.replaces,
            status: preamble.status,
            title: preamble.title,
            preambleTitle: preamble.preambleTitle,
            types: preamble.types,
          });
        }
      }

      const data = await this.mipsService.insertMany(mips);
    } catch (err) {

      console.log(err);

      return false;
    }
    return true;
  }

  parseLexerData(fileString: string): Preamble {
    const list: any[] = this.markedService.markedLexer(fileString);
    let preamble: Preamble = {};

    for (let i = 0; i < list.length; i++) {
      if (list[i]?.type === "heading" && list[i]?.depth === 1) {
        preamble.title = list[i]?.text;
      }

      if (
        list[i]?.type === "heading" &&
        list[i]?.depth === 2 &&
        list[i]?.text === "Preamble" &&
        i + 1 < list.length
      ) {
        if (list[i + 1]?.type === "code") {
          preamble = this.parsePreamble(list[i + 1]?.text);
          break;
        }
      }
    }

    return preamble;
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
  parsePreamble(data: string): Preamble {
    const preamble: Preamble = {};

    data.split("\n").filter((data: string) => {
      if (!data.includes(":")) {
        return false;
      }
      const keyValue = data.split(": ");

      if (!(keyValue.length > 1)) {
        return false;
      }

      switch (keyValue[0]) {
        case "MIP#":
          if (isNaN(+keyValue[1])) {
            preamble.mip = -1;
            break;
          }
          preamble.mip = +keyValue[1];
          break;
        case "Title":
          preamble.preambleTitle = keyValue[1];
          break;
        case "Contributors":
          preamble.contributors = keyValue[1].split(", ");
          break;
        case "Dependencies":
          preamble.dependencies = keyValue[1].split(", ");
          break;
        case "Author(s)":
          preamble.author = keyValue[1].split(", ");
          break;
        case "Replaces":
          preamble.replaces = keyValue[1];
          break;
        case "Type":
          preamble.types = keyValue[1];
          break;
        case "Status":
          preamble.status = keyValue[1];
          break;
        case "Date Proposed":
          preamble.dateProposed = keyValue[1];
          break;
        case "Date Ratified":
          preamble.dateRatified = keyValue[1];
          break;
        default:
          return false;
      }
      return true;
    });
    return preamble;
  }
}
