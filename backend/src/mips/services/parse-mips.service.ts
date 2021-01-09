import { readFile } from "fs/promises";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IGitFile, ISyncronizeData, IPreamble } from "../interfaces/mips.interface";
import { MIPsService } from "./mips.service";

import { SimpleGitService } from "./simple-git.service";

import { Env } from "@app/env";
import { MarkedService } from "./marked.service";
import { MIP } from "../entities/mips.entity";

@Injectable()
export class ParseMIPsService {
  baseDir: string;

  private readonly logger = new Logger(ParseMIPsService.name);

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
      // this.simpleGitService.pull();
      const result: any = await Promise.all([this.simpleGitService.getFiles(), this.mipsService.getAll()]);
      const syncronizeData: ISyncronizeData = await this.syncronizeData(result[0], result[1]);

      this.logger.log(`Syncronize Data ===> ${JSON.stringify(syncronizeData)}`);
      return true;

    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async syncronizeData(filesGit: IGitFile[], filesDB: Map<string, IGitFile>): Promise<ISyncronizeData> {
    const syncronizeData: ISyncronizeData = {
      creates: 0,
      deletes: 0,
      updates: 0
    };
    const createItems = [];

    for (const item of filesGit) {

      if (!filesDB.has(item.filename)) {

        const dir = `${this.baseDir}/${item.filename}`;
        const fileString = await readFile(dir, "utf-8");
        const mip = this.parseLexerData(fileString, item);

        if (mip) {
          createItems.push(mip);
        }

      } else {
        const fileDB = filesDB.get(item.filename);

        if (fileDB.hash !== item.hash) {

          const dir = `${this.baseDir}/${item.filename}`;
          const fileString = await readFile(dir, "utf-8");
          const mip = this.parseLexerData(fileString, item);

          if (mip) {
            try {
              await this.mipsService.update(fileDB._id, mip);              
            } catch (error) {
              this.logger.error(error);
            }
          }
          syncronizeData.updates++;
        }
        filesDB.delete(item.filename);
      }      
    }      

    // Remove remaining items
    const deleteItems: string[] = []
    for (const [_, value] of filesDB.entries()) {
      deleteItems.push(value._id);      
    }
    syncronizeData.deletes = deleteItems.length;
    syncronizeData.creates = createItems.length;

    await Promise.all([this.mipsService.insertMany(createItems), this.mipsService.deleteManyByIds(deleteItems)]);
    return syncronizeData;
  }

  parseLexerData(fileString: string, item: IGitFile): MIP {
    const list: any[] = this.markedService.markedLexer(fileString);
    let preamble: IPreamble = {};
    let title: string;


    
    for (let i = 0; i < list.length; i++) {
      if (list[i]?.type === "heading" && list[i]?.depth === 1) {
        title = list[i]?.text;
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

    if (!preamble) {
      this.logger.log(`Preamble empty ==> ${JSON.stringify(item)}`);
      return;
    }

    return {
      hash: item.hash,
      file: fileString,
      filename: item.filename,
      author: preamble.author,
      contributors: preamble.contributors,
      dateProposed: preamble.dateProposed,
      dateRatified: preamble.dateRatified,
      dependencies: preamble.dependencies,
      mip: preamble.mip,
      replaces: preamble.replaces,
      status: preamble.status,
      title: preamble.preambleTitle || title,
      types: preamble.types,
    }
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
  parsePreamble(data: string): IPreamble {
    const preamble: IPreamble = {};

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
