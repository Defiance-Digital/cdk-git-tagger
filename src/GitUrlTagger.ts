import * as fs from 'fs';
import * as path from 'path';
import { IAspect, Tag } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export interface GitUrlTaggerProps {
  /**
     * The Tag key/name to use
     *
     * @default 'GitUrl'
     */
  readonly tagName?: string;

  /**
     * A flag on whether to try to normalize the URL found in the git config
     * If enabled, it will turn ssh urls into https urls.
     *
     * @default true
     */
  readonly normalizeUrl?: boolean;
}

export class GitUrlTagger implements IAspect {
  private gitUrl: string;
  private readonly _gitUrlTaggerFileName = '.git-url-tagger.json';

  constructor(private props?: GitUrlTaggerProps) {
    let gitUrl = this.pullGitUrlFromFile();
    if (!gitUrl) {
      gitUrl = this.retrieveGitUrl();
      this.putGitUrlInFile(gitUrl);
      const shouldNormalize = props?.normalizeUrl ?? true;
      this.gitUrl = shouldNormalize ? this.normalizeUrl(gitUrl) : gitUrl;
    } else {
      this.gitUrl = gitUrl;
    }
  }

  visit(construct: IConstruct): void {
    new Tag(this.props?.tagName || 'GitUrl', this.gitUrl).visit(construct);
  }


  findGitDirectory(): string {
    let currentDir = process.cwd(); // Get the current directory

    while (currentDir !== '/') {
      const gitDir = path.join(currentDir, '.git');

      if (fs.existsSync(gitDir)) {
        return gitDir;
      }

      currentDir = path.dirname(currentDir); // Move up to the parent directory
    }

    return ''; // .git directory not found
  }

  private findRootDirectory(): string {
    let currentDir = process.cwd(); // Get the current directory

    while (currentDir !== '/') {
      const packageJson = path.join(currentDir, 'package.json');


      if (fs.existsSync(packageJson)) {

        return currentDir;
      }

      currentDir = path.dirname(currentDir); // Move up to the parent directory
    }
    return process.cwd(); // root directory not found
  }


  private pullGitUrlFromFile() {
    const rootpath = this.findRootDirectory();
    const gitUrlTaggerConfig = path.join(rootpath, this._gitUrlTaggerFileName);
    if (fs.existsSync(gitUrlTaggerConfig)) {
      const data = fs.readFileSync(gitUrlTaggerConfig, 'utf8');
      const config = JSON.parse(data);
      return config.url;
    }
  }

  putGitUrlInFile(gitUrl: string) {
    let rootpath = this.findRootDirectory();

    const gitUrlTaggerConfig = path.join(rootpath, this._gitUrlTaggerFileName);
    fs.writeFileSync(gitUrlTaggerConfig, JSON.stringify({ url: gitUrl }));
  }


  retrieveGitUrl(): string {
    const gitpath = this.findGitDirectory();
    if (!gitpath) {
      throw new Error('No .git folder found');
    }
    const data = fs.readFileSync(path.join(gitpath, 'config'), 'utf8');
    for (const line of data.split('\n')) {
      if (line.includes('url = ')) {
        return line.trim().split(' ')[2];
      }
    }
    return 'No Code Repo Found';
  }

  private normalizeUrl(gitUrl: string) {
    const regexSSH = /^git@([A-Za-z0-9-]+\.[A-Za-z0-9-]+):([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)\.git$/;
    let regexMatches = regexSSH.exec(gitUrl);
    if (!regexMatches) {
      return gitUrl;
    }
    const [_all, site, org, repo] = regexMatches!;
    if (org && repo) {
      return `https://${site}/${org}/${repo}`;
    }
    return gitUrl;
  }
}
