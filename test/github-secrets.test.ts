import { Octokit } from 'octokit';
import { GithubSecrets } from '../src/github-secrets';
import { mock, mockReset } from 'jest-mock-extended';
import { GithubError } from '../src/models/github-error';
import { StatusCodes } from 'http-status-codes';
import { OctokitResponseBuilder } from './tools-utils/octokit-response-builder';
import { components } from '@octokit/openapi-types/types';

describe('Test github-secrets.ts', () => {
  const apiVersion = '2022-11-28';
  const octokitMock = mock<Octokit>();

  beforeEach(() => {
    mockReset(octokitMock);
  });

  it('Test github-secrets.ts -> ListRepositorySecrets', async () => {
    const secret1: components['schemas']['actions-secret'] = {
      created_at: Date().toLocaleString(),
      updated_at: Date().toLocaleString(),
      name: 'Extreme Secret1',
    };
    const secret2: components['schemas']['actions-secret'] = {
      created_at: Date().toLocaleString(),
      updated_at: Date().toLocaleString(),
      name: 'Extreme Secret2',
    };

    const githbuSecretResponse = {
      total_count: 2,
      secrets: [secret1, secret2],
    };

    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', githbuSecretResponse);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));
    const githubSecrets = new GithubSecrets(octokitMock, apiVersion);
    const githubSecretsList = await githubSecrets.ListRepositorySecrets('me', 'my-repo');

    expect(githubSecretsList.length).toBe(2);
    expect(octokitMock.request).toBeCalledTimes(1);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo' });
  });

  it('Test github-secrets.ts -> GetRepositorySecret', async () => {
    const githubSecretResponse: components['schemas']['actions-secret'] = {
      created_at: Date().toLocaleString(),
      updated_at: Date().toLocaleString(),
      name: 'Extreme Secret2',
    };
    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', githubSecretResponse);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));
    const githubSecrets = new GithubSecrets(octokitMock, apiVersion);
    const githubSecret = await githubSecrets.GetRepositorySecret('me', 'my-repo', 'Extreme Secret2');

    expect(githubSecret).toEqual(githubSecretResponse);
    expect(octokitMock.request).toBeCalledTimes(1);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo', secret_name: 'Extreme Secret2' });
  });

  it('Test github-secrets.ts -> GetRepositorySecret error', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/er/actions/secrets/er',
        status: StatusCodes.NOT_FOUND,
        headers: {},
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#get-a-repository-secret',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/er/actions/secrets/er',
        headers: {},
        request: {},
      },
    };

    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const ghs = new GithubSecrets(octokitMock, apiVersion);

    await expect(ghs.GetRepositorySecret('me', 'er', 'er')).rejects.toEqual({ message: "Owner 'me', repository 'er' or secret name 'er' is unknown!" });
  });

  it('Test github-secrets.ts -> ListRepositorySecrets error', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/er/actions/secrets',
        status: StatusCodes.NOT_FOUND,
        headers: {},
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#list-repository-secrets',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/er/actions/secrets',
        headers: {},
        request: {},
      },
    };

    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const ghs = new GithubSecrets(octokitMock, apiVersion);

    await expect(ghs.ListRepositorySecrets('me', 'er')).rejects.toEqual({ message: "Owner 'me', repository 'er' is unknown!" });
  });

  it('Test github-secrets.ts -> CreateOrUpdateSecret error 1', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/secrets/public-key',
        status: StatusCodes.NOT_FOUND,
        headers: {},
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#get-a-repository-public-key',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/secrets/public-key',
        headers: {},
        request: {},
      },
    };

    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const ghs = new GithubSecrets(octokitMock, apiVersion);
    await expect(ghs.CreateOrUpdateSecret('me', 'repo', 'secret name', 'secret value')).rejects.toEqual({ message: "Cannot retrieve public-key for repo 'repo' with owner 'me'" });
  });

  it.skip('Test github-secrets.ts -> CreateOrUpdateSecret error 2', async () => {
    const owner = 'ebiz-markusrissmann';
    const repo = 'mwaa-pitch';

    const githubSecretsPublicKeyResponse = {
      data: {
        key: process.env.GH_KEY!,
        key_id: '568250167242549743',
      },
      headers: {},
      status: 200,
      url: 'https://api.github.com/repos/ebiz-markusrissmann/mwaa-pitch/actions/secrets/public-key',
    };

    const error = {
      name: 'HttpError',
      status: 404,
      response: {
        url: 'https://api.github.com/repos/ebiz-markusrissmann/repo/actions/secrets/secret%20name',
        status: 404,
        headers: {},
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#create-or-update-a-repository-secret',
        },
      },
    };

    octokitMock.request.mockImplementationOnce(() => Promise.resolve(githubSecretsPublicKeyResponse));
    octokitMock.request.mockImplementationOnce(() => Promise.reject(error));

    const ghs = new GithubSecrets(octokitMock, apiVersion);
    await expect(ghs.CreateOrUpdateSecret(owner, repo, 'secretName', 'secretValue')).rejects.toEqual({ message: "Cannot update secret for repo 'mwaa-pitch' with owner 'ebiz-markusrissmann'" });
  });

  it('Test github-secrets.ts -> DeleteRepositorySecret error', async () => {
    const owner = 'me';
    const repo = 'repo';

    const error = {
      name: 'HttpError',
      status: 404,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/secrets/secretName',
        status: 404,
        headers: {},
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#delete-a-repository-secret',
        },
      },
      request: {
        method: 'DELETE',
        url: 'https://api.github.com/repos/me/repo/actions/secrets/secretName',
        headers: {},
      },
    };

    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const ghs = new GithubSecrets(octokitMock, apiVersion);
    await expect(ghs.DeleteRepositorySecret(owner, repo, 'secretName')).rejects.toEqual({ message: "Owner 'me', repository 'repo' or secret name 'secretName' is unknown!" });
  });
});
