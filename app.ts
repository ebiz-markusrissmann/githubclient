import { GithubClient } from './src/github';

async function main(): Promise<void> {
  const githubClient: GithubClient = new GithubClient();

  /* const result1 = await githubClient.ListRepositoryVariables('ebiz-markusrissmann', 'mwaa-pitch');
  const exists = await githubClient.RepositoryVariableExists('ebiz-markusrissmann', 'mwaa-pitch', 'TEST');
  if (!exists) {
    const result2 = await githubClient.CreateRepositoryVariable('ebiz-markusrissmann', 'mwaa-pitch', 'TEST', 'TEST_VALUE');
    console.log(result2);
  }
  const result3 = await githubClient.ListRepositoryVariables('ebiz-markusrissmann', 'mwaa-pitch');
  const result4 = await githubClient.GetRepositoryVariable('ebiz-markusrissmann', 'mwaa-pitch', 'TEST');
  const result5 = await githubClient.UpdateRepositoryVariable('ebiz-markusrissmann', 'mwaa-pitch', 'TEST', 'BLUB');
  const result6 = await githubClient.GetRepositoryVariable('ebiz-markusrissmann', 'mwaa-pitch', 'TEST');
  const result7 = await githubClient.DeleteRepositoryVariable('ebiz-markusrissmann', 'mwaa-pitch', 'TEST');
  console.log(JSON.stringify(result1, null, 4)); */

  const result1 = await githubClient.ListRepositorySecrets('ebiz-markusrissmann', 'mwaa-pitch');
  const result2 = await githubClient.GetRepositorySecret('ebiz-markusrissmann', 'mwaa-pitch', result1[0].name);
  const result3 = await githubClient.CreateOrUpdateSecret('ebiz-markusrissmann', 'mwaa-pitch', 'test', 'password');
  const result4 = await githubClient.DeleteRepositorySecret('ebiz-markusrissmann', 'mwaa-pitch', 'test');
  console.log(JSON.stringify(result1, null, 4));
  console.log(JSON.stringify(result2, null, 4));
  console.log(result3);
  console.log(result4);
  /*
  console.log(result5);
  console.log(JSON.stringify(result6, null, 4));
  console.log(result7);
} */
}

main()
  .then()
  .catch((err) => {
    console.error(err.message);
  });
