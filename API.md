# CDK Aspect Git Tagger
This is a CDK Aspect that will tag your CDK Stacks with the current git repo location for easier identification of deployed stacks.
# API Reference <a name="API Reference" id="api-reference"></a>


## Structs <a name="Structs" id="Structs"></a>

### GitUrlTaggerProps <a name="GitUrlTaggerProps" id="@defiance-digital/cdk-git-tagger.GitUrlTaggerProps"></a>

#### Initializer <a name="Initializer" id="@defiance-digital/cdk-git-tagger.GitUrlTaggerProps.Initializer"></a>

```typescript
import { GitUrlTaggerProps } from '@defiance-digital/cdk-git-tagger'

const gitUrlTaggerProps: GitUrlTaggerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTaggerProps.property.tagName">tagName</a></code> | <code>string</code> | The Tag key/name to use. |

---

##### `tagName`<sup>Optional</sup> <a name="tagName" id="@defiance-digital/cdk-git-tagger.GitUrlTaggerProps.property.tagName"></a>

```typescript
public readonly tagName: string;
```

- *Type:* string
- *Default:* 'GitUrl'

The Tag key/name to use.

---

## Classes <a name="Classes" id="Classes"></a>

### GitUrlTagger <a name="GitUrlTagger" id="@defiance-digital/cdk-git-tagger.GitUrlTagger"></a>

- *Implements:* aws-cdk-lib.IAspect

#### Initializers <a name="Initializers" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.Initializer"></a>

```typescript
import { GitUrlTagger } from '@defiance-digital/cdk-git-tagger'

new GitUrlTagger(props?: GitUrlTaggerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTagger.Initializer.parameter.props">props</a></code> | <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTaggerProps">GitUrlTaggerProps</a></code> | *No description.* |

---

##### `props`<sup>Optional</sup> <a name="props" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.Initializer.parameter.props"></a>

- *Type:* <a href="#@defiance-digital/cdk-git-tagger.GitUrlTaggerProps">GitUrlTaggerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTagger.findGitDirectory">findGitDirectory</a></code> | *No description.* |
| <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTagger.retrieveGitUrl">retrieveGitUrl</a></code> | *No description.* |
| <code><a href="#@defiance-digital/cdk-git-tagger.GitUrlTagger.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `findGitDirectory` <a name="findGitDirectory" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.findGitDirectory"></a>

```typescript
public findGitDirectory(): string
```

##### `retrieveGitUrl` <a name="retrieveGitUrl" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.retrieveGitUrl"></a>

```typescript
public retrieveGitUrl(): string
```

##### `visit` <a name="visit" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.visit"></a>

```typescript
public visit(construct: IConstruct): void
```

All aspects can visit an IConstruct.

###### `construct`<sup>Required</sup> <a name="construct" id="@defiance-digital/cdk-git-tagger.GitUrlTagger.visit.parameter.construct"></a>

- *Type:* constructs.IConstruct

---





