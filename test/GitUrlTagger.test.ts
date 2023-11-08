import * as fs from 'fs';
import * as path from 'path';
import { Aspects, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { GitUrlTagger, GitUrlTaggerProps } from '../src';

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

  test('normalizes by default', () => {
    const stack = setupTestStack({ tagName: 'MyTagName' }, 'git@github.com:Defiance-Digital/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);

    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: 'https://github.com/Defiance-Digital/cdk-git-tagger',
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
    const stack = setupTestStack({ normalizeUrl: false }, 'git@github.com:Defiance-Digital/cdk-git-tagger.git');

    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'git@github.com:Defiance-Digital/cdk-git-tagger.git',
      }],
    });
  });
});


describe('URLs are stored in files', function () {

  test('to create file', () => {
    const stack = setupTestStack({ normalizeUrl: false }, 'git@github.com:Defiance-Digital/cdk-git-tagger.git');
    Template.fromStack(stack);
    expect(fs.readFileSync('.git-url-tagger.json', 'utf8')).toEqual('{"url":"git@github.com:Defiance-Digital/cdk-git-tagger.git"}');
  });

  test('to read cached file', () => {
    const stack = setupTestStack({ normalizeUrl: false }, 'git@github.com:Defiance-Digital/cdk-git-tagger.git');
    fs.writeFileSync(path.join(process.cwd(), '.git-url-tagger.json'), '{ "url": "test" }');
    const assert = Template.fromStack(stack);
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: 'test',
      }],
    });
    expect(fs.readFileSync('.git-url-tagger.json', 'utf8')).toEqual('test');
  });
});