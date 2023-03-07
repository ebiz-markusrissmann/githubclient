import { components } from '@octokit/openapi-types/types';

export interface IGithubVariables {
  /**
   * List all repository variables identified by owner and repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns All variables of the repository
   */
  ListRepositoryVariables(owner: string, repo: string): Promise<components['schemas']['actions-variable'][]>;

  /**
   * Creates a new repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  CreateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number>;

  /**
   * Returns a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  GetRepositoryVariable(owner: string, repo: string, variableName: string): Promise<components['schemas']['actions-variable']>;

  /**
   * Checks if a specific repository variable exists
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  RepositoryVariableExists(owner: string, repo: string, variableName: string): Promise<boolean>;

  /**
   * Updates a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  UpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number>;

  /**
   *  Delete a specific repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns 204 if deleted
   */
  DeleteRepositoryVariable(owner: string, repo: string, variableName: string): Promise<number>;

  /**
   * Creates or updates a repository variable
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns 201 if successfull created, otherwise 204 if updated
   */
  CreateOrUpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number>;
}
