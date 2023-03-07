# github-actions-client

This library is a wrapper library that can be used to execute actions in Github Actions.

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