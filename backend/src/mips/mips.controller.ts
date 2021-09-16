import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

import * as crypto from "crypto";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { PullRequestService } from "./services/pull-requests.service";

import { Env } from "@app/env";
import { Filters, PaginationQueryDto } from "./dto/query.dto";
import { Language } from "./entities/mips.entity";

@Controller("mips")
export class MIPsController {
  constructor(
    private mipsService: MIPsService,
    private parseMIPsService: ParseMIPsService,
    private pullRequestService: PullRequestService,
    private configService: ConfigService
  ) {}

  @Get("findall")
  @ApiQuery({
    name: "limit",
    description: "Limit per page, default value 10",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "page",
    description: "Page, default value equal to zero",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "order",
    description: `'title -mip', means: order property title ASC and mip DESC`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "select",
    description: `Select files to get output`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang files to get output`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiQuery({
    name: "search",
    description:
      'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (\\ ") that specifies a phrase',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "filter",
    description:
      "Filter field with various filter patterns. (contains, notcontains, equals, notequals)",
    required: false,
    type: "object",
    schema: {
      type: "object",
      example: {
        filter: {
          contains: [{ field: "status", value: "RFC" }],
          notcontains: [{ field: "status", value: "Accepted" }],
          equals: [{ field: "mip", value: -1 }],
          notequals: [{ field: "mip", value: -1 }],
        },
      },
    },
  })
  async findAll(
    @Query("limit") limit?: string,
    @Query("page") page?: string,
    @Query("order") order?: string,
    @Query("select") select?: string,
    @Query("lang") lang?: Language,
    @Query("search") search?: string,
    @Query("filter") filter?: Filters
  ) {
    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: +limit || 10,
        page: +page,
      };

      let allMips = await this.mipsService.findAll(
        paginationQueryDto,
        order,
        search,
        filter,
        select,
        lang
      );
      if (allMips.total === 0) {
        allMips = await this.mipsService.findAll(
          paginationQueryDto,
          order,
          search,
          filter,
          select,
          Language.English
        );
      }

      return allMips;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("findone")
  @ApiQuery({
    type: String,
    name: "mipName",
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang files to get output`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  async findOneByMipName(
    @Query("lang") lang?: Language,
    @Query("mipName") mipName?: string
  ) {
    let mip = await this.mipsService.findOneByMipName(mipName, lang);

    if (!mip) {
      mip = await this.mipsService.findOneByMipName(mipName, Language.English);

      if (!mip) {
        throw new NotFoundException(`MIPs with name ${mipName} not found`);
      }
    }

    let subproposals = [];

    if (!mip.proposal) {
      subproposals = await this.mipsService.findOneByProposal(mip.mipName);
    }

    try {
      const pullRequests = await this.pullRequestService.aggregate(
        mip.filename
      );
      return { mip, pullRequests, subproposals };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("smart-search")
  @ApiQuery({
    type: String,
    name: "field",
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang files to get output`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  async smartSearch(
    @Query("field") field: string,
    @Query("value") value: string,
    @Query("lang") lang?: Language
  ) {
    try {
      return await this.mipsService.smartSearch(field, value, lang);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("findone-by")
  @ApiQuery({
    type: String,
    name: "field",
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang files to get output`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  async findOneBy(
    @Query("field") field: string,
    @Query("value") value: string,
    @Query("lang") lang?: Language
  ) {
    let mip;

    switch (field) {
      case "filename":
        mip = await this.mipsService.findOneByFileName(value, lang);
        if (!mip) {
          mip = await this.mipsService.findOneByFileName(
            value,
            Language.English
          );
          if (!mip) {
            throw new NotFoundException(
              `MIPs with ${field} ${value} not found`
            );
          }
        }
        return mip;

      case "mipName":
      case "mipSubproposal":
        //Left temporaly to backward compatibilities only
        mip = await this.mipsService.getSummaryByMipName(value, lang);

        if (!mip) {
          mip = await this.mipsService.getSummaryByMipName(
            value,
            Language.English
          );
          if (!mip) {
            throw new NotFoundException(
              `MIPs with ${field} ${value} not found`
            );
          }
        }
        return mip;

      case "mipComponent":
        if (!value.match(/MIP\d+[ac]\d+/gi)) {
          throw new NotFoundException(
            `MIP component not in the standart format MIP10c5 `
          );
        }

        mip = await this.mipsService.getSummaryByMipComponent(value, lang);

        if (!mip || mip.components.length !== 1) {
          mip = await this.mipsService.getSummaryByMipComponent(
            value,
            Language.English
          );
          if (!mip || mip.components.length !== 1) {
            throw new NotFoundException(`MIP with ${field} ${value} not found`);
          }
        }
        return mip;

      default:
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Field ${field} not found`,
          },
          HttpStatus.BAD_REQUEST
        );
    }
  }

  @Post("callback")
  async callback(@Req() { headers, body }: any): Promise<boolean> {
    try {
      const secretToken = this.configService.get<string>(
        Env.WebhooksSecretToken
      );

      const hmac = crypto.createHmac("sha1", secretToken);
      const selfSignature = hmac.update(JSON.stringify(body)).digest("hex");
      const comparisonSignature = `sha1=${selfSignature}`; // shape in GitHub header

      const signature = headers["x-hub-signature"];

      if (!signature) {
        return false;
      }

      const source = Buffer.from(signature);
      const comparison = Buffer.from(comparisonSignature);

      if (!crypto.timingSafeEqual(source, comparison)) {
        return false;
      }

      this.parseMIPsService.loggerMessage("Webhooks works");

      return this.parseMIPsService.parse();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
