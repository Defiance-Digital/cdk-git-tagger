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
   * @default false
   */
  readonly normalizeUrl?: boolean;
}

export class GitUrlTagger implements IAspect {
  private gitUrl: string;

  constructor(private props?: GitUrlTaggerProps) {
    const gitUrl = this.retrieveGitUrl();
    this.gitUrl = props?.normalizeUrl ? this.normalizeUrl(gitUrl) : gitUrl;

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
    const [_all, site, org, repo] = regexSSH.exec(gitUrl)!;
    if (org && repo) {
      return `https://${site}/${org}/${repo}`;
    }
    return gitUrl;
  }
}
