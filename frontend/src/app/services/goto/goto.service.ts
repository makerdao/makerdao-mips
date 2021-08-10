import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GotoService {
  constructor(private router: Router) {}

  private isMdUrlFile(urlFile:string):RegExpMatchArray{
    const regexMdFileUrl: RegExp = /(([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+)[A-Za-z0-9.-]+)\.md(?:#[\w]*)?/i;

    return urlFile.match(regexMdFileUrl);

  }

  private isAValidGithubMdUrl(githubUrl: string): RegExpMatchArray {
    const regexToExtractGithubParameters: RegExp = /^https:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<branch>[^\/]+)\/(?<address>.+\.md(?:#.*)*)$/i;

    return githubUrl.match(regexToExtractGithubParameters);
  }


  private isAValidRawMdUrl(rawUrl: string): RegExpMatchArray {
    const regexToExtractGithubParameters: RegExp = /^https:\/\/raw.githubusercontent.com\/(?<repo>[^\/]+)\/(?<user>[^\/]+)\/(?<branch>[^\/]+)\/(?<address>.+\.md(?:#.*)*)$/i;

    return rawUrl.match(regexToExtractGithubParameters);
  }


  url(url: string): void {
    const isMdFileUrl: RegExpMatchArray =this.isMdUrlFile(url)

    if (isMdFileUrl) {
      // A valid md file

      const routeMarkdown = this.getMdFromGithubUrl(url);

      if (routeMarkdown) {
        this.router.navigateByUrl('/mips/md-viewer?mdUrl=' + routeMarkdown);
      } else {
        //If it is a link pointing directly to a md file

        this.router.navigateByUrl('/mips/md-viewer?mdUrl=' + url);
      }

    } else {
      //Not a md file URL
      this.router.navigateByUrl('/');
    }
  }


  getMdFromGithubUrl(githubUrl: string): string | null {
    const isGitHubUrlMdFile: RegExpMatchArray = this.isAValidGithubMdUrl(
      githubUrl
    );

    if (isGitHubUrlMdFile) {
      //If it is a gitHub file

      const routeMarkdown =
        'https://raw.githubusercontent.com/' +
        [
          isGitHubUrlMdFile.groups.user,
          isGitHubUrlMdFile.groups.repo,
          isGitHubUrlMdFile.groups.branch,
          isGitHubUrlMdFile.groups.address,
        ].join('/');

      return routeMarkdown;
    }
    return null;
  }


  getGithubLinkFromMdRaw(rawUrl:string):string|null{
    const isRawrlMdUrl: RegExpMatchArray = this.isAValidRawMdUrl(
      rawUrl
    );

    if (isRawrlMdUrl) {
      //If it is a gitHub file

      const routeGithub =
        'https://github.com/' +
        [
          isRawrlMdUrl.groups.repo,
          isRawrlMdUrl.groups.user,
          "blob",
          isRawrlMdUrl.groups.branch,
          isRawrlMdUrl.groups.address,
        ].join('/');

      return routeGithub;
    }

    return null
  }

}
