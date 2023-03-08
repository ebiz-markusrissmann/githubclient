import { components } from '@octokit/openapi-types';
import { ResponseHeaders } from '@octokit/types';
import { Workflow } from '@octokit/webhooks-types';
import { StatusCodes } from 'http-status-codes';
import { mock, mockReset } from 'jest-mock-extended';
import { Octokit } from 'octokit';
import winston, { createLogger, Logger } from 'winston';
import { OctokitResponseBuilder, ListWorkflowResponse, ListWorkflowRunsResponse } from './tools-utils/octokit-response-builder';
import { GithubWorkflow } from '../src/github-workflow';
import { GithubError } from '../src/models/github-error';
import { ErrorHandler } from '../src/tools-utils/error-handler';

describe('Test github-workflow.ts', () => {
  const apiVersion = '2022-11-28';
  const octokitMock = mock<Octokit>();

  const logger: Logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'debug',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: 'error.log', level: 'error' }), new winston.transports.File({ filename: 'github-client.log', level: 'info' }), new winston.transports.Console({})],
    defaultMeta: { dateTime: Date().toLocaleUpperCase() },
  });

  const errorHandler: ErrorHandler = new ErrorHandler(logger);

  beforeEach(() => {
    mockReset(octokitMock);
  });

  it('Test ListWorkflows', async () => {
    const wf1: Workflow = {
      id: 2000,
      badge_url: 'badge_url1',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url',
      name: 'release',
      node_id: 'MDg6V29ya2Zsb3cxMg==',
      path: 'path1',
      state: 'active',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url1',
    };

    const wf2: Workflow = {
      id: 2001,
      badge_url: 'badge_url2',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url2',
      name: 'release',
      node_id: 'MDg6V29ya1Zsb3cxMg==',
      path: 'path2',
      state: '',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url2',
    };

    const data: ListWorkflowResponse = {
      total_count: 2,
      workflows: [wf1, wf2],
    };

    const response = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);

    octokitMock.request.mockImplementation(() => Promise.resolve(response));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    const workflows = await githubWorkflow.ListWorkflows('me', 'repo');

    expect(workflows.length).toBe(2);
    expect(workflows[0]).toEqual(wf1);
    expect(workflows[1]).toEqual(wf2);
  });

  it('Test ListWorkflows -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#list-repository-workflows',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows',
        headers: undefined,
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, '2022-11-28', logger, errorHandler);
    await expect(githubWorkflow.ListWorkflows('me', 'repo')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/workflows failed! See https://docs.github.com/rest/reference/actions#list-repository-workflows',
      name: 'GithubClientError',
    });
  });

  it('Test ListWorkflows -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'bearer [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, '2022-11-28', logger, errorHandler);
    await expect(githubWorkflow.ListWorkflows('me', 'repo')).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/workflows failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflow', async () => {
    const wf1: Workflow = {
      id: 2000,
      badge_url: 'badge_url1',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url',
      name: 'release',
      node_id: 'MDg6V29ya2Zsb3cxMg==',
      path: 'path1',
      state: 'active',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url1',
    };

    const response = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', wf1);

    octokitMock.request.mockImplementation(() => Promise.resolve(response));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    const workflow = await githubWorkflow.GetWorkflow('me', 'repo', 2001);

    expect(workflow).toEqual(wf1);
  });

  it('Test GetWorkflow -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2001',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#get-a-workflow',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2001',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflow('me', 'repo', 2001)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/workflows/2001 failed! See https://docs.github.com/rest/reference/actions#get-a-workflow',
      name: 'GithubClientError',
    });
  });

  it('Test TriggerWorkflow', async () => {
    const wf1: Workflow = {
      id: 2000,
      badge_url: 'badge_url1',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url',
      name: 'test',
      node_id: 'MDg6V29ya2Zsb3cxMg==',
      path: 'path1',
      state: 'active',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url1',
    };

    const wf2: Workflow = {
      id: 2001,
      badge_url: 'badge_url2',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url2',
      name: 'release',
      node_id: 'MDg6V29ya1Zsb3cxMg==',
      path: 'path2',
      state: '',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url2',
    };

    const data: ListWorkflowResponse = {
      total_count: 2,
      workflows: [wf1, wf2],
    };

    const response1 = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);
    const response2 = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);

    octokitMock.request.mockImplementationOnce(() => Promise.resolve(response1));
    octokitMock.request.mockImplementationOnce(() => Promise.resolve(response2));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    const result = await githubWorkflow.TriggerWorkflow('me', 'repo', 'release', 'branch');
    expect(result).toBe(204);
  });

  it('Test TriggerWorkflow -> 404', async () => {
    const wf1: Workflow = {
      id: 2000,
      badge_url: 'badge_url1',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url',
      name: 'test',
      node_id: 'MDg6V29ya2Zsb3cxMg==',
      path: 'path1',
      state: 'active',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url1',
    };

    const wf2: Workflow = {
      id: 2001,
      badge_url: 'badge_url2',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url2',
      name: 'release',
      node_id: 'MDg6V29ya1Zsb3cxMg==',
      path: 'path2',
      state: '',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url2',
    };

    const data: ListWorkflowResponse = {
      total_count: 2,
      workflows: [wf1, wf2],
    };

    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#create-a-workflow-dispatch-event',
        },
      },
      request: {
        method: 'POST',
        url: 'https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };

    const response1 = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);

    octokitMock.request.mockImplementationOnce(() => Promise.resolve(response1));
    octokitMock.request.mockImplementationOnce(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.TriggerWorkflow('me', 'repo', 'release', 'branch')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches failed! See https://docs.github.com/rest/reference/actions#create-a-workflow-dispatch-event',
      name: 'GithubClientError',
    });
  });

  it('Test TriggerWorkflow -> 401', async () => {
    const wf1: Workflow = {
      id: 2000,
      badge_url: 'badge_url1',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url',
      name: 'test',
      node_id: 'MDg6V29ya2Zsb3cxMg==',
      path: 'path1',
      state: 'active',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url1',
    };

    const wf2: Workflow = {
      id: 2001,
      badge_url: 'badge_url2',
      created_at: Date().toLocaleUpperCase(),
      html_url: 'html_url2',
      name: 'release',
      node_id: 'MDg6V29ya1Zsb3cxMg==',
      path: 'path2',
      state: '',
      updated_at: Date().toLocaleUpperCase(),
      url: 'url2',
    };

    const data: ListWorkflowResponse = {
      total_count: 2,
      workflows: [wf1, wf2],
    };

    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'POST',
        url: 'https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };

    const response1 = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);

    octokitMock.request.mockImplementationOnce(() => Promise.resolve(response1));
    octokitMock.request.mockImplementationOnce(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.TriggerWorkflow('me', 'repo', 'release', 'branch')).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/owner/repo/actions/workflows/2000/dispatches failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test ListWorkflowRuns', async () => {
    const wfr1: components['schemas']['workflow-run'] = {
      id: 0,
      node_id: '',
      head_branch: null,
      head_sha: '',
      path: '',
      run_number: 0,
      event: '',
      status: null,
      conclusion: null,
      workflow_id: 0,
      url: '',
      html_url: '',
      pull_requests: null,
      created_at: '',
      updated_at: '',
      jobs_url: '',
      logs_url: '',
      check_suite_url: '',
      artifacts_url: '',
      cancel_url: '',
      rerun_url: '',
      workflow_url: '',
      head_commit: null,
      repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      head_repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      display_title: '',
    };
    const wfr2: components['schemas']['workflow-run'] = {
      id: 1,
      node_id: '',
      head_branch: null,
      head_sha: '',
      path: '',
      run_number: 0,
      event: '',
      status: null,
      conclusion: null,
      workflow_id: 0,
      url: '',
      html_url: '',
      pull_requests: null,
      created_at: '',
      updated_at: '',
      jobs_url: '',
      logs_url: '',
      check_suite_url: '',
      artifacts_url: '',
      cancel_url: '',
      rerun_url: '',
      workflow_url: '',
      head_commit: null,
      repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      head_repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      display_title: '',
    };
    const data: ListWorkflowRunsResponse = {
      total_count: 2,
      workflow_runs: [wfr1, wfr2],
    };

    const response = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', data);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    expect((await githubWorkflow.ListWorkflowRuns('me', 'repo')).length).toBe(2);
  });

  it('Test ListWorkflowRuns -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#list-workflow-runs-for-a-repository',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.ListWorkflowRuns('me', 'repo')).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/runs failed! See https://docs.github.com/rest/reference/actions#list-workflow-runs-for-a-repository',
      name: 'GithubClientError',
    });
  });

  it('Test ListWorkflowRuns -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.ListWorkflowRuns('me', 'repo')).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/runs failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowRun', async () => {
    const wfr: components['schemas']['workflow-run'] = {
      id: 205,
      node_id: '',
      head_branch: null,
      head_sha: '',
      path: '',
      run_number: 0,
      event: '',
      status: null,
      conclusion: null,
      workflow_id: 0,
      url: '',
      html_url: '',
      pull_requests: null,
      created_at: '',
      updated_at: '',
      jobs_url: '',
      logs_url: '',
      check_suite_url: '',
      artifacts_url: '',
      cancel_url: '',
      rerun_url: '',
      workflow_url: '',
      head_commit: null,
      repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      head_repository: {
        id: 0,
        node_id: '',
        name: '',
        full_name: '',
        owner: {
          name: undefined,
          email: undefined,
          login: '',
          id: 0,
          node_id: '',
          avatar_url: '',
          gravatar_id: null,
          url: '',
          html_url: '',
          followers_url: '',
          following_url: '',
          gists_url: '',
          starred_url: '',
          subscriptions_url: '',
          organizations_url: '',
          repos_url: '',
          events_url: '',
          received_events_url: '',
          type: '',
          site_admin: false,
          starred_at: undefined,
        },
        private: false,
        html_url: '',
        description: null,
        fork: false,
        url: '',
        archive_url: '',
        assignees_url: '',
        blobs_url: '',
        branches_url: '',
        collaborators_url: '',
        comments_url: '',
        commits_url: '',
        compare_url: '',
        contents_url: '',
        contributors_url: '',
        deployments_url: '',
        downloads_url: '',
        events_url: '',
        forks_url: '',
        git_commits_url: '',
        git_refs_url: '',
        git_tags_url: '',
        git_url: undefined,
        issue_comment_url: '',
        issue_events_url: '',
        issues_url: '',
        keys_url: '',
        labels_url: '',
        languages_url: '',
        merges_url: '',
        milestones_url: '',
        notifications_url: '',
        pulls_url: '',
        releases_url: '',
        ssh_url: undefined,
        stargazers_url: '',
        statuses_url: '',
        subscribers_url: '',
        subscription_url: '',
        tags_url: '',
        teams_url: '',
        trees_url: '',
        clone_url: undefined,
        mirror_url: undefined,
        hooks_url: '',
        svn_url: undefined,
        homepage: undefined,
        language: undefined,
        forks_count: undefined,
        stargazers_count: undefined,
        watchers_count: undefined,
        size: undefined,
        default_branch: undefined,
        open_issues_count: undefined,
        is_template: undefined,
        topics: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
        has_pages: undefined,
        has_downloads: undefined,
        has_discussions: undefined,
        archived: undefined,
        disabled: undefined,
        visibility: undefined,
        pushed_at: undefined,
        created_at: undefined,
        updated_at: undefined,
        permissions: undefined,
        role_name: undefined,
        temp_clone_token: undefined,
        delete_branch_on_merge: undefined,
        subscribers_count: undefined,
        network_count: undefined,
        code_of_conduct: undefined,
        license: undefined,
        forks: undefined,
        open_issues: undefined,
        watchers: undefined,
        allow_forking: undefined,
        web_commit_signoff_required: undefined,
        security_and_analysis: undefined,
      },
      display_title: '',
    };

    const response = OctokitResponseBuilder.getResponse(StatusCodes.OK, '', wfr);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowRun('me', 'repo', 205)).resolves.toEqual(wfr);
  });

  it('Test GetWorkflowRun -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs/205',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#get-a-workflow-run',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs/205',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowRun('me', 'repo', 205)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/runs/205 failed! See https://docs.github.com/rest/reference/actions#get-a-workflow-run',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowRun -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs/205',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs/205',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowRun('me', 'repo', 205)).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/runs/205 failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test DownloadWorkflowRunLogs', async () => {
    const responseHeaders: ResponseHeaders = {
      location: 'download location url',
    };

    const response = OctokitResponseBuilder.getResponse(StatusCodes.MOVED_TEMPORARILY, '', undefined, responseHeaders);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DownloadWorkflowRunLogs('me', 'repo', 201)).resolves.toBe(responseHeaders.location);
  });

  it('Test DownloadWorkflowRunLogs -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs/201/logs',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#download-workflow-run-logs',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs/201/logs',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DownloadWorkflowRunLogs('me', 'repo', 201)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/runs/201/logs failed! See https://docs.github.com/rest/reference/actions#download-workflow-run-logs',
      name: 'GithubClientError',
    });
  });

  it('Test DownloadWorkflowRunLogs -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/runs/201/logs',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad Request',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/runs/201/logs',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));

    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DownloadWorkflowRunLogs('me', 'repo', 201)).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/runs/201/logs failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowUsage', async () => {
    const wfu: components['schemas']['workflow-usage'] = {
      billable: {
        UBUNTU: { total_ms: 2000 },
        MACOS: undefined,
        WINDOWS: undefined,
      },
    };
    const response = OctokitResponseBuilder.getResponse(StatusCodes.MOVED_TEMPORARILY, '', wfu);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowUsage('me', 'repo', 2000)).resolves.toEqual(wfu);
  });

  it('Test GetWorkflowUsage -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/timing',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#get-workflow-usage',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/timing',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowUsage('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/timing failed! See https://docs.github.com/rest/reference/actions#get-workflow-usage',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowUsage -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/timing',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad Request',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/timing',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.GetWorkflowUsage('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/timing failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test DisableWorkflow', async () => {
    const response = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DisableWorkflow('me', 'repo', 2000)).resolves.toBe(StatusCodes.NO_CONTENT);
  });

  it('Test DisableWorkflow -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/disable',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#disable-a-workflow',
        },
      },
      request: {
        method: 'PUT',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/disable',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DisableWorkflow('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/disable failed! See https://docs.github.com/rest/reference/actions#disable-a-workflow',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowUsage -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/disable',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad Request',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/disable',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.DisableWorkflow('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/disable failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });

  it('Test EnableWorkflow', async () => {
    const response = OctokitResponseBuilder.getResponse(StatusCodes.NO_CONTENT, '', undefined);
    octokitMock.request.mockImplementation(() => Promise.resolve(response));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.EnableWorkflow('me', 'repo', 2000)).resolves.toBe(StatusCodes.NO_CONTENT);
  });

  it('Test EnableWorkflow -> 404', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.NOT_FOUND,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/enable',
        status: StatusCodes.NOT_FOUND,
        headers: undefined,
        data: {
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest/reference/actions#enable-a-workflow',
        },
      },
      request: {
        method: 'PUT',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/enable',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.EnableWorkflow('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 404 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/enable failed! See https://docs.github.com/rest/reference/actions#enable-a-workflow',
      name: 'GithubClientError',
    });
  });

  it('Test GetWorkflowUsage -> 401', async () => {
    const error: GithubError = {
      name: 'HttpError',
      status: StatusCodes.UNAUTHORIZED,
      response: {
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/enable',
        status: StatusCodes.UNAUTHORIZED,
        headers: undefined,
        data: {
          message: 'Bad Request',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
      request: {
        method: 'GET',
        url: 'https://api.github.com/repos/me/repo/actions/workflows/2000/enable',
        headers: {
          accept: 'application/vnd.github.v3+json',
          'user-agent': 'octokit.js/2.0.14 octokit-core.js/4.2.0 Node.js/18.14.0 (win32; x64)',
          'x-github-api-version': '2022-11-28',
          authorization: 'token [REDACTED]',
        },
        request: undefined,
      },
    };
    octokitMock.request.mockImplementation(() => Promise.reject(error));
    const githubWorkflow = new GithubWorkflow(octokitMock, apiVersion, logger, errorHandler);
    await expect(githubWorkflow.EnableWorkflow('me', 'repo', 2000)).rejects.toEqual({
      message: 'HttpStatusCode: 401 The request to https://api.github.com/repos/me/repo/actions/workflows/2000/enable failed! See https://docs.github.com/rest',
      name: 'GithubClientError',
    });
  });
});
