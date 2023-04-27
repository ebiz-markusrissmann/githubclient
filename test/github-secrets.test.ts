import { StatusCodes } from 'http-status-codes';
import { mock, mockReset } from 'jest-mock-extended';
import { Octokit } from 'octokit';
import { OctokitResponseBuilder } from './tools-utils/octokit-response-builder';
import { GithubSecrets } from '../src/github-secrets';
import { GithubError } from '../src/models/github-error';
import { ErrorHandler } from '../src/tools-utils/error-handler';
import { IActionsSecret } from '../src/interfaces/responses/I-actions-secret';
import { createFakeActionsSecret } from './factories/fake-actions-secrets-factory';
import { IActionsPublicKey } from '../src/interfaces/responses/i-actions-public-key';
import { createFakeActionsPublicKey } from './factories/fake-actions-public-key';

const errorHandler: ErrorHandler = new ErrorHandler();

describe('Test github-secrets.ts', () => {
  const apiVersion = '2022-11-28';
  const octokitMock = mock<Octokit>();

  beforeEach(() => {
    mockReset(octokitMock);
  });

  it('Test ListRepositorySecrets', async () => {
    const secret1: IActionsSecret = createFakeActionsSecret();
    const secret2: IActionsSecret = createFakeActionsSecret();

    const githbuSecretResponse = {
      total_count: 2,
      secrets: [secret1, secret2],
    };

    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', githbuSecretResponse);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));
    const githubSecrets = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    const githubSecretsList = await githubSecrets.ListRepositorySecrets('me', 'my-repo');

    expect(githubSecretsList.length).toBe(2);
    expect(octokitMock.request).toBeCalledTimes(1);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo' });
  });

  it('Test GetRepositorySecret', async () => {
    const githubSecretResponse: IActionsSecret = createFakeActionsSecret();
    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', githubSecretResponse);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));
    const githubSecrets = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    const githubSecret = await githubSecrets.GetRepositorySecret('me', 'my-repo', githubSecretResponse.name);

    expect(githubSecret).toEqual(githubSecretResponse);
    expect(octokitMock.request).toBeCalledTimes(1);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo', secret_name: githubSecretResponse.name });
  });

  it('Test GetRepositorySecret -> 404', async () => {
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
    const ghs = new GithubSecrets(octokitMock, apiVersion, errorHandler);

    await expect(ghs.GetRepositorySecret('me', 'er', 'er')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/er/actions/secrets/er failed! See https://docs.github.com/rest/reference/actions#get-a-repository-secret',
      name: 'GithubClientError',
    });
  });

  it('Test ListRepositorySecrets -> 404', async () => {
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
    const ghs = new GithubSecrets(octokitMock, apiVersion, errorHandler);

    await expect(ghs.ListRepositorySecrets('me', 'er')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/er/actions/secrets failed! See https://docs.github.com/rest/reference/actions#list-repository-secrets',
      name: 'GithubClientError',
    });
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
    const ghs = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    await expect(ghs.CreateOrUpdateSecret('me', 'repo', 'secret name', 'secret value')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/secrets/public-key failed! See https://docs.github.com/rest/reference/actions#get-a-repository-public-key',
      name: 'GithubClientError',
    });
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

    const ghs = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    await expect(ghs.CreateOrUpdateSecret(owner, repo, 'secretName', 'secretValue')).rejects.toEqual({ message: "Cannot update secret for repo 'mwaa-pitch' with owner 'ebiz-markusrissmann'" });
  });

  it('Test GetPublicKey', async () => {
    const data: IActionsPublicKey = createFakeActionsPublicKey();
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);

    octokitMock.request.mockImplementation(() => Promise.resolve(response2));

    const githubSecrets = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    const updateVariableResponse = await githubSecrets.GetPublicKey('me', 'my-repo');

    expect(updateVariableResponse).toEqual(data);

    expect(octokitMock.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/actions/secrets/public-key', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo' });
  });

  it('Test DeleteRepositoryVariable', async () => {
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);

    octokitMock.request.mockImplementation(() => Promise.resolve(response2));

    const githubSecrets = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    const updateVariableResponse = await githubSecrets.DeleteRepositorySecret('me', 'my-repo', 'dodo');

    expect(updateVariableResponse).toBe(StatusCodes.NO_CONTENT);

    expect(octokitMock.request).toHaveBeenCalledWith('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, secret_name: 'dodo', owner: 'me', repo: 'my-repo' });
  });

  it('Test DeleteRepositorySecret -> 404', async () => {
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

    const ghs = new GithubSecrets(octokitMock, apiVersion, errorHandler);
    await expect(ghs.DeleteRepositorySecret(owner, repo, 'secretName')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/secrets/secretName failed! See https://docs.github.com/rest/reference/actions#delete-a-repository-secret',
      name: 'GithubClientError',
    });
  });
});
