# CDK Aspect Git Tagger

This is a CDK Aspect that will tag your CDK Stacks with the current git repo location for easier identification of
deployed stacks.

### How to install

```shell
npm install @defiance-digital/cdk-git-tagger
```

or

```shell
yarn add @defiance-digital/cdk-git-tagger
```

### How to use

```typescript
import { GitUrlTagger } from '@defiance-digital/cdk-git-tagger';
import { App, Aspects, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class MyStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);
        // define resources here...
        new Topic(this, 'MyTopic');
    }
}

const app = new App();

new MyStack(app, 'cdk-aspect-git-tagger-tester-dev');
Aspects.of(app).add(new GitUrlTagger());
app.synth();
```

### Example Output

```json
{
  "Resources": {
    "MyTopic86869434": {
      "Type": "AWS::SNS::Topic",
      "Properties": {
        "Tags": [
          {
            "Key": "GitUrl",
            "Value": "https://github.com/defiance-digital/cdk-aspect-git-tagger-test.git"
          }
        ]
      }
    }
  }
}
```

