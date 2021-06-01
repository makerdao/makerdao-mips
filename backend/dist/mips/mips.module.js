"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIPsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mips_entity_1 = require("./entities/mips.entity");
const mips_controller_1 = require("./mips.controller");
const mips_service_1 = require("./services/mips.service");
const parse_mips_service_1 = require("./services/parse-mips.service");
const simple_git_service_1 = require("./services/simple-git.service");
const marked_service_1 = require("./services/marked.service");
const github_service_1 = require("./services/github.service");
const pull_request_entity_1 = require("./entities/pull-request.entity");
const pull_requests_service_1 = require("./services/pull-requests.service");
const mips_command_1 = require("./mips.command");
const parse_query_service_1 = require("./services/parse-query.service");
let MIPsModule = class MIPsModule {
};
MIPsModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: mips_entity_1.MIP.name,
                    collection: mips_entity_1.MIP.name,
                    useFactory: () => {
                        const schema = mips_entity_1.MIPsSchema;
                        schema.index({ filename: 1, hash: 1 }, { unique: true });
                        return schema;
                    },
                },
                {
                    name: pull_request_entity_1.PullRequest.name,
                    collection: pull_request_entity_1.PullRequest.name,
                    useFactory: () => {
                        const schema = pull_request_entity_1.PullRequestSchema;
                        return schema;
                    },
                },
            ]),
        ],
        controllers: [mips_controller_1.MIPsController],
        providers: [
            mips_service_1.MIPsService,
            simple_git_service_1.SimpleGitService,
            parse_mips_service_1.ParseMIPsService,
            parse_query_service_1.ParseQueryService,
            simple_git_service_1.SimpleGitService,
            marked_service_1.MarkedService,
            github_service_1.GithubService,
            pull_requests_service_1.PullRequestService,
            mips_command_1.ParseMIPsCommand,
        ],
    })
], MIPsModule);
exports.MIPsModule = MIPsModule;
//# sourceMappingURL=mips.module.js.map