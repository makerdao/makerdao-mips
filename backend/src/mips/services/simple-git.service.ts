import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import simpleGit, {
  PullResult,
  Response,
  SimpleGit,
  SimpleGitOptions,
} from "simple-git";

import { Env } from "@app/env";

import { IGitFile } from "../interfaces/mips.interface";

@Injectable()
export class SimpleGitService {
  git: SimpleGit;
  private readonly logger = new Logger(SimpleGitService.name);

  constructor(private configService: ConfigService) {
    const options: SimpleGitOptions = {
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

    try {
      const info: string = await this.git.raw([
        "ls-files",
        "-s",
        folderPattern,
      ]);
      return info
        .split("\n")
        .filter((data) => data.length > 3 && !data.includes("placeholder.md"))
        .map((data) => {
          const newData = data.replace("\t", " ").split(" ");
          return {
            filename: newData[3].trim(),
            hash: newData[1].trim(),
          };
        });
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
