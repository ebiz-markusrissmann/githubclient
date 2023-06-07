import { Octokit } from 'octokit';
import { IGithubVariables } from './interfaces/i-github-variables';
import { IActionsVariable } from './interfaces/responses/i-actions-variable';
import { ErrorHandler } from './tools-utils/error-handler';

export class GithubVariables implements IGithubVariables {
  private octokit: Octokit;
  private apiVersion: string;

  private errorHandler: ErrorHandler;

  constructor(octokit: Octokit, apiVersion: string, errorhandler: ErrorHandler) {
    this.octokit = octokit;
    this.apiVersion = apiVersion;
    this.errorHandler = errorhandler;
  }

  /**
   * List all repository variables identified by owner and repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns All variables of the repository
   */
  public async ListRepositoryVariables(owner: string, repo: string): Promise<IActionsVariable[]> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/variables', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.data.variables;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
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
    try {
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
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Gets a specific variable in a repository.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  public async GetRepositoryVariable(owner: string, repo: string, variableName: string): Promise<IActionsVariable> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/variables/{name}', {
        owner: owner,
        repo: repo,
        name: variableName,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });
      return response.data;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Checks if a specific repository variable exists
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  /* istanbul ignore next */
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
    try {
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
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Creates or updates a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  /* istanbul ignore next */
  public async CreateOrUpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number> {
    try {
      if (await this.RepositoryVariableExists(owner, repo, variableName)) {
        return await this.UpdateRepositoryVariable(owner, repo, variableName, value);
      } else {
        return await this.CreateRepositoryVariable(owner, repo, variableName, value);
      }
    } catch (err: any) {
      this.errorHandler.handleError(err);
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
    try {
      const response = await this.octokit.request('DELETE /repos/{owner}/{repo}/actions/variables/{name}', {
        owner: owner,
        repo: repo,
        name: variableName,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /** List variables for an organization
   *  @param {string} org - The name of the organization
   * @returns All variables of the organization
   *
   */

  async ListOrganizationVariables(org: string): Promise<IActionsVariable[]> {
    try {
      const response = await this.octokit.request('GET /orgs/{org}/actions/variables', {
        org: org,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.data.variables;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /** Create an organization variable
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   *
   */
  async CreateOrganizationVariable(org: string, variableName: string, value: string): Promise<number> {
    try {
      const response = await this.octokit.request('POST /orgs/{org}/actions/variables', {
        org: org,
        name: variableName,
        value: value,
        visibility: 'all',
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /** Get an organization variable
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  async GetOrganizationVariable(org: string, variableName: string): Promise<IActionsVariable> {
    try {
      const response = await this.octokit.request('GET /orgs/{org}/actions/variables/{name}', {
        org: org,
        name: variableName,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });
      return response.data;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /** Checks if a specific organization variable exists
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  async OrganizationVariableExists(org: string, variableName: string): Promise<boolean> {
    try {
      await this.octokit.request('GET /orgs/{org}/actions/variables/{name}', {
        org: org,
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

  /** Updates an organization variable that you can reference in a GitHub Actions workflow.
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns 200, if updated
   */
  async UpdateOrganizationVariable(org: string, variableName: string, value: string): Promise<number> {
    try {
      const response = await this.octokit.request('PATCH /orgs/{org}/actions/variables/{name}', {
        org: org,
        name: variableName,
        value: value,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });
      return response.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }
}
