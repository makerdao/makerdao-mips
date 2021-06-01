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
exports.PullRequestSchema = exports.PullRequest = exports.Author = exports.Files = exports.File = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class File {
}
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], File.prototype, "path", void 0);
exports.File = File;
class Files {
}
__decorate([
    mongoose_1.Prop({
        type: [File]
    }),
    __metadata("design:type", Array)
], Files.prototype, "nodes", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Files.prototype, "totalCount", void 0);
exports.Files = Files;
class Author {
}
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Author.prototype, "login", void 0);
exports.Author = Author;
let PullRequest = class PullRequest {
};
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], PullRequest.prototype, "state", void 0);
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], PullRequest.prototype, "url", void 0);
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], PullRequest.prototype, "title", void 0);
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], PullRequest.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], PullRequest.prototype, "body", void 0);
__decorate([
    mongoose_1.Prop({
        type: Author
    }),
    __metadata("design:type", Author)
], PullRequest.prototype, "author", void 0);
__decorate([
    mongoose_1.Prop({
        type: Files
    }),
    __metadata("design:type", Files)
], PullRequest.prototype, "files", void 0);
PullRequest = __decorate([
    mongoose_1.Schema()
], PullRequest);
exports.PullRequest = PullRequest;
exports.PullRequestSchema = mongoose_1.SchemaFactory.createForClass(PullRequest);
//# sourceMappingURL=pull-request.entity.js.map