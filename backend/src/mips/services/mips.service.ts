import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import markdownToTxt from 'markdown-to-txt';
import { isValidObjectId, Model } from "mongoose";
import { Filters, PaginationQueryDto } from "../dto/query.dto";
import { Language, MIP, MIPsDoc } from "../entities/mips.entity";
import { IGitFile, IMIPs } from "../interfaces/mips.interface";
import { ParseQueryService } from "./parse-query.service";

@Injectable()
export class MIPsService {
  constructor(
    @InjectModel(MIP.name)
    private readonly mipsDoc: Model<MIPsDoc>,
    private readonly parseQueryService: ParseQueryService
  ) { }

  async groupProposal(): Promise<any> {
    return await this.mipsDoc.aggregate([
      { $match: { proposal: { $ne: "" } } },
      { $group: { _id: "$proposal" } },
    ]);
  }


  cleanSearchField(search: string): string {
    const searchCleaned = (search || "").replace(/[\u202F\u00A0]/gmi, " ").trim();
    return searchCleaned;
  }
  async searchAll({
    paginationQuery,
    order,
    search,
    filter,
    select,
    language,
  }) {

    //  const value=this.cleanSearchField(search);
    const buildFilter = await this.buildFilter(search, filter, language);

    const { limit, page } = paginationQuery;

    const selectedLanguageItems = await this.mipsDoc
      .find(buildFilter)
      .select(select)
      .sort(order)
      .skip(page * limit)
      .limit(limit)
      .lean()
      .exec();

    if (language === Language.English) return selectedLanguageItems;

    const defaultLanguageItems = await this.searchAll({
      paginationQuery,
      order,
      search,
      filter,
      select,
      language: Language.English,
    });

    const errorProofItems = defaultLanguageItems.map((item) => {
      const existingItem = selectedLanguageItems.find(
        (selectedItem) => selectedItem.mipName === item.mipName
      );
      return existingItem || item;
    });
    return errorProofItems;
  }



  async findAll(
    paginationQuery?: PaginationQueryDto,
    order?: string,
    search?: string,
    filter?: Filters,
    select?: string,
    language?: Language
  ): Promise<any> {

    const cleanedSearch = this.cleanSearchField(search);

    const buildFilter = await this.buildFilter(
      cleanedSearch,
      filter,
      Language.English
    );

    // console.log({
    //   search,
    //   cleanedSearch,
    //   buildFilter
    // })
    const total = await this.mipsDoc.countDocuments(buildFilter).exec();

    if (select) {
      const items = await this.searchAll({
        paginationQuery,
        order,
        search: cleanedSearch,
        filter,
        select,
        language,
      });

      return { items, total };
    }

    const customSelect = [
      "-__v",
      "-file",
      "-sections",
      "-sectionsRaw",
      "-mipName_plain",
      "-filename_plain",
      "-proposal_plain",
      "-title_plain",
      "-sectionsRaw_plain",
    ];

    const items = await this.searchAll({
      paginationQuery,
      order,
      search: cleanedSearch,
      filter,
      select: customSelect,
      language,
    });

    return { items, total };
  }

  async findAllAfterParse(
    paginationQuery?: PaginationQueryDto,
    order?: string,
    search?: string,
    filter?: any,
    select?: string,
    language?: Language
  ): Promise<any> {
    return this.findAll(
      paginationQuery,
      order,
      search,
      filter,
      select,
      language
    );
  }

  // Function to build filter*
  async buildFilter(
    searchText: string,
    filter?: Filters,
    language?: Language
  ): Promise<any> {
    let source = {};
    if (language) {
      source = { language };
    } else {
      source = { language: Language.English };
    }

    if (filter?.contains && Array.isArray(filter?.contains)) {
      for (const element of filter.contains) {
        const newValue = this.validField(element.field, element.value.toString());
        source[`${this.searcheableField(element.field)}`] = {
          $regex: new RegExp(`${newValue}`),
          $options: "i",
        };
      }
    }

    if (filter?.equals && Array.isArray(filter?.equals)) {
      for (let i = 0; i < filter?.equals.length; i++) {
        const newValue = this.validField(filter?.equals[i].field, filter?.equals[i].value);
        source[`${this.searcheableField(filter?.equals[i].field)}`] = newValue;
      }
    }

    if (filter?.inarray && Array.isArray(filter?.inarray)) {
      for (const element of filter.inarray) {
        if (Array.isArray(element.value)) {
          element.value.forEach(value => {
            const newValue = this.validField(element.field, value);
            source[`${this.searcheableField(element.field)}`] = { $in: newValue };
          });
        }
      }
    }

    if (filter?.notcontains && Array.isArray(filter?.notcontains)) {
      for (const element of filter.notcontains) {
        const newValue = this.validField(element.field, element.value);
        source[`${this.searcheableField(element.field)}`] = {
          $not: { $regex: new RegExp(`${newValue}`), $options: "i" },
        };
      }
    }

    if (filter?.notequals && Array.isArray(filter?.notequals)) {
      for (const element of filter.notequals) {
        const newValue = this.validField(element.field, element.value);
        source[`${this.searcheableField(element.field)}`] = { $ne: newValue };
      }
    }

    if (searchText) {
      if (searchText.startsWith("$")) {
        const ast = await this.parseQueryService.parse(searchText);
        const query = this.buildSmartMongoDBQuery(ast);
        source = {
          $and: [
            {
              ...source,
              ...query,
            },
          ],
        };
      } else {
        const cleanSearchText = searchText.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        source["sectionsRaw_plain"] = { '$regex': new RegExp(`${cleanSearchText}`), '$options': 'i' };
      }
    }
    return source;
  }

  errorProofCleanArrays(testArray: any[], defaultArray: any[]): any[] {
    const errorProofItems = defaultArray.map((item) => {
      const existingItem = testArray.find(
        (selectedItem) => selectedItem._id === item._id
      );
      return existingItem || item;
    });

    return errorProofItems;
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
      case "title":
        flag = true;
        break;
      case "sectionsRaw":
        flag = true;
        break;
    }

    if (!flag) {
      throw new Error(`Invalid filter field (${field})`);
    }

    return field === "title" ? this.escapeRegExp(value) : value;
  }

  addSearcheableFields(item): any {
    for (const key in item) {
      const value = item[key];

      if (value) {
        switch (key) {
          case "mipName":
          case "filename":
          case "proposal":
          case "title":
            item[`${key}_plain`] = markdownToTxt(value);
            break;
          case "sectionsRaw":
            item['sectionsRaw_plain'] = [];
            value.forEach(element => {
              item['sectionsRaw_plain'].push(markdownToTxt(element));
            });
        }
      }
    }

    return item;
  }

  searcheableField(field: string): any {
    switch (field) {
      case "mipName":
      case "filename":
      case "proposal":
      case "title":
      case "sectionsRaw":
        return `${field}_plain`;
      default:
        return field;
    }
  }

  async findOneByMipName(mipName: string, language: Language): Promise<MIP> {
    if (!language) {
      language = Language.English;
    }

    return await this.mipsDoc
      .findOne({ mipName_plain: mipName, language })
      .select([
        "-__v",
        "-file",
        "-mipName_plain",
        "-filename_plain",
        "-proposal_plain",
        "-title_plain",
        "-sectionsRaw_plain",
      ])
      .exec();
  }

  async smartSearch(
    field: string,
    value: string,
    language: Language
  ): Promise<MIP[]> {
    language = Language.English;

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
              language: language,
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
              language: language,
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

  async findOneByFileName(filename: string, language: Language): Promise<MIP> {
    if (!language) {
      language = Language.English;
    }

    const filter = {
      filename_plain: {
        $regex: new RegExp(filename),
        $options: "i",
      },
      language,
    };

    return await this.mipsDoc.findOne(filter).select([
      "-__v",
      "-file",
      "-mipName_plain",
      "-filename_plain",
      "-proposal_plain",
      "-title_plain",
      "-sectionsRaw_plain",
    ]).exec();
  }

  async getSummaryByMipName(mipName: string, language: Language): Promise<MIP> {
    if (!language) {
      language = Language.English;
    }

    return await this.mipsDoc
      .findOne({ mipName_plain: mipName, language })
      .select(["sentenceSummary", "paragraphSummary", "title", "mipName"])
      .exec();
  }

  async getSummaryByMipComponent(
    mipComponent: string,
    language: Language
  ): Promise<MIP> {
    if (!language) {
      language = Language.English;
    }
    const mipName = mipComponent.match(/MIP\d+/gi)[0];

    return await this.mipsDoc
      .findOne({ mipName_plain: mipName, language })
      .select({
        sentenceSummary: 1,
        paragraphSummary: 1,
        title: 1,
        mipName: 1,
        components: { $elemMatch: { cName: mipComponent } },
      })
      .exec();
  }

  async findOneByProposal(
    proposal: string,
    language?: Language
  ): Promise<MIP[]> {
    if (!language) {
      language = Language.English;
    }

    return await this.mipsDoc
      .find({ proposal_plain: proposal, language })
      .select(["title", "mipName"])
      .sort("mip subproposal")
      .exec();
  }

  create(mIPs: IMIPs): Promise<MIP> {
    return this.mipsDoc.create(
      this.addSearcheableFields(mIPs),
    );
  }

  insertMany(mips: MIP[] | any): Promise<any> {
    const mipsUpdated = mips.map(element => {
      return this.addSearcheableFields(element);
    });
    return this.mipsDoc.insertMany(mipsUpdated);
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

  async dropDatabase(): Promise<void> {
    return await this.mipsDoc.db.dropDatabase();
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
        { mipName: { $in: mips } },
        { $set: { mipFather: true } },
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

  async getMipLanguagesAvailables(mipName: string): Promise<any> {
    return await this.mipsDoc.find({ mipName }, "mipName language").exec();
  }

  escapeRegExp(input: string): string {
    return input.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }
}
