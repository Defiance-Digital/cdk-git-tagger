import { Stack, Aspects } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { GitUrlTagger } from '../src/GitUrlTagger';
describe('Aspect adds tags as expected', ()=> {
  test('as expected', ()=>{
    const stack = new Stack();
    new Topic(stack, 'MyTopic', {});

    // Tags.of(stack).add('GitUrl', 'https://placeholder');

    Aspects.of(stack).add(new GitUrlTagger());

    const assert = Template.fromStack(stack);

    expect(assert.toJSON()).toMatchSnapshot();
  });
});