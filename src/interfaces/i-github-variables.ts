import { IActionsVariable } from './responses/i-actions-variable';

export interface IGithubVariables {

  /**
   * Lists all organization variables.
   * @param {string} org - The name of the organization
   * @returns All variables of the organization
   * @see https://docs.github.com/en/rest/reference/actions#list-organization-secrets
   */
  ListOrganizationVariables(org: string): Promise<IActionsVariable[]>;

  /**
   * Creates an organization variable that you can reference in a GitHub Actions workflow.
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  CreateOrganizationVariable(org: string, variableName: string, value: string): Promise<number>;

  /**
   * Gets a specific variable in an organization.
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  GetOrganizationVariable(org: string, variableName: string): Promise<IActionsVariable>;

  /**
   * Checks if a specific organization variable exists
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  OrganizationVariableExists(org: string, variableName: string): Promise<boolean>;

  /**
   * Updates a specific organization variable
   * @param {string} org - The name of the organization
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the organization variable
   * @returns
   */
  UpdateOrganizationVariable(org: string, variableName: string, value: string): Promise<number>;
  /**
   * List all repository variables identified by owner and repository
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns All variables of the repository
   */
  ListRepositoryVariables(owner: string, repo: string): Promise<IActionsVariable[]>;

  /**
   * Creates a repository variable that you can reference in a GitHub Actions workflow.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be created
   * @param {string} value - The value of the created variable
   * @returns 201, if created
   */
  CreateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number>;

  /**
   * Gets a specific variable in a repository.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns The environment variable
   */
  GetRepositoryVariable(owner: string, repo: string, variableName: string): Promise<IActionsVariable>;

  /**
   * Checks if a specific repository variable exists
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @returns true, if exists, otherwise false
   */
  RepositoryVariableExists(owner: string, repo: string, variableName: string): Promise<boolean>;

  /**
   * Updates a repository variable that you can reference in a GitHub Actions workflow.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} variableName - The name of the variable to be gathered
   * @param {string} value - The value of the repository variable
   * @returns
   */
  UpdateRepositoryVariable(owner: string, repo: string, variableName: string, value: string): Promise<number>;

  /**
   * Deletes a repository variable using the variable name.
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
