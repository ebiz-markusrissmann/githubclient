import { mock } from 'jest-mock-extended';
import { Octokit } from 'octokit';
import { GithubClient } from '../src/github';
import { IGithubWorkflow } from '../src/interfaces/i-github-workflows';
import { workflow } from '../src/models/workflow';

describe('Test GithubClient', () => {
  const githubWorkFlow = mock<IGithubWorkflow>();
  const octokit = mock<Octokit>();
  const wf: workflow[] = [
    {
      id: 48242088,
      node_id: 'W_kwDOI8NMus4C4B2o',
      name: 'dev',
      path: '.github/workflows/dev.yml',
      state: 'active',
      created_at: '2023-02-13T13:20:31.000+01:00',
      updated_at: '2023-02-13T13:20:31.000+01:00',
      url: 'https://api.github.com/repos/ebiz-markusrissmann/mwaa-pitch/actions/workflows/48242088',
      html_url: 'https://github.com/ebiz-markusrissmann/mwaa-pitch/blob/main/.github/workflows/dev.yml',
      badge_url: 'https://github.com/ebiz-markusrissmann/mwaa-pitch/workflows/dev/badge.svg',
    },
    {
      id: 48007069,
      node_id: 'W_kwDOI8NMus4C3Ied',
      name: 'release',
      path: '.github/workflows/main.yml',
      state: 'active',
      created_at: '2023-02-10T12:36:57.000+01:00',
      updated_at: '2023-02-10T12:36:57.000+01:00',
      url: 'https://api.github.com/repos/ebiz-markusrissmann/mwaa-pitch/actions/workflows/48007069',
      html_url: 'https://github.com/ebiz-markusrissmann/mwaa-pitch/blob/main/.github/workflows/main.yml',
      badge_url: 'https://github.com/ebiz-markusrissmann/mwaa-pitch/workflows/release/badge.svg',
    },
  ];

  beforeAll(() => {});

  test('Test ListWorkflows', async () => {
    const githubClient = new GithubClient(octokit, githubWorkFlow, '');
    githubWorkFlow.ListWorkflows.mockImplementation(() => Promise.resolve(wf));
    await expect(githubClient.ListWorkflows('owner', 'repo')).resolves.toEqual(wf);
  });

  test('Test GetWorkflow', async () => {
    const githubClient = new GithubClient(octokit, githubWorkFlow, '');
    githubWorkFlow.GetWorkflow.mockImplementation(() => Promise.resolve(wf[1]));
    await expect(githubClient.GetWorkflow('owner', 'repo', 'release')).resolves.toEqual(wf[1]);
  });

  test('Test TriggerWorkflow', async () => {
    const githubClient = new GithubClient(octokit, githubWorkFlow, '');
    githubWorkFlow.TriggerWorkflow.mockImplementation(() => Promise.resolve());
    await expect(githubClient.TriggerWorkflow('owner', 'repo', 'release', 'main')).resolves.toEqual(undefined);
  });
});
