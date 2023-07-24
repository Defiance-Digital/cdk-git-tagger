import { Aspects, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { GitUrlTagger, GitUrlTaggerProps } from '../src/GitUrlTagger';

// eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
const mock = require('mock-fs');

function setupTestStack(props?: Partial<GitUrlTaggerProps>, url: string = 'https://something') {
  mock({
    '.git/config': 'url = ' + url,
  });

  const stack = new Stack();
  new Topic(stack, 'MyTopic', {});

  Aspects.of(stack).add(new GitUrlTagger(props));
  return stack;
}
afterEach(() => {
  mock.restore();
});

describe('Aspect adds tags as expected', () => {
  test('with defaults', () => {
    const stack = setupTestStack();

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'https://something',
      }],
    });
  });


  test('with overridden tag name', () => {
    const stack = setupTestStack({ tagName: 'MyTagName' });

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: 'https://something',
      }],
    });
  });
});

describe('URLs are normalized', function () {

  test('to https when asked', () => {
    const stack = setupTestStack({ normalizeUrl: true }, 'git@github.com:Defiance-Digital/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'https://github.com/Defiance-Digital/cdk-git-tagger',
      }],
    });
  });

  test('doesn\'t change when already https', () => {
    const stack = setupTestStack({ normalizeUrl: false }, 'https://github.com/Defiance-Digital/cdk-git-tagger');

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'https://github.com/Defiance-Digital/cdk-git-tagger',
      }],
    });
  });
});
