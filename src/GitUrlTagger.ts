import { IAspect, Aspects, Tag } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export class GitUrlTagger implements IAspect {
  visit(construct: IConstruct): void {
    console.log('The node path: ', construct.node.path);
    
    Aspects.of(construct).add(new Tag('GitUrl', this.getGitUrl()))
    

   
  }
  getGitUrl(): string {
    return 'https://placeholder';
  }

}
