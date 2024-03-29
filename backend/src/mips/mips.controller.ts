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
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

import * as crypto from "crypto";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { PullRequestService } from "./services/pull-requests.service";

import { Env } from "@app/env";
import { Filters, PaginationQueryDto } from "./dto/query.dto";
import { ErrorObjectModel, Language, Mips } from "./entities/mips.entity";
import { SimpleGitService } from "./services/simple-git.service";

@Controller("mips")
@ApiTags("mips")
export class MIPsController {
  constructor(
    private mipsService: MIPsService,
    private parseMIPsService: ParseMIPsService,
    private pullRequestService: PullRequestService,
    private simpleGitService: SimpleGitService,
    private configService: ConfigService
  ) { }

  @Get("findall")
  @ApiOperation({
    summary: "Find all mips",
    description: "This is return array of mips by the custom params defined (limite, page, order, select, lang, search, filter).",
  })
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
    description: `Fields the mips will be ordered by, i.e. 'title -mip', means: order property title ASC and mip DESC`,
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
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiQuery({
    name: "search",
    description:
      'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (") that specifies a phrase',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "filter",
    description:
      "Filter field with various filter patterns. (contains, notcontains, equals, notequals, inarray)",
    required: false,
    type: 'object',
    schema: {
      type: 'object',
      example: {
        filter: {
          contains: [{ field: "status", value: "RFC" }],
          notcontains: [{ field: "status", value: "Accepted" }],
          equals: [{ field: "mip", value: -1 }],
          notequals: [{ field: "mip", value: -1 }],
          inarray: [{ field: "mipName", value: ["MIP0", "MIP1"] }],
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: [Mips],
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given mip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
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

      return await this.mipsService.findAll(
        paginationQueryDto,
        order,
        search,
        filter,
        select,
        lang
      );
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
  @ApiOperation({
    summary: "Find one mip",
    description: "This is return a mip by name (mipName parameter)",
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the file to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiQuery({
    name: "mipName",
    description: `Mip name you want looking for`,
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    status: 200,
    type: Mips,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given mip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async findOneByMipName(
    @Query("mipName") mipName: string,
    @Query("lang") lang?: Language,
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
      subproposals = await this.mipsService.findByProposal(mip.mipName);
    }

    try {
      const pullRequests = await this.pullRequestService.aggregate(
        mip.filename
      );

      const languagesAvailables = await this.mipsService.getMipLanguagesAvailables(
        mipName
      );

      const metaVars = await this.simpleGitService.getMetaVars();

      return { mip, pullRequests, subproposals, languagesAvailables, metaVars };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("smart-search")
  @ApiOperation({
    summary: "Find array mips match with parameters",
    description:
      "This is return a array of mips. You can search by ```tags``` and ```status```",
  })
  @ApiQuery({
    type: String,
    name: "field",
    description: "Field the smart search is execute by. You can use tags or status",
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    description: "Value to execute the smart search",
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiCreatedResponse({
    type: [Mips],
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given mip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
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
  @ApiOperation({
    summary: "Find one mip that match with parameters ",
    description: `Search by different types of field example  (field: filename , value:mip1 ) return mip
  `,
  })
  @ApiQuery({
    type: String,
    name: "field",
    description: 'Field the search is execute by.',
    required: true,
  })
  @ApiQuery({
    type: String,
    name: "value",
    description: 'Value to execute the search',
    required: true,
  })
  @ApiQuery({
    name: "lang",
    description: `Lang selected for the files to return. If file language not found, it default to english version`,
    enum: Language,
    required: false, // If you view this comment change to true value
  })
  @ApiCreatedResponse({
    type: Mips,
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given mip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
  async findOneBy(
    @Query("field") field: string,
    @Query("value") value: string,
    @Query("lang") lang?: Language
  ) {
    let mip;

    switch (field) {
      case "filename":
        mip = await this.mipsService.findOneByFileName(value, lang);
        if (!mip && (!lang || lang !== Language.English)) {
          mip = await this.mipsService.findOneByFileName(
            value,
            Language.English
          );
          if (!mip) {
            throw new NotFoundException(
              `MIP with ${field} ${value} not found`
            );
          }
        }
        return mip;

      case "mipName":
      case "mipSubproposal":
        //Left temporaly to backward compatibilities only
        mip = await this.mipsService.getSummaryByMipName(value, lang);

        if (!mip && (!lang || lang !== Language.English)) {
          mip = await this.mipsService.getSummaryByMipName(
            value,
            Language.English
          );
          if (!mip) {
            throw new NotFoundException(
              `MIP with ${field} ${value} not found`
            );
          }
        }
        return mip;

      case "mipComponent":
        if (!value.match(/MIP\d+[ac]\d+/gi)) {
          throw new NotFoundException(
            `MIP component not in the standard format, i.e. MIP10c5`
          );
        }

        mip = await this.mipsService.getSummaryByMipComponent(value, lang);

        if (!mip || mip.components.length !== 1
          && (!lang || lang !== Language.English)) {
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
  @ApiOperation({
    summary: "Call back to check the hash ",
    description: "This call back to check that the hash is correct signed",
  })
  @ApiQuery({
    name: "headers",
    description: 'Headers to check the hash. x-hub-signature is needed',
    type: 'object',
    required: true,
  })
  @ApiQuery({
    name: "body",
    description: 'Callback body to check the hash',
    type: 'object',
    required: true,
  })
  @ApiCreatedResponse({
    type: Boolean,
    status: 200,
    description: "successful operation",
  })
  @ApiResponse({
    status: 400,
    type: ErrorObjectModel,
    description:
      "Semantic error, for instance when a given mip is not found",
  })
  @ApiResponse({ status: 404, description: "Bad request" })
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
      this.parseMIPsService.loggerMessage("Webhooks ERROR");

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
