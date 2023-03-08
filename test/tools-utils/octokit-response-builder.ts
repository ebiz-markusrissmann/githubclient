import { components } from '@octokit/openapi-types';
import { OctokitResponse, ResponseHeaders } from '@octokit/types';
import { Workflow } from '@octokit/webhooks-types';

export class OctokitResponseBuilder {
  public static getResponse<T, S extends number>(status: S, url: string, data: T, headers?: ResponseHeaders): OctokitResponse<T, S> {
    const responseHeaders: ResponseHeaders = {};

    const response: OctokitResponse<T, S> = {
      headers: headers ?? responseHeaders,
      status: status,
      url: url,
      data: data,
    };

    return response;
  }
}

export type ListRepositoryVariablesResponse = {
  total_count: number;
  variables: components['schemas']['actions-variable'][];
};

export type ListWorkflowResponse = {
  total_count: number;
  workflows: Workflow[];
};

export type ListWorkflowRunsResponse = {
  total_count: number;
  workflow_runs: components['schemas']['workflow-run'][];
};
