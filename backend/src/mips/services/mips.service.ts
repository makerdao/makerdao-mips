import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";

import { PaginationQueryDto } from "@app/common/dto/pagination-query.dto";

import { MIP, MIPsDoc } from "../entities/mips.entity";
import { IGitFile, IMIPs } from "../interfaces/mips.interface";

@Injectable()
export class MIPsService {
  constructor(
    @InjectModel(MIP.name)
    private readonly mipsDoc: Model<MIPsDoc>
  ) {}

  findAll(
    paginationQuery?: PaginationQueryDto,
    order = "",
    search = ""
  ): Promise<IMIPs[]> {
    let text;

    if (search) {
      text = { $text: { $search: JSON.parse(`"${search}"`) } };
    }

    if (paginationQuery) {
      const { limit, offset } = paginationQuery;

      return this.mipsDoc
        .find(text)
        .select(['-file', '-__v'])
        .sort(order)
        .skip(offset * limit)
        .limit(limit)
        .exec();
    }

    return this.mipsDoc.find(text).select(['-file', '-__v']).sort(order).exec();
  }

  count(search = ""): Promise<number> {
    let text = {};

    if (search) {
      text = { $text: { $search: JSON.parse(`"${search}"`) } };
    }
    return this.mipsDoc.countDocuments(text).exec();
  }

  async findOne(id: string): Promise<MIP> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const IMIPs = await this.mipsDoc.findOne({ _id: id }).exec();
    if (!IMIPs) {
      throw new NotFoundException(`IMIPs #${id} not found`);
    }
    return IMIPs;
  }

  create(mIPs: IMIPs): Promise<MIP> {
    return this.mipsDoc.create(mIPs);
  }

  insertMany(mips: MIP[] | any): Promise<MIPsDoc> {
    return this.mipsDoc.insertMany(mips);
  }

  async getAll(): Promise<Map<string, IGitFile>> {
    const files = new Map();

    for await (const doc of this.mipsDoc.find([{ $sort: { filename: 1 } }]).select(['hash', 'filename']).cursor()) {
      files.set(doc.filename, doc);
    }

    return files;
  }

  async deleteManyByIds(ids: string[]): Promise<void> {
    await this.mipsDoc.deleteMany({_id: {$in: ids}});
  }

  async update(id: string, mIPs: MIP): Promise<MIP> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const existingMIPs = await this.mipsDoc
      .findOneAndUpdate(
        { _id: id },
        { $set: mIPs },
        { new: true, useFindAndModify: false }
      )
      .lean(true);

    if (!existingMIPs) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `IMIPs #${id} not found`,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return existingMIPs;
  }

  async remove(
    id: string
  ): Promise<{
    n: number;
    ok: number;
    deletedCount: number;
  }> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.mipsDoc.deleteOne({ _id: id }).lean(true);
  }
}
