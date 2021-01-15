import {
  Injectable,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { Filters, PaginationQueryDto } from "../dto/query.dto";

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
    order?: string,
    search?: string,
    filter?: Filters 
  ): Promise<IMIPs[]> {
    const buildFilter = this.buildFilter(search, filter);    
    const { limit, page } = paginationQuery;

    return this.mipsDoc
      .find(buildFilter)
      .select(["-file", "-__v"])
      .sort(order)
      .skip(page * limit)
      .limit(limit)
      .exec();    
  }

  count(search: string, filter?: Filters): Promise<number> {    
    const buildFilter = this.buildFilter(search, filter);    
    return this.mipsDoc.countDocuments(buildFilter).exec();
  }

  buildFilter(search: string, filter?: Filters): any {
    const source = {};

    if (search) {
      source["$text"] = { $search: JSON.parse(`"${search}"`) } ;
    }

    if (filter?.contains) {
      const field = filter.contains['field'];
      const value = filter.contains['value'];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field.toString(), value[i]); 
          source[`${field[i].toString()}`] = { $regex: new RegExp(`${newValue}`), $options: 'i' };                   
        }
      } else {
        const newValue = this.validField(field.toString(), value);        
        source[`${field.toString()}`] = { $regex: new RegExp(`${newValue}`), $options: 'i' };
      }
    }

    if (filter?.equals) {
      const field = filter.equals['field'];
      const value = filter.equals['value'];      

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field.toString(), value[i]); 
          source[`${field[i].toString()}`] = newValue;                   
        }
      } else {
        const newValue = this.validField(field.toString(), value);       
        source[`${field.toString()}`] = newValue;
      }
    }

    if (filter?.notcontains) {      
      const field = filter.notcontains['field'];
      const value = filter.notcontains['value'];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field.toString(), value[i]); 
          source[`${field[i].toString()}`] = { $not: { $regex: new RegExp(`${newValue}`), $options: 'i' }};                   
        }
      } else {
        const newValue = this.validField(field.toString(), value);        
        source[`${field.toString()}`] = { $not: { $regex: new RegExp(`${newValue}`), $options: 'i' }};
      }
    }

    if (filter?.notequals) {
      const field = filter.notequals['field'];
      const value = filter.notequals['value'];

      if (Array.isArray(field) && Array.isArray(value)) {
        for (let i = 0; i < field.length; i++) {
          const newValue = this.validField(field[i].toString(), value[i]);
          source[`${field[i].toString()}`] = { $ne: newValue};                   
        }
      } else {
        const newValue = this.validField(field.toString(), value);        
        source[`${field.toString()}`] = { $ne: newValue };
      }
    }

    return source;
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
      case 'title':
        flag = true;        
        break;
      case 'filename':
        flag = true;        
        break;
      case 'status':
        flag = true;        
        break;
      case 'mip':
        flag = true;
        break;
    }

    if (!flag) {
      throw new Error(`Invalid filter field (${field})`);
    }
    return value;
  }

  async findOne(id: string): Promise<MIP> {
    return  await this.mipsDoc.findOne({ _id: id }).select(["-__v"]).exec();
  }

  create(mIPs: IMIPs): Promise<MIP> {
    return this.mipsDoc.create(mIPs);
  }

  insertMany(mips: MIP[] | any): Promise<MIPsDoc> {
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
