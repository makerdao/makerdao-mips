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
var SimpleGitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGitService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const simple_git_1 = require("simple-git");
const env_1 = require("../../env");
let SimpleGitService = SimpleGitService_1 = class SimpleGitService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SimpleGitService_1.name);
        const options = {
            baseDir: `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`,
            binary: "git",
            maxConcurrentProcesses: 6,
        };
        this.git = simple_git_1.default(options);
    }
    cloneRepository() {
        const localPath = `${process.cwd()}/${this.configService.get(env_1.Env.FolderRepositoryName)}`;
        return this.git.clone(this.configService.get(env_1.Env.RepoPath), localPath);
    }
    pull(remote = "origin", branch = "master") {
        return this.git.pull(remote, branch);
    }
    async getFiles() {
        const folderPattern = this.configService.get(env_1.Env.FolderPattern);
        try {
            const info = await this.git.raw([
                "ls-files",
                "-s",
                folderPattern,
            ]);
            return info
                .split("\n")
                .filter((data) => data.length > 3 &&
                !data.includes("placeholder.md") &&
                !data.includes("Template") &&
                data.includes(".md"))
                .map((data) => {
                const newData = data.replace("\t", " ").split(" ");
                if (newData.length > 4) {
                    let filename = newData[3];
                    for (let i = 4; i < newData.length; i++) {
                        filename = `${filename} ${newData[i]}`;
                    }
                    return {
                        filename: filename,
                        hash: newData[1].trim(),
                    };
                }
                return {
                    filename: newData[3].trim(),
                    hash: newData[1].trim(),
                };
            });
        }
        catch (error) {
            this.logger.error(error);
            return error;
        }
    }
};
SimpleGitService = SimpleGitService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SimpleGitService);
exports.SimpleGitService = SimpleGitService;
//# sourceMappingURL=simple-git.service.js.map