import { components } from '@octokit/openapi-types/types';

export interface IGithubClient {
  /**
   * Get all workflows of a specific repository and a specific owner
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  ListWorkflows(owner: string, repo: string): Promise<components['schemas']['workflow'][]>;

  /**
   * Gets all infos to a specific workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @returns The requested workflow, if not found undefined
   */
  GetWorkflow(owner: string, repo: string, workflowName: string): Promise<components['schemas']['workflow'] | undefined>;

  /**
   *
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} workflowName - The name of the workflow to trigger
   * @param {string} branch - The name of the branch from which the code is to be taken
   */
  TriggerWorkflow(owner: string, repo: string, workflowName: string, branch: string): Promise<void>;
}
