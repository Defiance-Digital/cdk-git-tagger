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
    new Tag(this.props?.tagName || 'GitUrl', this.getGitUrl()).visit(construct);
  }

  getGitUrl(): string {
    return 'https://placeholder';
  }
}
