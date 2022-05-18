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
import { Component, MIP, Reference } from "../entities/mips.entity";
import { GithubService } from "./github.service";
import { PullRequestService } from "./pull-requests.service";
import {
  pullRequests,
  pullRequestsAfter,
  pullRequestsCount,
  pullRequestsLast,
} from "../graphql/definitions.graphql";
import { PaginationQueryDto } from "../dto/query.dto";

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
    private pullRequestService: PullRequestService
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
        this.githubService.pullRequests(pullRequestsCount),
      ]);

      const synchronizeData: ISynchronizeData = await this.synchronizeData(
        result[0],
        result[1]
      );

      await this.simpleGitService.saveMetaVars();

      if (result[2] === 0) {
        let data = await this.githubService.pullRequests(pullRequests);
        await this.pullRequestService.create(
          data?.repository?.pullRequests?.nodes
        );

        while (data?.repository?.pullRequests?.pageInfo?.hasNextPage) {
          data = await this.githubService.pullRequests(
            pullRequestsAfter,
            data?.repository?.pullRequests?.pageInfo?.endCursor
          );
          await this.pullRequestService.create(
            data?.repository?.pullRequests?.nodes
          );
        }
      } else {
        if (result[3].repository.pullRequests.totalCount - result[2] > 0) {
          const data = await this.githubService.pullRequestsLast(
            pullRequestsLast,
            result[3].repository.pullRequests.totalCount - result[2]
          );
          await this.pullRequestService.create(
            data?.repository?.pullRequests?.nodes
          );
        }

        this.logger.log(
          `Total news pull request ===> ${result[3].repository.pullRequests.totalCount - result[2]
          }`
        );
      }

      this.logger.log(
        `Synchronize Data ===> ${JSON.stringify(synchronizeData)}`
      );

      const mips = await this.mipsService.groupProposal();

      this.logger.log(
        `Mips with subproposals data ===> ${JSON.stringify(mips)}`
      );

      if (mips.length > 0) {
        await this.mipsService.setMipsFather(mips.map((d) => d._id));
      }

      await this.updateSubproposalCountField();

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async parseMIP(item, isNewMIP: boolean): Promise<MIP> {
    const dir = `${this.baseDir}/${item.filename}`;

    this.logger.log(`Parse ${isNewMIP ? 'new ' : ''}mip item update => ${item.filename}`);

    const fileString = await readFile(dir, "utf-8");
    return this.parseLexerData(fileString, item)
  }

  async deleteMipsFromMap(filesDB: Map<string, IGitFile>) {
    // Remove remaining items
    const deleteItems: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, value] of filesDB.entries()) {
      deleteItems.push(value._id);
    }

    await this.mipsService.deleteManyByIds(deleteItems);
  }

  async updateIfDifferentHash(fileDB, item) {
    if (fileDB.hash !== item.hash) {
      const mip: MIP = await this.parseMIP(item, false);

      if (mip) {
        try {
          await this.mipsService.update(fileDB._id, mip);
        } catch (error) {
          this.logger.error(error.message);
        }
      }
      return true;
    }
    return false;
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
        try {
          const mip = await this.parseMIP(item, true);
          if (mip.mip === undefined || mip.mipName === undefined) {
            // TODO: Convert into a notification Service
            console.log({
              mip,
              item,
              TODO: "Convert into a notification Service"
            })
            this.logger.log(
              `Mips with problems to parse ==> ${(mip.mip, mip.mipName, mip.filename)
              }`
            );
          }

          if (mip) {
            createItems.push(mip);
          }
        } catch (error) {
          this.logger.log(error.message);
          continue;
        }
      } else {
        const isUpdated = await this.updateIfDifferentHash(
          filesDB.get(item.filename),
          item,
        );
        isUpdated && synchronizeData.updates++;
        filesDB.delete(item.filename);
      }
    }

    // Remove remaining items
    await this.deleteMipsFromMap(filesDB);

    synchronizeData.deletes = filesDB.size;
    synchronizeData.creates = createItems.length;

    await this.mipsService.insertMany(createItems);
    return synchronizeData;
  }

  getComponentsSection(data: string): string {
    const startDataIndex = data.search(/\*\*\s*MIP\d+[ca]1[\s:]*/gim);

    if (startDataIndex === -1) {
      return "";
    }
    const dataRemainingText = data.substring(startDataIndex);

    const endIndex = dataRemainingText.search(/^#{2}[^#\n]*$/gim);

    if (endIndex === -1) {
      return dataRemainingText;
    }

    const componentText = dataRemainingText.substring(0, endIndex);

    return componentText;
  }

  getDataFromComponentText(componentText: string): Component[] {
    const regexComp = /^\*\*(?<cName>MIP\d+[ca]\d+):\s?(?<cTitle>.*)\*\*/im;
    const regexToGetComponentTitle = /^\*\*MIP\d+[ca]\d+:\s?.*\*\*/gim;

    const componentHeaders = componentText.match(regexToGetComponentTitle);
    const splitedData = componentText.split(regexToGetComponentTitle);

    return componentHeaders?.map((item, index) => {
      const matches = item.match(regexComp).groups;
      const cBody = splitedData[index + 1].trim().split(/^#/gm)[0];

      return {
        cName: matches.cName.trim(),
        cTitle: matches.cTitle.trim(),
        cBody,
      };
    });
  }

  parseMipsNamesComponentsSubproposals(data, isOnComponentSummary) {
    let raw = data.raw;

    if (isOnComponentSummary) {
      const sumaryRaw = raw?.replace(/\*\*\s?MIP\d+[ac]\d+:.*\*\*/gi, (item) => {
        const mipComponent = item.match(/MIP\d+[ac]\d+/gi)[0];

        const mipName = mipComponent.match(/MIP\d+/gi)[0];
        const cleanItem = item?.replace(/\*\*/g, "");

        return `[${cleanItem}](mips/details/${mipName}#${mipComponent})`;
      });

      const cleaned = sumaryRaw?.replace(/]\([^\)]+\)/gm, (item) =>
        item?.replace(/]\([^\)]+/gm, (ite) => ite + ` "NON-SMART-LINK"`)
      );
      return cleaned;
    }

    if (data.type === "heading") {
      return raw;
    }

    //#region Helper functions
    const processToken = (pattern, item, processLink) =>
      item?.replace(pattern, (match) => processLink(match)?.replace(/`/g, ""));

    const parseMipNames = (item) =>
      item?.replace(
        /MIP\d+/gi,
        (item) => `[${item}](mips/details/${item} "smart-Mip")`
      );

    const parseMipComponent = (item) =>
      item?.replace(/MIP\d+[ca]\d+/gi, (item) => {
        const mipFather = item.match(/MIP\d+/gi)[0];
        return `[${item}](mips/details/${mipFather}#${item} "smart-Component")`;
      });

    const parseMipSubproposal = (item) =>
      item?.replace(
        /MIP\d+[ca]\d+-SP\d/gi,
        (item) => `[${item}](mips/details/${item} "smart-Subproposal")`
      );
    //#endregion

    raw = processToken(/[\s`(]MIP\d+[)\.\*,\s`:]/gi, raw, parseMipNames);

    raw = processToken(
      /[\s`(]MIP\d+[ca]\d+[)\.\*,\s`:]/gi,
      raw,
      parseMipComponent
    );

    raw = processToken(
      /[\s`(]MIP\d+[ca]\d+-SP\d[\.\*),\s`:]/gi,
      raw,
      parseMipSubproposal
    );

    return raw;
  }

  private parseReferenceList(items: any[]): Reference[] {
    const references: Reference[] = [];
    for (const item of items) {
      for (const list of item.tokens) {
        if (list.tokens) {
          references.push(
            ...list.tokens
              .filter((d) => d.href)
              .map((f) => {
                return {
                  name: f.text,
                  link: f.href,
                };
              })
          );
        }
      }
    }
    return references;
  }

  private parseReferencesTokens(item: any): Reference[] {
    switch (item.type) {
      case "text":
        if (item.text.trim()) {
          return [{
            name: item.text,
            link: "",
          }];
        }
        break;
      case "link":
        return [{
          name: item.text,
          link: item.href,
        }];
      default:
        if (item.tokens) {
          return item.tokens.map((d) => {
            return { name: d.text, link: d.href || d.text };
          });
        }
    }
    return [];
  }

  private parseReferences(next): Reference[] {
    if (next.type === "list") {
      return this.parseReferenceList(next.items);
    }

    if (next?.tokens) {
      const references: Reference[] = [];
      for (const item of next?.tokens) {
        references.push(...this.parseReferencesTokens(item));

      }
      return references;
    }
    return []
  }

  private parseParagraphSummary(list: any[]): string {
    const paragraphSummaryArray = [];

    for (
      let index = 0;
      index < list.length &&
      list[index].type !== "heading" &&
      list[index].depth !== 2;
      index++
    ) {
      paragraphSummaryArray.push(list[index].raw);
    }

    return paragraphSummaryArray.join("").trim();
  }

  private parseNotTitleHeading(
    list: any[],
    mip: MIP,
    item: IGitFile,
  ) {
    let isOnComponentSummary: boolean = false;
    let preamble: IPreamble;
    switch (list[0]?.text) {
      case "Preamble":
        if (item.filename.includes("-")) {
          preamble = this.parsePreamble(list[1]?.text, true);

          preamble.mip = parseInt(mip.proposal?.replace("MIP", ""));
          mip.mipName = preamble.mipName;
          mip.subproposal = this.setSubproposalValue(mip.mipName);
        } else {
          preamble = this.parsePreamble(list[1]?.text);
        }
        break;
      case "Sentence Summary":
        mip.sentenceSummary = list[1].raw;
        break;
      case "Paragraph Summary":
        mip.paragraphSummary = this.parseParagraphSummary(list.slice(1, list.length + 1));
        break;
      case "References":
        mip.references = this.parseReferences(list[1])
        break;
      default:
        if (list[0].text.toLowerCase().includes("component summary")) {
          isOnComponentSummary = true;
        }
    }
    return { mip, preamble, isOnComponentSummary };
  }

  private extractMipNumberFromMipName(mipName: string): string {
    return mipName?.replace(/\d+/g, (number: string) => {
      const numb = parseInt(number);// avoid the starter 0 problem
      const decimalPlaces = 4;

      if (!isNaN(numb)) {
        const parsed = numb.toString();
        return "0".repeat(decimalPlaces - parsed.length) + parsed;
      }
      return number;
    });
  }

  parseLexerData(fileString: string, item: IGitFile): MIP {
    const list: any[] = this.markedService.markedLexer(fileString);
    let preamble: IPreamble = {};
    const sectionsRaw: string[] = [];

    let mip: MIP = {
      hash: item.hash,
      file: fileString,
      language: item.language,
      filename: item.filename,
      sections: [],
      sectionsRaw: [],
      references: [],
    };
    const mipNumberMatch = item.filename.match(/(?<mipNumber>MIP\d+)\//i);
    if (!mipNumberMatch) {
      throw new Error("MIP filename not inside a MIP folder");
    }
    const mipFatherNumber = mipNumberMatch.groups.mipNumber.toUpperCase();

    if (item.filename.includes("-")) {
      mip.proposal = mipFatherNumber;
    } else {
      mip.mipName = mipFatherNumber;

      // Only the mipsFathers
      const componentSummary: string = this.getComponentsSection(fileString);
      const components: Component[] = this.getDataFromComponentText(
        componentSummary
      );
      mip.components = components;
    }

    let title: string;

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let isOnComponentSummary = false;

      if (element?.type === "heading") {
        const matchMipComponentName = element?.text?.match(
          /^(?<mipComponent>MIP\d+[ca]\d+)\s?:/i
        );
        const mipComponent = matchMipComponentName?.groups?.mipComponent;
        if (mipComponent) {
          mip.sections.push({
            heading: element?.text,
            depth: element?.depth,
            mipComponent,
          });
        } else {
          mip.sections.push({
            heading: element?.text,
            depth: element?.depth,
          });
        }

        switch (`${element?.depth}`) {
          case '1':
            title = element?.text;
            break;
          case '2':
            const parsed = this.parseNotTitleHeading(
              list.slice(i, list.length + 1),
              mip,
              item,
            );
            preamble = parsed.preamble;
            mip = {
              ...mip,
              ...parsed.mip
            };
            isOnComponentSummary = parsed.isOnComponentSummary;
            break;
        }
      }
      sectionsRaw.push(
        this.parseMipsNamesComponentsSubproposals(element, isOnComponentSummary)
      );
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
    mip.extra = preamble.extra;
    mip.mip = preamble.mip;
    mip.replaces = preamble.replaces;
    mip.status = preamble.status;
    mip.title = preamble.preambleTitle || title;
    mip.types = preamble.types;
    mip.tags = preamble.tags;
    mip.subproposalsCount = 0;
    mip.votingPortalLink = preamble.votingPortalLink;
    mip.forumLink = preamble.forumLink;
    mip.mipCodeNumber = this.extractMipNumberFromMipName(mip.mipName);
    mip.sectionsRaw = sectionsRaw;

    return mip;
  }

  setSubproposalValue(mipName: string): number {
    let acumulate: any = "";

    for (const item of mipName.split("c")) {
      if (item.includes("MIP")) {
        acumulate = acumulate + item?.replace("MIP", "");
      } else if (item.includes("SP")) {
        acumulate =
          acumulate +
          item
            .split("SP")
            .map((d) => {
              if (d.length === 1) {
                return `0${d}`;
              }
              return d;
            })
            .reduce((a, b) => a + b);
      }
    }

    return parseInt(acumulate);
  }

  parsePreamble(data: string, subproposal = false): IPreamble {
    const preamble: IPreamble = {};

    let flag = true;

    data.split("\n").filter((data: string) => {
      if (!data.includes(":")) {
        return false;
      }

      if (!data.includes(":")) {
        return false;
      }

      const keyValue = [
        data.substring(0, data.indexOf(":")),
        data.substring(data.indexOf(":") + 1).trim()
      ];


      if (subproposal && flag && data.includes("-SP")) {
        const re = /[: #-]/gi;
        preamble.mipName = data?.replace(re, "");

        flag = false;
        subproposal = false;
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
        case "Extra":
          preamble.extra = [...(preamble?.extra || []), keyValue[1].trim()];
          break;
        case "Type":
          preamble.types = keyValue[1].trim();
          break;
        case "Status":
          const status = keyValue[1].trim();

          if (
            status === "Request For Comments (RFC)" ||
            status === "Request for Comments" ||
            status === "Request for Comments (RFC)" ||
            status === "Request for Comment (RFC)" ||
            status === "RFC"
          ) {
            preamble.status = "RFC";
          } else if (
            status === "Rejected (Failed Inclusion Poll July 2020)" ||
            status === "Rejected"
          ) {
            preamble.status = "Rejected";
          } else {
            preamble.status = status;
          }
          break;
        case "Date Proposed":
          preamble.dateProposed = keyValue[1].trim();
          break;
        case "Date Ratified":
          preamble.dateRatified = keyValue[1].trim();
          break;

        case "Ratification Poll URL":
          preamble.votingPortalLink = keyValue.slice(1).join(":").trim();
          break;
        case "Forum URL":
          preamble.forumLink = keyValue.slice(1).join(":").trim();
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

  async updateSubproposalCountField() {
    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: 0,
        page: 0,
      };
      const filter = {
        equals: {
          field: "proposal",
          value: "",
        },
      };
      const mips: {
        items: any[];
        total: number;
      } = await this.mipsService.findAllAfterParse(
        paginationQueryDto,
        "",
        "",
        filter,
        "_id mipName proposal"
      );

      const forLoop = async () => {
        for (let i = 0; i < mips.items.length; i++) {
          const element = mips.items[i];
          const filterSubp = {
            equals: {
              field: "proposal",
              value: element.mipName,
            },
          };
          const subproposals: {
            items: any[];
            total: number;
          } = await this.mipsService.findAllAfterParse(
            paginationQueryDto,
            "",
            "",
            filterSubp,
            "_id mipName proposal"
          );
          element.subproposalsCount = subproposals.total;
          this.mipsService.update(element._id, element as MIP);
        }
      };
      await forLoop();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
