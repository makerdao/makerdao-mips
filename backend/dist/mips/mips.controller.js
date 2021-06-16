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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIPsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const mips_service_1 = require("./services/mips.service");
const parse_mips_service_1 = require("./services/parse-mips.service");
const pull_requests_service_1 = require("./services/pull-requests.service");
const env_1 = require("../env");
const query_dto_1 = require("./dto/query.dto");
let MIPsController = class MIPsController {
    constructor(mipsService, parseMIPsService, pullRequestService, configService) {
        this.mipsService = mipsService;
        this.parseMIPsService = parseMIPsService;
        this.pullRequestService = pullRequestService;
        this.configService = configService;
    }
    async findAll(limit, page, order, select, search, filter) {
        try {
            const paginationQueryDto = {
                limit: +limit || 10,
                page: +page,
            };
            return await this.mipsService.findAll(paginationQueryDto, order, search, filter, select);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneByMipName(mipName) {
        const mip = await this.mipsService.findOneByMipName(mipName);
        if (!mip) {
            throw new common_1.NotFoundException(`MIPs with name ${mipName} not found`);
        }
        let subproposals = [];
        if (!mip.proposal) {
            subproposals = await this.mipsService.findOneByProposal(mip.mipName);
        }
        try {
            const pullRequests = await this.pullRequestService.aggregate(mip.filename);
            return { mip, pullRequests, subproposals };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async smartSearch(field, value) {
        try {
            return await this.mipsService.smartSearch(field, value);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOneBy(field, value) {
        let mip;
        switch (field) {
            case 'filename':
                mip = await this.mipsService.findOneByFileName(value);
                if (!mip) {
                    throw new common_1.NotFoundException(`MIPs with ${field} ${value} not found`);
                }
                return mip;
            case 'mipName':
                mip = await this.mipsService.getSummaryByMipName(value);
                if (!mip) {
                    throw new common_1.NotFoundException(`MIPs with ${field} ${value} not found`);
                }
                return mip;
            default:
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: `Field ${field} not found`,
                }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async callback({ headers, body }) {
        try {
            const secretToken = this.configService.get(env_1.Env.WebhooksSecretToken);
            const hmac = crypto.createHmac("sha1", secretToken);
            const selfSignature = hmac.update(JSON.stringify(body)).digest("hex");
            const comparisonSignature = `sha1=${selfSignature}`;
            const signature = headers["x-hub-signature"];
            if (!signature) {
                return false;
            }
            const source = Buffer.from(signature);
            const comparison = Buffer.from(comparisonSignature);
            if (!crypto.timingSafeEqual(source, comparison)) {
                return false;
            }
            this.parseMIPsService.loggerMessage("Webhooks works");
            return this.parseMIPsService.parse();
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    common_1.Get("findall"),
    swagger_1.ApiQuery({
        name: "limit",
        description: "Limit per page, default value 10",
        type: Number,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: "page",
        description: "Page, default value equal to zero",
        type: Number,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: "order",
        description: `'title -mip', means: order property title ASC and mip DESC`,
        type: String,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: "select",
        description: `Select files to get output`,
        type: String,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: "search",
        description: 'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (\\ ") that specifies a phrase',
        type: String,
        required: false,
    }),
    swagger_1.ApiQuery({
        name: "filter",
        description: "Filter field with various filter patterns. (contains, notcontains, equals, notequals)",
        required: false,
        type: "object",
        schema: {
            type: "object",
            example: {
                filter: {
                    contains: [{ field: "status", value: "RFC" }],
                    notcontains: [{ field: "status", value: "Accepted" }],
                    equals: [{ field: "mip", value: -1 }],
                    notequals: [{ field: "mip", value: -1 }],
                },
            },
        },
    }),
    __param(0, common_1.Query("limit")),
    __param(1, common_1.Query("page")),
    __param(2, common_1.Query("order")),
    __param(3, common_1.Query("select")),
    __param(4, common_1.Query("search")),
    __param(5, common_1.Query("filter")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, query_dto_1.Filters]),
    __metadata("design:returntype", Promise)
], MIPsController.prototype, "findAll", null);
__decorate([
    common_1.Get("findone"),
    swagger_1.ApiQuery({
        type: String,
        name: "mipName",
        required: true
    }),
    __param(0, common_1.Query("mipName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MIPsController.prototype, "findOneByMipName", null);
__decorate([
    common_1.Get("smart-search"),
    swagger_1.ApiQuery({
        type: String,
        name: "field",
        required: true
    }),
    swagger_1.ApiQuery({
        type: String,
        name: "value",
        required: true
    }),
    __param(0, common_1.Query("field")),
    __param(1, common_1.Query("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MIPsController.prototype, "smartSearch", null);
__decorate([
    common_1.Get("findone-by"),
    swagger_1.ApiQuery({
        type: String,
        name: "field",
        required: true
    }),
    swagger_1.ApiQuery({
        type: String,
        name: "value",
        required: true
    }),
    __param(0, common_1.Query("field")),
    __param(1, common_1.Query("value")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MIPsController.prototype, "findOneBy", null);
__decorate([
    common_1.Post("callback"),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MIPsController.prototype, "callback", null);
MIPsController = __decorate([
    common_1.Controller("mips"),
    __metadata("design:paramtypes", [mips_service_1.MIPsService,
        parse_mips_service_1.ParseMIPsService,
        pull_requests_service_1.PullRequestService,
        config_1.ConfigService])
], MIPsController);
exports.MIPsController = MIPsController;
//# sourceMappingURL=mips.controller.js.map