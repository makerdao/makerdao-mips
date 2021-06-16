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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseMIPsCommand = void 0;
const nestjs_command_1 = require("nestjs-command");
const common_1 = require("@nestjs/common");
const parse_mips_service_1 = require("./services/parse-mips.service");
const mips_service_1 = require("./services/mips.service");
let ParseMIPsCommand = class ParseMIPsCommand {
    constructor(parseMIPsService, mipsService) {
        this.parseMIPsService = parseMIPsService;
        this.mipsService = mipsService;
    }
    async parse() {
        await this.parseMIPsService.parse();
    }
};
__decorate([
    nestjs_command_1.Command({
        command: "parse:mips",
        describe: "Parse mips of makerDao repository",
        autoExit: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParseMIPsCommand.prototype, "parse", null);
ParseMIPsCommand = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [parse_mips_service_1.ParseMIPsService,
        mips_service_1.MIPsService])
], ParseMIPsCommand);
exports.ParseMIPsCommand = ParseMIPsCommand;
//# sourceMappingURL=mips.command.js.map