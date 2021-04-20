import { readFile } from "fs/promises";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  IGitFile,
  ISynchronizeData,
  IPreamble,
} from "../interfaces/mips.interface";
import { MIPsService } from "./mips.service";

import { SimpleGitService } from "./simple-git.service";

import { Env } from "@app/env";
import { MarkedService } from "./marked.service";
import { MIP } from "../entities/mips.entity";
import { GithubService } from "./github.service";
import { PullRequestService } from "./pull-requests.service";
import { pullRequests, pullRequestsAfter, pullRequestsCount, pullRequestsLast } from "../graphql/definitions.graphql";

@Injectable()
export class ParseMIPsService {
  baseDir: string;

  private readonly logger = new Logger(ParseMIPsService.name);

  constructor(
    private simpleGitService: SimpleGitService,
    private mipsService: MIPsService,
    private configService: ConfigService,
    private githubService: GithubService,
    private markedService: MarkedService,
    private pullRequestService: PullRequestService,    
  ) {
    this.baseDir = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName
    )}`;
  }

  loggerMessage(message: string) {
    this.logger.log(message);
  }

  async parse(): Promise<boolean> {

    const branch = this.configService.get(Env.RepoBranch);
    
    try {
      this.simpleGitService.pull("origin", branch); 

      const result: any = await Promise.all([
        this.simpleGitService.getFiles(),
        this.mipsService.getAll(),

        this.pullRequestService.count(),
        this.githubService.pullRequests(pullRequestsCount)
      ]);

      const synchronizeData: ISynchronizeData = await this.synchronizeData(
        result[0],
        result[1]
      );

      if (result[2] === 0) {
        let data =  await this.githubService.pullRequests(pullRequests);
        await this.pullRequestService.create(data?.repository?.pullRequests?.nodes);

        while(data?.repository?.pullRequests?.pageInfo?.hasNextPage) {
          data = await this.githubService.pullRequests(pullRequestsAfter, data?.repository?.pullRequests?.pageInfo?.endCursor);
          await this.pullRequestService.create(data?.repository?.pullRequests?.nodes);
        }
      } else {
        if (result[3].repository.pullRequests.totalCount - result[2] > 0) {
          const data =  await this.githubService.pullRequestsLast(pullRequestsLast, result[3].repository.pullRequests.totalCount - result[2]);
          await this.pullRequestService.create(data?.repository?.pullRequests?.nodes);
        }

        this.logger.log(`Total news pull request ===> ${result[3].repository.pullRequests.totalCount - result[2]}`)
      }      

      this.logger.log(`Synchronize Data ===> ${JSON.stringify(synchronizeData)}`);
      return true;
    } catch (error) {
      this.logger.error(error);

      console.log(error);
      return false;
    }
  }

  async synchronizeData(
    filesGit: IGitFile[],
    filesDB: Map<string, IGitFile>
  ): Promise<ISynchronizeData> {
    const synchronizeData: ISynchronizeData = {
      creates: 0,
      deletes: 0,
      updates: 0,
    };
    const createItems = [];

    for (const item of filesGit) {

      if (!filesDB.has(item.filename)) {
        const dir = `${this.baseDir}/${item.filename}`;

        try {
          const fileString = await readFile(dir, "utf-8");
          const mip = this.parseLexerData(fileString, item);

          if (mip.mip === undefined || mip.mipName === undefined) {
            console.log(mip.mip, mip.mipName, mip.filename);
          }

          if (mip) {                 
            createItems.push(mip);
          }          
        } catch (error) {
          this.logger.log(error); 
          continue;         
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
          synchronizeData.updates++;
        }
        filesDB.delete(item.filename);
      }
    }

    // Remove remaining items
    const deleteItems: string[] = [];
    for (const [_, value] of filesDB.entries()) {
      deleteItems.push(value._id);
    }
    synchronizeData.deletes = deleteItems.length;
    synchronizeData.creates = createItems.length;

    await Promise.all([
      this.mipsService.insertMany(createItems),
      this.mipsService.deleteManyByIds(deleteItems),
    ]);
    return synchronizeData;
  }

  parseLexerData(fileString: string, item: IGitFile): MIP {
    const list: any[] = this.markedService.markedLexer(fileString);    
    let preamble: IPreamble = {};

    const mip: MIP = {
      hash: item.hash,
      file: fileString,
      filename: item.filename,
      sections: [],
      sectionsRaw: []
    };
    
    if (item.filename.includes('-')) {
      mip.proposal = item.filename.split('/')[0];
    } else {     
      mip.mipName = item.filename.split('/')[0];
    }

    let title: string;

    for (let i = 0; i < list.length; i++) {
      mip.sectionsRaw.push(list[i].raw);

      if (list[i]?.type === "heading" && list[i]?.depth === 1) {
        title = list[i]?.text;
      } else if (
        list[i]?.type === "heading" &&
        list[i]?.depth === 2 &&
        list[i]?.text === "Preamble" &&
        i + 1 < list.length
      ) {
        if (list[i + 1]?.type === "code") {
          if (item.filename.includes('-')) {
            preamble = this.parsePreambleSubproposal(list[i + 1]?.text);
            preamble.mip = parseInt(mip.proposal.replace('MIP', ''));
            mip.mipName = preamble.mipName;

            mip.subproposal = -1;
            const re = /[a-z#-]/gi;

            if (!isNaN(parseInt(mip.mipName.replace(re, '')))) {
              mip.subproposal = parseInt(mip.mipName.replace(re, '')) * 100;
            }           
            
          } else {
            preamble = this.parsePreamble(list[i + 1]?.text);
          }
        }
      } else if (
        list[i]?.type === "heading" &&
        list[i]?.depth === 2 &&
        list[i]?.text === "Sentence Summary" &&
        i + 1 < list.length
      ) {
        mip.sentenceSummary = list[i + 1]?.raw;
      } else if (
        list[i]?.type === "heading" &&
        list[i]?.depth === 2 &&
        list[i]?.text === "Paragraph Summary" &&
        i + 1 < list.length
      ) {
        mip.paragraphSummary = list[i + 1]?.raw;
      } 

      if (list[i]?.type === "heading") {
        mip.sections.push({
          heading: list[i]?.text,
          depth: list[i]?.depth
        });
      }
      
    }

    if (!preamble) {
      this.logger.log(`Preamble empty ==> ${JSON.stringify(item)}`);
      return;
    }   

    mip.author = preamble.author;
    mip.contributors = preamble.contributors;
    mip.dateProposed = preamble.dateProposed;
    mip.dateRatified = preamble.dateRatified;
    mip.dependencies = preamble.dependencies;
    mip.mip = preamble.mip;
    mip.replaces = preamble.replaces;
    mip.status = preamble.status;
    mip.title = preamble.preambleTitle || title;
    mip.types = preamble.types;
    mip.tags = preamble.tags;

    return mip;
  }

  // Preamble example
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
      const keyValue = data.split(":");

      if (!(keyValue.length > 1)) {
        return false;
      }

      switch (keyValue[0]) {
        case "MIP#":
          if (isNaN(+keyValue[1].trim())) {
            preamble.mip = -1;
            break;
          }
          preamble.mip = +keyValue[1].trim();
          break;
        case "Title":
          preamble.preambleTitle = keyValue[1].trim();
          break;
        case "Contributors":
          preamble.contributors = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Dependencies":
          preamble.dependencies = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Author(s)":
          preamble.author = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Author":
          preamble.author = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Tags":
          preamble.tags = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "tags":
          preamble.tags = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Replaces":
          preamble.replaces = keyValue[1].trim();
          break;
        case "Type":
          preamble.types = keyValue[1].trim();
          break;
        case "Status":
          preamble.status = keyValue[1].trim();
          break;
        case "Date Proposed":
          preamble.dateProposed = keyValue[1].trim();
          break;
        case "Date Ratified":
          preamble.dateRatified = keyValue[1].trim();
          break;
        default:
          return false;
      }
      return true;
    });

    return preamble;
  }

  // Preamble example
  // MIP0c12-SP#: 1
  // Author: Charles St.Louis
  // Contributors: n/a
  // Status: Request for Comments (RFC)
  // Date Applied: 2020-04-22
  // Date Ratified: 2020-05-02
  // ---
  // Core Personnel Role: MIP Editor
  // Proposed applicant: Charles St.Louis
  parsePreambleSubproposal(d: string): IPreamble {
    const preamble: IPreamble = {};

    let flag = true;

    d.split("\n").filter((data: string) => {
      if (!data.includes(":")) {
        return false;
      }

      if (flag) {
        const re = /[: #-]/gi;
        preamble.mipName = data.replace(re, '');

        flag = false;
        return false;
      }

      const keyValue = data.split(":");

      if (!(keyValue.length > 1)) {
        return false;
      }

      switch (keyValue[0]) {
        case "Title":
          preamble.preambleTitle = keyValue[1].trim();
          break;
        case "Contributors":
          preamble.contributors = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Dependencies":
          preamble.dependencies = keyValue[1]
            .split(",")
            .map((data) => data.trim());
          break;
        case "Author(s)":
          preamble.author = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Author":
          preamble.author = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Tags":
          preamble.tags = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "tags":
          preamble.tags = keyValue[1].split(",").map((data) => data.trim());
          break;
        case "Replaces":
          preamble.replaces = keyValue[1].trim();
          break;
        case "Type":
          preamble.types = keyValue[1].trim();
          break;
        case "Status":
          preamble.status = keyValue[1].trim();
          break;
        case "Date Proposed":
          preamble.dateProposed = keyValue[1].trim();
          break;
        case "Date Ratified":
          preamble.dateRatified = keyValue[1].trim();
          break;
        default:
          return false;
      }
      return true;
    });

    return preamble;
  }

  async parseSections(file: string): Promise<any> {        
    return this.markedService.markedLexer(file);    
  }

}
