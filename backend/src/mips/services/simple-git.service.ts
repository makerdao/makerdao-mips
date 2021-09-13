import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import simpleGit, { PullResult, Response, SimpleGit } from "simple-git";

import { Env } from "@app/env";

import { IGitFile } from "../interfaces/mips.interface";
import { Language } from "../entities/mips.entity";

@Injectable()
export class SimpleGitService {
  git: SimpleGit;
  private readonly logger = new Logger(SimpleGitService.name);

  constructor(private configService: ConfigService) {
    const options: any = {
      baseDir: `${process.cwd()}/${this.configService.get<string>(
        Env.FolderRepositoryName
      )}`,
      binary: "git",
      maxConcurrentProcesses: 6,
    };

    this.git = simpleGit(options);
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

  pull(remote = "origin", branch = "master"): Response<PullResult> {
    return this.git.pull(remote, branch);
  }

  async getFiles(): Promise<IGitFile[]> {
    const folderPattern = this.configService.get<string>(Env.FolderPattern);

    const i18nPattern = "I18N";

    try {
      const englishVersion: string = await this.git.raw([
        "ls-files",
        "-s",
        folderPattern,
      ]);

      const internalization: string = await this.git.raw([
        "ls-files",
        "-s",
        i18nPattern,
      ]);

      const info: string = internalization + "\n" + englishVersion;

      const files = info.split("\n");

      const filesFiltered = files.filter(
        (data) =>
          data.length > 3 &&
          !data.includes("placeholder.md") &&
          !data.includes("Template") &&
          data.includes(".md")
      );

      const filesFormated = filesFiltered.map((data) => {
        const newData = data.replace("\t", " ").split(" ");

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

      return filesFormated;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  getLanguage(filename: string): Language {
    const defaultLang = Language.English;

    const filenameMatch = filename.match(/I18N\/(?<language>\w\w)\//i);

    if (filenameMatch) {
      const languageCode = filenameMatch.groups.language.toLowerCase();

      if (Object.values(Language).includes(languageCode as Language)) {
        return languageCode as Language;
      }
    }

    return defaultLang;
  }
}
