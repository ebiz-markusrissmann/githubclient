import { components } from '@octokit/openapi-types';
import { Octokit } from 'octokit';
import { IGithubVariables } from './interfaces/i-github-variables';

export class GithubVariables implements IGithubVariables {
  private octokit: Octokit;
  private apiVersion: string;

  constructor(octokit: Octokit, apiVersion: string) {
    this.octokit = octokit;
    this.apiVersion = apiVersion;
  }

  /**
   * List all repository variables identified by owner and repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns All variables of the repository
   */
  public async ListRepositoryVariables(owner: string, repo: string): Promise<components['schemas']['actions-variable'][]> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/variables', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.data.variables;
  }

  /**
   * Creates a repository variable that you can reference in a GitHub Actions workflow
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  public async CreateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    const response = await this.octokit.request('POST /repos/{owner}/{repo}/actions/variables', {
      owner: owner,
      repo: repo,
      name: variableName,
      value: value,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.status;
  }

  /**
   * Gets a specific variable in a repository.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  public async GetRepositoryVariable(owner: string, repo: string, variableName: string): Promise<components['schemas']['actions-variable']> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/variables/{name}', {
      owner: owner,
      repo: repo,
      name: variableName,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });
    return response.data;
  }

  /**
   * Checks if a specific repository variable exists
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  public async RepositoryVariableExists(owner: string, repo: string, variableName: string): Promise<boolean> {
    try {
      await this.octokit.request('GET /repos/{owner}/{repo}/actions/variables/{name}', {
        owner: owner,
        repo: repo,
        name: variableName,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return true;
    } catch (err: any) {
      return false;
    }
  }

  /**
   * Updates a repository variable that you can reference in a GitHub Actions workflow.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  public async UpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    const response = await this.octokit.request('PATCH /repos/{owner}/{repo}/actions/variables/{name}', {
      owner: owner,
      repo: repo,
      name: variableName,
      value: value,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.status;
  }

  /**
   * Creates or updates a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  public async CreateOrUpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    if (await this.RepositoryVariableExists(owner, repo, variableName)) {
      return this.UpdateRepositoryVariable(owner, repo, variableName, value);
    } else {
      return this.CreateRepositoryVariable(owner, repo, variableName, value);
    }
  }

  /**
   * Deletes a repository variable using the variable name.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns 204 if deleted
   */
  public async DeleteRepositoryVariable(owner: string, repo: string, variableName: string): Promise<number> {
    const response = await this.octokit.request('DELETE /repos/{owner}/{repo}/actions/variables/{name}', {
      owner: owner,
      repo: repo,
      name: variableName,
      headers: {
        'X-GitHub-Api-Version': this.apiVersion,
      },
    });

    return response.status;
  }
}
