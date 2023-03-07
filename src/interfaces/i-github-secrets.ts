import { components } from '@octokit/openapi-types';

export interface IGithubSecret {
  /**
   * Create or update a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  CreateOrUpdateSecret(owner: string, repo: string, secretName: string, secretValue: string): Promise<number>;

  /**
   *  Gets a repository secret, but no value!
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  GetRepositorySecret(owner: string, repo: string, secretName: string): Promise<components['schemas']['actions-secret']>;

  /**
   * Deletes a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  DeleteRepositorySecret(owner: string, repo: string, secretName: string): Promise<number>;

  /**
   * List all repository secrets
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns A list of all secrets
   */
  ListRepositorySecrets(owner: string, repo: string): Promise<components['schemas']['actions-secret'][]>;
}
