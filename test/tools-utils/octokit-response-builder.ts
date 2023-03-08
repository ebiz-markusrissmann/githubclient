import { OctokitResponse, ResponseHeaders } from '@octokit/types';
import { Workflow } from '@octokit/webhooks-types';
import { components } from '@octokit/openapi-types';

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

export type ListWorkflowResponse = {
  total_count: number;
  workflows: Workflow[];
};

export type ListWorkflowRunsResponse = {
  total_count: number;
  workflow_runs: components['schemas']['workflow-run'][];
};
