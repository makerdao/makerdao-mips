import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private router: Router) {}

  public mdViewerRoute = 'mips/md-viewer?mdUrl=';

  isAValidUrl(url: string): RegExpMatchArray {
    const regexUrl: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

    return url?.match(regexUrl);
  }

  isMdUrlFile(urlFile: string): RegExpMatchArray {
    const regexMdFileUrl: RegExp = /(([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+)[A-Za-z0-9.-]+)\.md(?:#[\w]*)?/i;

    return urlFile?.match(regexMdFileUrl);
  }

  isAValidGithubMdUrl(githubUrl: string): RegExpMatchArray {
    const regexToExtractGithubParameters: RegExp = /^https:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<branch>[^\/]+)\/(?<address>.+\.md(?:#.*)*)$/i;

    return githubUrl?.match(regexToExtractGithubParameters);
  }

  isAValidRawMdUrl(rawUrl: string): RegExpMatchArray {
    const regexToExtractGithubParameters: RegExp = /^https:\/\/raw.githubusercontent.com\/(?<repo>[^\/]+)\/(?<user>[^\/]+)\/(?<branch>[^\/]+)\/(?<address>.+\.md(?:#.*)*)$/i;

    return rawUrl?.match(regexToExtractGithubParameters);
  }

  goToUrl(url: string, fileAddress: string = ''): void {
    if (this.isAValidUrl(url)) {
      // If it is a valid Link

      const isMdFileUrl: RegExpMatchArray = this.isMdUrlFile(url);

      if (isMdFileUrl) {
        // A valid md file

        const routeMarkdown = this.getMdFromGithubUrl(url);

        if (routeMarkdown) {
          this.router.navigateByUrl(this.mdViewerRoute + routeMarkdown);
        } else {
          //If it is a link pointing directly to a md file

          this.router.navigateByUrl(this.mdViewerRoute + url);
        }
      } else {
        //Not a md file URL

        const hostUrl = location.origin;

        if (url.includes(hostUrl)) {
          //Internal Link

          // const newUrl = url.replace(hostUrl, '');
          // this.router.navigateByUrl(newUrl);
          // SPA Behavior pending for appoval of client

          location.href = url;
        } else {
          // External Link
          location.href = url;
        }
      }
    } else {
      // If is not a valid link ie relative link

      if (url.includes('.md')) {
        //Is not a valid link. instead it is a Relative link

        const baseUrl = this.getBaseUrl();
        if (baseUrl) {
          this.router.navigateByUrl(
            this.mdViewerRoute + this.getMdFromGithubUrl(baseUrl + '/' + url)
          );
        }
      } else if (url.startsWith('#')) {
        // Local links inside the same file

        this.router.navigateByUrl(fileAddress + url);
      }
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

  getGithubLinkFromMdRaw(rawUrl: string): string | null {
    const isRawrlMdUrl: RegExpMatchArray = this.isAValidRawMdUrl(rawUrl);

    if (isRawrlMdUrl) {
      //If it is a gitHub file

      const routeGithub =
        'https://github.com/' +
        [
          isRawrlMdUrl.groups.repo,
          isRawrlMdUrl.groups.user,
          'blob',
          isRawrlMdUrl.groups.branch,
          isRawrlMdUrl.groups.address,
        ].join('/');

      return routeGithub;
    }

    return null;
  }

  transformLinkForMd(url: string): string {
    const isValidMd = this.getMdFromGithubUrl(url);
    if (isValidMd) {
      return this.mdViewerRoute + isValidMd;
    } else if (this.isMdUrlFile(url)) {
      return this.mdViewerRoute + url;
    }
    return url;
  }

  getBaseUrl(): string {
    const href = location.href;

    const isMipAddress = href.match(
      /\/mips\/details\/(?<mipName>MIP\d+)[\w\-\.#]*$/i
    );
    if (isMipAddress) {
      const mipName = isMipAddress.groups.mipName;

      return (
        'https://github.com/makerdao/mips/blob/master/' + mipName.toUpperCase()
      );
    }
    return '';
  }

  processLink(link: string, fileAddress: string = ''): string {
  
    let href = '';
    if (this.isAValidUrl(link)) {
      //Valid Url link (.md or not)

      if (this.isMdUrlFile(link)) {
        //Valid Url link md
        href = this.mdViewerRoute + this.getMdFromGithubUrl(link);
      } else {
        //Valid URL not md
        href = link;
      }
    } else if (link.includes('.md')) {
      //Is not a valid link. instead it is a Relative link

      const baseUrl = this.getBaseUrl();
     
      if (baseUrl) {
        href =
          this.mdViewerRoute + this.getMdFromGithubUrl(baseUrl + '/' + link);
      } 
    } else if (link.startsWith('#')) {
      // Local links inside the same file

      href = fileAddress + href;
    }
    // If there is not valid link nor containing '.md'
    //href="" and the link should NOT be visible

    return href;
  }
}
