import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import simpleGit, {
  PullResult,
  Response,
  SimpleGit,
  SimpleGitOptions,
} from 'simple-git';

import { Env } from '@app/env';

import { GitFile } from '../interfaces/mips.interface';

@Injectable()
export class SimpleGitService {
  git: SimpleGit;

  constructor(private configService: ConfigService) {
    const options: SimpleGitOptions = {
      baseDir: `${process.cwd()}/${this.configService.get<string>(
        Env.FolderRepositoryName,
      )}`,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };

    this.git = simpleGit(options);
  }

  cloneRepository(): Response<string> {
    const localPath = `${process.cwd()}/${this.configService.get<string>(
      Env.FolderRepositoryName,
    )}`;
    return this.git.clone(
      this.configService.get<string>(Env.RepoPath),
      localPath,
    );
  }

  pull(remote = 'origin', branch = 'master'): Response<PullResult> {
    return this.git.pull(remote, branch);
  }

  async getFiles(): Promise<GitFile[]> {
    try {
      const info: string = await this.git.raw(['ls-files', '-s', 'MIP*']);
      return info.split('\n').map((data) => {
        const newData = data.replace('\t', ' ').split(' ');
        return {
          filePath: newData[3],
          fileHash: newData[1],
        };
      });
    } catch (error) {
      return error;
    }
  }
}
