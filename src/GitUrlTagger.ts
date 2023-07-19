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
}

export class GitUrlTagger implements IAspect {

  constructor(private props?: GitUrlTaggerProps) {
  }

  visit(construct: IConstruct): void {
    new Tag(this.props?.tagName || 'GitUrl', this.retrieveGitUrl()).visit(construct);
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
}
