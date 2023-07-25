import { awscdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Jayson Rawlins',
  authorAddress: 'jayson.rawlins@defiance.ai',
  cdkVersion: '2.30.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: '@defiance-digital/cdk-git-tagger',
  npmAccess: NpmAccess.PUBLIC,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/Defiance-Digital/cdk-git-tagger.git',
  githubOptions: {
    mergify: false,
    pullRequestLint: true,
  },
  depsUpgrade: false,
  devDeps: ['@types/mock-fs', 'mock-fs'],
});

project.synth();
