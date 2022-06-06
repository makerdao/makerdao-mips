import { readFile } from "fs/promises";

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import simpleGit, { PullResult, Response, SimpleGit } from "simple-git";

import { Env } from "@app/env";

import { IGitFile } from "../interfaces/mips.interface";
import { Language } from "../entities/mips.entity";
import { Meta, MetaDocument } from "../entities/meta.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SimpleGitService {
  git: SimpleGit;
  private readonly logger = new Logger(SimpleGitService.name);
  baseDir: string;

  constructor(
    @InjectModel(Meta.name)
    private readonly metaDocument: Model<MetaDocument>,
    private configService: ConfigService
  ) {
    const options: any = {
      baseDir: `${process.cwd()}/${this.configService.get<string>(
        Env.FolderRepositoryName
      )}`,
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    this.git = simpleGit(options);

    this.baseDir = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName
    )}`;
  }

  cloneRepository(): Response<string> {
    const localPath = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName
    )}`;
    return this.git.clone(
      this.configService.get<string>(Env.RepoPath),
      localPath
    );
  }

  async pull(remote = "origin", branch = "master"): Promise<PullResult> {
    try {
      return await this.git.pull(remote, branch);
    } catch (error) {
      this.logger.error({ error, text: 'Error autoresolved by hard reset origin/master strategy' })

      await this.git.fetch(['--all']);
      await this.git.reset(["--hard", "origin/master"]);
      return this.git.pull(remote, branch);
    }
  }

  async getFiles(): Promise<IGitFile[]> {
    const folderPattern = this.configService.get<string>(Env.FolderPattern);

    const patternI18N = "I18N";

    try {
      const englishFiles: string = await this.git.raw([
        "ls-files",
        "-s",
        folderPattern,
      ]);

      this.logger.error('Successfully fetched files from git');

      const internationalsFiles: string = await this.git.raw([
        "ls-files",
        "-s",
        patternI18N,
      ]);

      this.logger.error('Successfully fetched international files from git');

      const info = englishFiles + "\n" + internationalsFiles;

      return info
        .split("\n")
        .filter(
          (data) =>
            data.length > 3 &&
            !data.includes("placeholder.md") &&
            !data.includes("Template") &&
            data.includes(".md")
        )
        .map((data) => {
          const newData = data.split(/[\t ]/gmi);

          if (newData.length > 4) {
            let filename = newData[3];

            for (let i = 4; i < newData.length; i++) {
              filename = `${filename} ${newData[i]}`;
            }

            return {
              filename: filename,
              hash: newData[1].trim(),
              language: this.getLanguage(filename),
            };
          }

          return {
            filename: newData[3].trim(),
            hash: newData[1].trim(),
            language: this.getLanguage(newData[3].trim()),
          };
        });
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  getLanguage(filename: string): Language {
    const languageMatch = filename.match(/I18N\/(?<language>\w\w)\//i);

    if (languageMatch) {
      const languageString = languageMatch.groups.language.toLowerCase();

      if (Object.values(Language).includes(languageString as Language)) {
        return languageString as Language;
      }
    }

    return Language.English;
  }

  async saveMetaVars() {
    const baseVars = "meta/vars.yaml";

    const varsI18NPattern = "I18N/*/meta/vars.yaml";

    const varsI18N: string = await this.git.raw([
      "ls-files",
      "-s",
      varsI18NPattern,
    ]);

    const languagesFiles = varsI18N.match(/I18N\/\w\w\/meta\/vars\.yaml/gi);

    const translationsFiles = languagesFiles
      ? [...languagesFiles, baseVars]
      : [baseVars];

    let translationContent = []
    try {
      translationContent = await Promise.all(
        translationsFiles.map((item) =>
          readFile(this.baseDir + "/" + item, "utf-8")
        )
      );

    } catch (error) {
      console.log({ error })
    }

    const languagesArray = translationsFiles.map((item) => {
      const match = item.match(
        /I18N\/(?<languageCode>\w\w)\/meta\/vars\.yaml/i
      );

      return match ? match.groups.languageCode.toLowerCase() : Language.English;
    });

    const translationMeta = translationContent.map((item, index) => ({
      language: languagesArray[index],
      translations: item,
    }));

    await this.metaDocument.deleteMany({});
    await this.metaDocument.insertMany(translationMeta);
  }

  async getMetaVars() {
    return this.metaDocument.find({});
  }
}
