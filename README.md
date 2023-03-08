# github-actions-client

[![Known Vulnerabilities](https://snyk.io/test/github/ebiz-markusrissmann/githubclient/badge.svg)](https://snyk.io/test/github/ebiz-markusrissmann/githubclient)
[![Coverage lines](coverage/badge-lines.svg)](coverage/badge-lines.svg)

This library is a Wrapper library that uses Octokit in the background. Currently can use it to create, update and delete repository secrets and repository variables. Workflow dispatch events can be triggered with it. Also workflows can be loaded, activated or deactivated.


## Installation

### npm
```ps
npm i github-actions-client 
```

### yarn
```ps
yarn add github-actions-client
```

## Usage


```ts
import { GithubActionsClient } from 'github-actions-client'

const github_username = 'username';
const github_repository = 'repository';

async function main(): Promise<void> {
  try {
    const ghc = new GithubActionsClient(github_username, github_repository);

    await ghc.CreateOrUpdateSecret('SecretName1', 'SecretValue1');
    await ghc.CreateOrUpdateSecret('SecretName2', 'SecretValue2');
    await ghc.CreateOrUpdateRepositoryVariable('VariableName1', 'eu-central-1');
    await ghc.CreateOrUpdateRepositoryVariable('VariableName2', '1');
   

    await ghc.TriggerWorkflow(/*wokflow name */ 'main', /* branch */ 'main');
  } catch (err: any) {
    throw err;
  }
}

main()
  .then()
  .catch((err) => {
    console.error(err.message);
  });

```


## Code Documentation
[GithubActionsClient](docs/README.md)