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
exports.PullRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pull_request_entity_1 = require("../entities/pull-request.entity");
let PullRequestService = class PullRequestService {
    constructor(pullRequestDoc) {
        this.pullRequestDoc = pullRequestDoc;
    }
    async create(pullRequest) {
        return await this.pullRequestDoc.insertMany(pullRequest);
    }
    count() {
        return this.pullRequestDoc.countDocuments().exec();
    }
    async aggregate(filename) {
        const data = await this.pullRequestDoc
            .aggregate([
            { $match: { "files.nodes": { path: filename } } },
            {
                $facet: {
                    open: [
                        { $match: { state: "OPEN" } },
                        { $group: { _id: null, count: { $sum: 1 } } },
                    ],
                    close: [
                        { $match: { state: { $in: ["MERGED", "CLOSED"] } } },
                        { $group: { _id: null, count: { $sum: 1 } } },
                    ],
                    items: [{
                            $group: {
                                _id: null, data: {
                                    $push: {
                                        id: "$_id",
                                        url: "$url",
                                        title: "$title",
                                        body: "$body",
                                        createdAt: "$createdAt",
                                        author: "$author",
                                        state: "$state"
                                    }
                                }
                            }
                        }],
                },
            },
            {
                $project: {
                    open: { $ifNull: [{ $arrayElemAt: ["$open.count", 0] }, 0] },
                    close: { $ifNull: [{ $arrayElemAt: ["$close.count", 0] }, 0] },
                    items: {
                        $slice: [
                            { $ifNull: [{ $arrayElemAt: ["$items.data", 0] }, []] },
                            -3,
                        ],
                    },
                },
            },
        ])
            .exec();
        if (data.length > 0) {
            return data[0];
        }
        return data;
    }
};
PullRequestService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(pull_request_entity_1.PullRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PullRequestService);
exports.PullRequestService = PullRequestService;
//# sourceMappingURL=pull-requests.service.js.map