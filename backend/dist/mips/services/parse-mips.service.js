"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ParseMIPsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseMIPsService = void 0;
const promises_1 = require("fs/promises");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mips_service_1 = require("./mips.service");
const simple_git_service_1 = require("./simple-git.service");
const env_1 = require("../../env");
const marked_service_1 = require("./marked.service");
const github_service_1 = require("./github.service");
const pull_requests_service_1 = require("./pull-requests.service");
const definitions_graphql_1 = require("../graphql/definitions.graphql");
let ParseMIPsService = ParseMIPsService_1 = class ParseMIPsService {
    constructor(simpleGitService, mipsService, configService, githubService, markedService, pullRequestService) {
        this.simpleGitService = simpleGitService;
        this.mipsService = mipsService;
        this.configService = configService;
        this.githubService = githubService;
        this.markedService = markedService;
        this.pullRequestService = pullRequestService;
        this.logger = new common_1.Logger(ParseMIPsService_1.name);
        this.baseDir = `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`;
    }
    loggerMessage(message) {
        this.logger.log(message);
    }
    async parse() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const branch = this.configService.get(env_1.Env.RepoBranch);
        try {
            this.simpleGitService.pull("origin", branch);
            const result = await Promise.all([
                this.simpleGitService.getFiles(),
                this.mipsService.getAll(),
                this.pullRequestService.count(),
                this.githubService.pullRequests(definitions_graphql_1.pullRequestsCount),
            ]);
            const synchronizeData = await this.synchronizeData(result[0], result[1]);
            if (result[2] === 0) {
                let data = await this.githubService.pullRequests(definitions_graphql_1.pullRequests);
                await this.pullRequestService.create((_b = (_a = data === null || data === void 0 ? void 0 : data.repository) === null || _a === void 0 ? void 0 : _a.pullRequests) === null || _b === void 0 ? void 0 : _b.nodes);
                while ((_e = (_d = (_c = data === null || data === void 0 ? void 0 : data.repository) === null || _c === void 0 ? void 0 : _c.pullRequests) === null || _d === void 0 ? void 0 : _d.pageInfo) === null || _e === void 0 ? void 0 : _e.hasNextPage) {
                    data = await this.githubService.pullRequests(definitions_graphql_1.pullRequestsAfter, (_h = (_g = (_f = data === null || data === void 0 ? void 0 : data.repository) === null || _f === void 0 ? void 0 : _f.pullRequests) === null || _g === void 0 ? void 0 : _g.pageInfo) === null || _h === void 0 ? void 0 : _h.endCursor);
                    await this.pullRequestService.create((_k = (_j = data === null || data === void 0 ? void 0 : data.repository) === null || _j === void 0 ? void 0 : _j.pullRequests) === null || _k === void 0 ? void 0 : _k.nodes);
                }
            }
            else {
                if (result[3].repository.pullRequests.totalCount - result[2] > 0) {
                    const data = await this.githubService.pullRequestsLast(definitions_graphql_1.pullRequestsLast, result[3].repository.pullRequests.totalCount - result[2]);
                    await this.pullRequestService.create((_m = (_l = data === null || data === void 0 ? void 0 : data.repository) === null || _l === void 0 ? void 0 : _l.pullRequests) === null || _m === void 0 ? void 0 : _m.nodes);
                }
                this.logger.log(`Total news pull request ===> ${result[3].repository.pullRequests.totalCount - result[2]}`);
            }
            this.logger.log(`Synchronize Data ===> ${JSON.stringify(synchronizeData)}`);
            return true;
        }
        catch (error) {
            this.logger.error(error);
            console.log(error);
            return false;
        }
    }
    async synchronizeData(filesGit, filesDB) {
        const synchronizeData = {
            creates: 0,
            deletes: 0,
            updates: 0,
        };
        const createItems = [];
        for (const item of filesGit) {
            if (!filesDB.has(item.filename)) {
                const dir = `${this.baseDir}/${item.filename}`;
                try {
                    const fileString = await promises_1.readFile(dir, "utf-8");
                    const mip = this.parseLexerData(fileString, item);
                    if (mip.mip === undefined || mip.mipName === undefined) {
                        console.log(mip.mip, mip.mipName, mip.filename);
                    }
                    if (mip) {
                        createItems.push(mip);
                    }
                }
                catch (error) {
                    this.logger.log(error.message);
                    continue;
                }
            }
            else {
                const fileDB = filesDB.get(item.filename);
                if (fileDB.hash !== item.hash) {
                    const dir = `${this.baseDir}/${item.filename}`;
                    const fileString = await promises_1.readFile(dir, "utf-8");
                    const mip = this.parseLexerData(fileString, item);
                    if (mip) {
                        try {
                            await this.mipsService.update(fileDB._id, mip);
                        }
                        catch (error) {
                            this.logger.error(error.message);
                        }
                    }
                    synchronizeData.updates++;
                }
                filesDB.delete(item.filename);
            }
        }
        const deleteItems = [];
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
    parseLexerData(fileString, item) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        const list = this.markedService.markedLexer(fileString);
        let preamble = {};
        const mip = {
            hash: item.hash,
            file: fileString,
            filename: item.filename,
            sections: [],
            sectionsRaw: [],
            references: [],
        };
        if (item.filename.includes("-")) {
            mip.proposal = item.filename.split("/")[0];
        }
        else {
            mip.mipName = item.filename.split("/")[0];
        }
        let title;
        for (let i = 0; i < list.length; i++) {
            mip.sectionsRaw.push(list[i].raw);
            if (((_a = list[i]) === null || _a === void 0 ? void 0 : _a.type) === "heading" && ((_b = list[i]) === null || _b === void 0 ? void 0 : _b.depth) === 1) {
                title = (_c = list[i]) === null || _c === void 0 ? void 0 : _c.text;
            }
            else if (((_d = list[i]) === null || _d === void 0 ? void 0 : _d.type) === "heading" &&
                ((_e = list[i]) === null || _e === void 0 ? void 0 : _e.depth) === 2 &&
                ((_f = list[i]) === null || _f === void 0 ? void 0 : _f.text) === "Preamble" &&
                i + 1 < list.length) {
                if (((_g = list[i + 1]) === null || _g === void 0 ? void 0 : _g.type) === "code") {
                    if (item.filename.includes("-")) {
                        preamble = this.parsePreamble((_h = list[i + 1]) === null || _h === void 0 ? void 0 : _h.text, true);
                        preamble.mip = parseInt(mip.proposal.replace("MIP", ""));
                        mip.mipName = preamble.mipName;
                        mip.subproposal = this.setSubproposalValue(mip.mipName);
                    }
                    else {
                        preamble = this.parsePreamble((_j = list[i + 1]) === null || _j === void 0 ? void 0 : _j.text);
                    }
                }
            }
            else if (((_k = list[i]) === null || _k === void 0 ? void 0 : _k.type) === "heading" &&
                ((_l = list[i]) === null || _l === void 0 ? void 0 : _l.depth) === 2 &&
                ((_m = list[i]) === null || _m === void 0 ? void 0 : _m.text) === "Sentence Summary" &&
                i + 1 < list.length) {
                mip.sentenceSummary = (_o = list[i + 1]) === null || _o === void 0 ? void 0 : _o.raw;
            }
            else if (((_p = list[i]) === null || _p === void 0 ? void 0 : _p.type) === "heading" &&
                ((_q = list[i]) === null || _q === void 0 ? void 0 : _q.depth) === 2 &&
                ((_r = list[i]) === null || _r === void 0 ? void 0 : _r.text) === "Paragraph Summary" &&
                i + 1 < list.length) {
                mip.paragraphSummary = (_s = list[i + 1]) === null || _s === void 0 ? void 0 : _s.raw;
            }
            else if (((_t = list[i]) === null || _t === void 0 ? void 0 : _t.type) === "heading" &&
                ((_u = list[i]) === null || _u === void 0 ? void 0 : _u.depth) === 2 &&
                ((_v = list[i]) === null || _v === void 0 ? void 0 : _v.text) === "References" &&
                i + 1 < list.length) {
                if (list[i + 1].type === "list") {
                    for (const item of (_w = list[i + 1]) === null || _w === void 0 ? void 0 : _w.items) {
                        for (const list of item.tokens) {
                            if (list.tokens) {
                                mip.references.push(...list.tokens
                                    .filter((d) => d.href)
                                    .map((f) => {
                                    return {
                                        name: f.text,
                                        link: f.href,
                                    };
                                }));
                            }
                        }
                    }
                }
                else {
                    if ((_x = list[i + 1]) === null || _x === void 0 ? void 0 : _x.tokens) {
                        for (const item of (_y = list[i + 1]) === null || _y === void 0 ? void 0 : _y.tokens) {
                            if (item.type === "text") {
                                mip.references.push({
                                    name: item.text,
                                    link: "",
                                });
                            }
                            else {
                                if (item.tokens) {
                                    mip.references.push(...item.tokens.map((d) => {
                                        return { name: d.text, link: d.text };
                                    }));
                                }
                            }
                        }
                    }
                }
            }
            if (((_z = list[i]) === null || _z === void 0 ? void 0 : _z.type) === "heading") {
                mip.sections.push({
                    heading: (_0 = list[i]) === null || _0 === void 0 ? void 0 : _0.text,
                    depth: (_1 = list[i]) === null || _1 === void 0 ? void 0 : _1.depth,
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
    setSubproposalValue(mipName) {
        let acumulate = "";
        for (const item of mipName.split("c")) {
            if (item.includes("MIP")) {
                acumulate = acumulate + item.replace("MIP", "");
            }
            else if (item.includes("SP")) {
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
    parsePreamble(data, subproposal = false) {
        const preamble = {};
        let flag = true;
        data.split("\n").filter((data) => {
            if (!data.includes(":")) {
                return false;
            }
            const keyValue = data.split(":");
            if (!(keyValue.length > 1)) {
                return false;
            }
            if (subproposal && flag && data.includes("-SP")) {
                const re = /[: #-]/gi;
                preamble.mipName = data.replace(re, "");
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
                case "Type":
                    preamble.types = keyValue[1].trim();
                    break;
                case "Status":
                    const status = keyValue[1].trim();
                    if (status === "Request For Comments (RFC)" ||
                        status === "Request for Comments" ||
                        status === "Request for Comments (RFC)" ||
                        status === "RFC") {
                        preamble.status = "RFC";
                    }
                    else {
                        preamble.status = status;
                    }
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
    async parseSections(file) {
        return this.markedService.markedLexer(file);
    }
};
ParseMIPsService = ParseMIPsService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [simple_git_service_1.SimpleGitService,
        mips_service_1.MIPsService,
        config_1.ConfigService,
        github_service_1.GithubService,
        marked_service_1.MarkedService,
        pull_requests_service_1.PullRequestService])
], ParseMIPsService);
exports.ParseMIPsService = ParseMIPsService;
//# sourceMappingURL=parse-mips.service.js.map