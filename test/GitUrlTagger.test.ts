import { Aspects, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { GitUrlTagger } from '../src/GitUrlTagger';

describe('Aspect adds tags as expected', () => {
  test('with defaults', () => {
    const stack = new Stack();
    new Topic(stack, 'MyTopic', {});

    Aspects.of(stack).add(new GitUrlTagger());

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'git@github.com:Defiance-Digital/cdk-git-tagger.git',
      }],
    });
  });

  test('with overridden tag name', () => {
    const stack = new Stack();
    new Topic(stack, 'MyTopic', {});

    Aspects.of(stack).add(new GitUrlTagger({ tagName: 'MyTagName' }));

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: 'git@github.com:Defiance-Digital/cdk-git-tagger.git',
      }],
    });
  });
});
