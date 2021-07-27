import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { Filters, PaginationQueryDto } from "../dto/query.dto";

import { MIP, MIPsDoc } from "../entities/mips.entity";
import { IGitFile, IMIPs } from "../interfaces/mips.interface";
import { ParseQueryService } from "./parse-query.service";

@Injectable()
export class MIPsService {
  constructor(
    @InjectModel(MIP.name)
    private readonly mipsDoc: Model<MIPsDoc>,
    private readonly parseQueryService: ParseQueryService
  ) {}

  async groupProposal(): Promise<any> {
    return await this.mipsDoc.aggregate([
      { $match: { proposal: { $ne: "" } } },
      { $group: { _id: "$proposal" } },
    ]);
  }

  async findAll(
    paginationQuery?: PaginationQueryDto,
    order?: string,
    search?: string,
    filter?: Filters,
    select?: string
  ): Promise<any> {
    const buildFilter = await this.buildFilter(search, filter);
    const { limit, page } = paginationQuery;    

    const total = await this.mipsDoc.countDocuments(buildFilter).exec();

    if (select) {
      const items = await this.mipsDoc
        .find(buildFilter)
        .select(select)
        .sort(order)
        .skip(page * limit)
        .limit(limit)
        .exec();

      return { items, total };
    }

    const items = await this.mipsDoc
      .find(buildFilter)
      .select(["-file", "-__v", "-sections", "-sectionsRaw"])
      .sort(order)
      .skip(page * limit)
      .limit(limit)
      .exec();

    return { items, total };
  }

  // Function to build filter
  async buildFilter(search: string, filter?: Filters): Promise<any> {
    let source = {};

    if (filter?.contains) {
      const field = filter.contains["field"];
      const value = filter.contains["value"];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = {
            $regex: new RegExp(`${newValue}`),
            $options: "i",
          };
        }
      } else {
        const newValue = this.validField(field.toString(), value);
        source[`${field.toString()}`] = {
          $regex: new RegExp(`${newValue}`),
          $options: "i",
        };
      }
    }

    if (filter?.equals) {
      const field = filter.equals["field"];
      const value = filter.equals["value"];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = newValue;
        }
      } else {
        const newValue = this.validField(field.toString(), value);
        source[`${field.toString()}`] = newValue;
      }
    }

    if (filter?.inarray) {
      const field = filter.inarray["field"];
      const value = filter.inarray["value"];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = { $in: newValue };
        }
      } else {
        const newValue = this.validField(field.toString(), value);
        source[`${field.toString()}`] = { $in: newValue };
      }
    }

    if (filter?.notcontains) {
      const field = filter.notcontains["field"];
      const value = filter.notcontains["value"];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = {
            $not: { $regex: new RegExp(`${newValue}`), $options: "i" },
          };
        }
      } else {
        const newValue = this.validField(field.toString(), value);
        source[`${field.toString()}`] = {
          $not: { $regex: new RegExp(`${newValue}`), $options: "i" },
        };
      }
    }

    if (filter?.notequals) {
      const field = filter.notequals["field"];
      const value = filter.notequals["value"];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = { $ne: newValue };
        }
      } else {
        const newValue = this.validField(field.toString(), value);
        source[`${field.toString()}`] = { $ne: newValue };
      }
    }

    if (search) {
      if (search.startsWith("$")) {
        const ast = await this.parseQueryService.parse(search);
        const query = this.buildSmartMongoDBQuery(ast);

        // console.log(JSON.stringify(ast));
        // console.log(JSON.stringify(query));
        // console.log(JSON.stringify(source));

        source = {
          $and: [
            {
              ...source,
              ...query,
            },
          ],
        };

        // console.log(JSON.stringify(ast), "<==========");
        // console.log(JSON.stringify(query), "<==========");
      } else {
        source["$text"] = { $search: JSON.parse(`"${search}"`) };
      }
    }
    return source;
  }

  buildSmartMongoDBQuery(ast: any): any {
    const or = new RegExp("or", "gi");
    const and = new RegExp("and", "gi");
    const not = new RegExp("not", "gi");

    if (ast.type === "LITERAL" && ast.name.includes("#")) {
      return { tags: { $in: [ast.name.replace("#", "")] } };
    } else if (ast.type === "LITERAL" && ast.name.includes("@")) {
      return {
        status: {
          $regex: new RegExp(`${ast.name.replace("@", "")}`),
          $options: "i",
        },
      };
    } else {
      if (ast.type === "OPERATION" && or.exec(ast.op)) {
        const request = [];

        for (const item of ast.left) {
          request.push(this.buildSmartMongoDBQuery(item));
        }

        return {
          $or: [...request],
        };
      } else if (ast.type === "OPERATION" && and.exec(ast.op)) {
        const request = [];

        for (const item of ast.left) {
          request.push(this.buildSmartMongoDBQuery(item));
        }

        return {
          $and: [...request],
        };
      } else if (ast.type === "OPERATION" && not.exec(ast.op)) {
        if (ast.left.includes("#")) {
          return { tags: { $nin: [ast.left.replace("#", "")] } };
        } else if (ast.left.includes("@")) {
          return {
            status: {
              $not: {
                $regex: new RegExp(`${ast.left.replace("@", "")}`),
                $options: "i",
              },
            },
          };
        } else {
          throw new Error("Database query not support");
        }
      } else {
        return;
      }
    }
  }

  isValidObjectId(id: string): boolean {
    if (isValidObjectId(id)) {
      return true;
    }
    return false;
  }

  validField(field: string, value: any): any {
    let flag = false;

    switch (field) {
      case "status":
        flag = true;
        break;
      case "mipName":
        flag = true;
        break;
      case "filename":
        flag = true;
        break;
      case "proposal":
        flag = true;
        break;
      case "mip":
        flag = true;
        break;
      case "tags":
        flag = true;
        break;
      case "contributors":
        flag = true;
        break;
      case "author":
        flag = true;
        break;
      case "mipFather":
        flag = true;
        break;
    }

    if (!flag) {
      throw new Error(`Invalid filter field (${field})`);
    }
    return value;
  }

  async findOneByMipName(mipName: string): Promise<MIP> {
    return await this.mipsDoc
      .findOne({ mipName })
      .select(["-__v", "-file"])
      .exec();
  }

  async smartSearch(field: string, value: string): Promise<MIP[]> {
    switch (field) {
      case "tags":
        return await this.mipsDoc.aggregate([
          { $unwind: "$tags" },
          {
            $match: {
              tags: {
                $regex: new RegExp(`^${value}`),
                $options: "i",
              },
            },
          },
          { $group: { _id: { tags: "$tags" }, tag: { $first: "$tags" } } },
          { $project: { _id: 0, tag: "$tag" } },
        ]);
      case "status":
        return await this.mipsDoc.aggregate([
          {
            $match: {
              status: {
                $regex: new RegExp(`^${value}`),
                $options: "i",
              },
            },
          },
          {
            $group: {
              _id: { status: "$status" },
              status: { $first: "$status" },
            },
          },
          { $project: { _id: 0, status: "$status" } },
        ]);

      default:
        throw new Error(`Field ${field} invalid`);
    }
  }

  async findOneByFileName(filename: string): Promise<MIP> {
    const filter = {
      filename: {
        $regex: new RegExp(filename),
        $options: "i",
      },
    };

    return await this.mipsDoc.findOne(filter).select(["-__v", "-file"]).exec();
  }

  async getSummaryByMipName(mipName: string): Promise<MIP> {
    return await this.mipsDoc
      .findOne({ mipName })
      .select(["sentenceSummary", "paragraphSummary", "title"])
      .exec();
  }

  async findOneByProposal(proposal: string): Promise<MIP[]> {
    return await this.mipsDoc
      .find({ proposal: proposal })
      .select("title mipName")
      .sort("mip subproposal")
      .exec();
  }

  create(mIPs: IMIPs): Promise<MIP> {
    return this.mipsDoc.create(mIPs);
  }

  insertMany(mips: MIP[] | any): Promise<any> {
    return this.mipsDoc.insertMany(mips);
  }

  async getAll(): Promise<Map<string, IGitFile>> {
    const files = new Map();

    for await (const doc of this.mipsDoc
      .find([{ $sort: { filename: 1 } }])
      .select(["hash", "filename"])
      .cursor()) {
      files.set(doc.filename, doc);
    }

    return files;
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.mipsDoc.deleteMany({ _id: { $in: ids } });
  }

  async deleteMany(): Promise<void> {
    await this.mipsDoc.deleteMany();
  }

  async update(id: string, mIPs: MIP): Promise<MIP> {
    const existingMIPs = await this.mipsDoc
      .findOneAndUpdate(
        { _id: id },
        { $set: mIPs },
        { new: true, useFindAndModify: false }
      )
      .lean(true);

    return existingMIPs;
  }

  async setMipsFather(mips: string[]): Promise<any> {
    const existingMIPs = await this.mipsDoc
      .updateMany(
        { mipName: {$in: mips}},
        { $set: {mipFather: true} },
        { new: true, useFindAndModify: false }
      )
      .lean(true);

    return existingMIPs;
  }

  async remove(
    id: string
  ): Promise<{
    n: number;
    ok: number;
    deletedCount: number;
  }> {
    return await this.mipsDoc.deleteOne({ _id: id }).lean(true);
  }
}
