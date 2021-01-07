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
import { MIPs } from "../interfaces/mips.interface";

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
  ): Promise<MIPs[]> {
    if (paginationQuery) {
      const { limit, offset } = paginationQuery;

      return this.mipsDoc
        .find()
        .sort(order)
        .skip(offset * limit)
        .limit(limit)
        .exec();
    }

    return this.mipsDoc.find().exec();
  }

  count(): Promise<number> {
    return this.mipsDoc.countDocuments().exec();
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

    const MIPs = await this.mipsDoc.findOne({ _id: id }).exec();
    if (!MIPs) {
      throw new NotFoundException(`MIPs #${id} not found`);
    }
    return MIPs;
  }

  create(mIPs: MIPs): Promise<MIP> {
    return this.mipsDoc.create(mIPs);
  }

  insertMany(mips: MIP[] | any): Promise<MIPsDoc> {
    return this.mipsDoc.insertMany(mips);
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
          error: `MIPs #${id} not found`,
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
