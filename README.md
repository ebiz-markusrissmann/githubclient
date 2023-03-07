# @markusrissmann/github-actions-client

This library is a wrpper library that can be used to execute actions in Github Actions.

## Installation

### npm
```
npm i @markusrissmann/github-actions-client 
```

### yarn
```
yarn add @markusrissmann/github-actions-client
```

## Usage


```
import { GithubClient } from '@markusrissmann/github-actions-client'

const github_username = 'ebiz-markusrissmann';
const github_repository = 'eBizDataFactory';

async function main(): Promise<void> {
  try {
    const githubClient: GithubClient = new GithubClient(github_username, github_repository);

    githubClient.CreateOrUpdateSecret('AWS_ACCESS_KEY', process.env.AWS_ACCESS_KEY ?? '');
    githubClient.CreateOrUpdateSecret('AWS_SECRET_KEY', process.env.AWS_SECRET_KEY ?? '');
    githubClient.CreateOrUpdateRepositoryVariable('AWS_DEFAULT_REGION', 'eu-central-1');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_snowfox_mwaa_min_workers', '1');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_snowfox_mwaa_max_workers', '2');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_snowfox_mwaa_environment_class', 'mw1.small');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_setup_mwaa', 'true');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_vpc_cidr_block', '172.32.0.0/16');
    githubClient.CreateOrUpdateRepositoryVariable('TF_VAR_setup_vpc', 'false');   

    githubClient.TriggerWorkflow(/*wokflow name */ 'main', /* branch */ 'main');
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
