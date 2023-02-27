import { GithubClient } from './github';

async function main(): Promise<void> {
  const githubClient: GithubClient = new GithubClient();

  const result1 = await githubClient.ListWorkflows('ebiz-markusrissmann', 'mwaa-pitch');

  console.log(JSON.stringify(result1, null, 4));

  const result2 = await githubClient.GetWorkflow('ebiz-markusrissmann', 'mwaa-pitch', 'release');

  console.log(JSON.stringify(result2, null, 4));

  await githubClient.TriggerWorkflow('ebiz-markusrissmann', 'mwaa-pitch', 'release', 'main');
}

main()
  .then()
  .catch((err) => {
    console.error(err.message);
  });
