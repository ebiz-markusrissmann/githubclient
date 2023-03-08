import { components } from '@octokit/openapi-types';
import { StatusCodes } from 'http-status-codes';
import { mock, mockReset } from 'jest-mock-extended';
import { Octokit } from 'octokit';
import winston, { createLogger, Logger } from 'winston';
import { ListRepositoryVariablesResponse, OctokitResponseBuilder } from './tools-utils/octokit-response-builder';
import { GithubVariables } from '../src/github-variables';
import { GithubError } from '../src/models/github-error';
import { ErrorHandler } from '../src/tools-utils/error-handler';

const logger: Logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'error.log', level: 'error' }), new winston.transports.File({ filename: 'github-client.log', level: 'info' }), new winston.transports.Console({})],
  defaultMeta: { dateTime: Date().toLocaleUpperCase() },
});

const errorHandler: ErrorHandler = new ErrorHandler(logger);

describe('Test github-variabls.ts', () => {
  const apiVersion = '2022-11-28';
  const octokitMock = mock<Octokit>();

  beforeEach(() => {
    mockReset(octokitMock);
  });

  it('Test ListRepositoryVariables', async () => {
    const rv1: components['schemas']['actions-variable'] = {
      name: '',
      value: '',
      created_at: '',
      updated_at: '',
    };

    const rv2: components['schemas']['actions-variable'] = {
      name: '',
      value: '',
      created_at: '',
      updated_at: '',
    };

    const data: ListRepositoryVariablesResponse = {
      total_count: 2,
      variables: [rv1, rv2],
    };

    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);
    const githubVariablesList = await githubSecrets.ListRepositoryVariables('me', 'my-repo');

    expect(githubVariablesList.length).toBe(2);

    expect(octokitMock.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/actions/variables', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo' });
  });

  it('Test ListRepositoryVariables -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/my-repo/actions/variables',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/actions/variables#list-repository-variables',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/my-repo/actions/variables',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);

    await expect(githubSecrets.ListRepositoryVariables('me', 'my-repo')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/my-repo/actions/variables failed! See https://docs.github.com/rest/actions/variables#list-repository-variables',
      name: 'GithubClientError',
    });

    expect(octokitMock.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/actions/variables', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'me', repo: 'my-repo' });
  });

  it('Test GetRepositoryVariable', async () => {
    const rv1: components['schemas']['actions-variable'] = {
      name: 'dodo',
      value: '',
      created_at: '',
      updated_at: '',
    };

    const octokitResponse = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', rv1);

    octokitMock.request.mockImplementation(() => Promise.resolve(octokitResponse));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);
    const githubVariablesList = await githubSecrets.GetRepositoryVariable('me', 'my-repo', 'dodo');

    expect(githubVariablesList).toEqual(rv1);

    expect(octokitMock.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo' });
  });

  it('Test GetRepositoryVariable -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/actions/variables#get-a-repository-variable',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);

    await expect(githubSecrets.GetRepositoryVariable('me', 'my-repo', 'dodo')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/my-repo/actions/variables/dodo failed! See https://docs.github.com/rest/actions/variables#get-a-repository-variable',
      name: 'GithubClientError',
    });

    expect(octokitMock.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo' });
  });

  it('Test UpdateRepositoryVariable', async () => {
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);

    octokitMock.request.mockImplementation(() => Promise.resolve(response2));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);
    const updateVariableResponse = await githubSecrets.UpdateRepositoryVariable('me', 'my-repo', 'dodo', 'new value');

    expect(updateVariableResponse).toBe(StatusCodes.NO_CONTENT);

    expect(octokitMock.request).toHaveBeenCalledWith('PATCH /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo', value: 'new value' });
  });

  it('Test UpdateRepositoryVariable -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/actions/variables#update-a-repository-variable',
        },
      },
      request: {
        method: 'PATCH',
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);

    await expect(githubSecrets.UpdateRepositoryVariable('me', 'my-repo', 'dodo', 'new value')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/my-repo/actions/variables/dodo failed! See https://docs.github.com/rest/actions/variables#update-a-repository-variable',
      name: 'GithubClientError',
    });

    expect(octokitMock.request).toHaveBeenCalledWith('PATCH /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo', value: 'new value' });
  });

  it('Test CreateRepositoryVariable', async () => {
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);

    octokitMock.request.mockImplementation(() => Promise.resolve(response2));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);
    const updateVariableResponse = await githubSecrets.CreateRepositoryVariable('me', 'my-repo', 'dodo', 'new value');

    expect(updateVariableResponse).toBe(StatusCodes.NO_CONTENT);

    expect(octokitMock.request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/variables', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo', value: 'new value' });
  });

  it('Test CreateRepositoryVariable -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/actions/variables#update-a-repository-variable',
        },
      },
      request: {
        method: 'PATCH',
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);

    await expect(githubSecrets.CreateRepositoryVariable('me', 'my-repo', 'dodo', 'new value')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/my-repo/actions/variables/dodo failed! See https://docs.github.com/rest/actions/variables#update-a-repository-variable',
      name: 'GithubClientError',
    });

    expect(octokitMock.request).toHaveBeenCalledWith('POST /repos/{owner}/{repo}/actions/variables', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo', value: 'new value' });
  });

  it('Test DeleteRepositoryVariable', async () => {
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);

    octokitMock.request.mockImplementation(() => Promise.resolve(response2));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);
    const updateVariableResponse = await githubSecrets.DeleteRepositoryVariable('me', 'my-repo', 'dodo');

    expect(updateVariableResponse).toBe(StatusCodes.NO_CONTENT);

    expect(octokitMock.request).toHaveBeenCalledWith('DELETE /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo' });
  });

  it('Test DeleteRepositoryVariable -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/actions/variables#update-a-repository-variable',
        },
      },
      request: {
        method: 'PATCH',
        url: 'https://api.github.com/repos/me/my-repo/actions/variables/dodo',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubSecrets = new GithubVariables(octokitMock, apiVersion, logger, errorHandler);

    await expect(githubSecrets.DeleteRepositoryVariable('me', 'my-repo', 'dodo')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/my-repo/actions/variables/dodo failed! See https://docs.github.com/rest/actions/variables#update-a-repository-variable',
      name: 'GithubClientError',
    });

    expect(octokitMock.request).toHaveBeenCalledWith('DELETE /repos/{owner}/{repo}/actions/variables/{name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, name: 'dodo', owner: 'me', repo: 'my-repo' });
  });
});
