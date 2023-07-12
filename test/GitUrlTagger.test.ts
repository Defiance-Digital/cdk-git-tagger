import { Aspects, Stack } from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { GitUrlTagger } from '../src/GitUrlTagger';

const regexSSH = /^git@[A-Za-z0-9-]+\.[A-Za-z0-9-]+:[A-Za-z0-9-]+\/[A-Za-z0-9-]+\.git$/;
const regexHTTPS = /^https:\/\/[A-Za-z0-9-]+\.[A-Za-z0-9-]+\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+\.git$/;

describe('Aspect adds tags as expected', () => {
  test('with defaults', () => {
    const stack = new Stack();
    new Topic(stack, 'MyTopic', {});

    Aspects.of(stack).add(new GitUrlTagger());

    const assert = Template.fromStack(stack);
    const urlCapture = new Capture();
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'GitUrl',
        Value: urlCapture, // git@github.com:Defiance-Digital/cdk-git-tagger.git
      }],
    });

    const matchesSSH = regexSSH.test(urlCapture.asString());
    const matchesHTTPS = regexHTTPS.test(urlCapture.asString());
    console.log('HTTPS: ' + matchesHTTPS);
    console.log('SSH: ' + matchesSSH);
    console.log(urlCapture.asString());
    expect(matchesSSH || matchesHTTPS).toBeTruthy();
  });


  test('with overridden tag name', () => {
    const stack = new Stack();
    new Topic(stack, 'MyTopic', {});

    Aspects.of(stack).add(new GitUrlTagger({ tagName: 'MyTagName' }));

    const assert = Template.fromStack(stack);
    const urlCapture = new Capture();
    assert.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [{
        Key: 'MyTagName',
        Value: urlCapture, // git@github.com:Defiance-Digital/cdk-git-tagger.git
      }],
    });

    const matchesSSH = regexSSH.test(urlCapture.asString());
    const matchesHTTPS = regexHTTPS.test(urlCapture.asString());
    console.log('HTTPS: ' + matchesHTTPS);
    console.log('SSH: ' + matchesSSH);
    console.log(urlCapture.asString());
    expect(matchesSSH || matchesHTTPS).toBeTruthy();
  });

});
