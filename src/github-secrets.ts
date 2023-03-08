import { components } from '@octokit/openapi-types';
import { base64_variants, crypto_box_seal, from_base64, from_string, ready, to_base64 } from 'libsodium-wrappers';
import { Octokit } from 'octokit';
import { Logger } from 'winston';
import { IGithubSecret } from './interfaces/i-github-secrets';
import { ErrorHandler } from './tools-utils/error-handler';

export class GithubSecrets implements IGithubSecret {
  private octokit: Octokit;
  private apiVersion: string;
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor(octokit: Octokit, apiVersion: string, logger: Logger, errorHandler: ErrorHandler) {
    this.octokit = octokit;
    this.apiVersion = apiVersion;
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Lists all secrets available in a repository without revealing their encrypted values.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns A list of all secrets
   */
  public async ListRepositorySecrets(owner: string, repo: string): Promise<components['schemas']['actions-secret'][]> {
    this.logger.debug('Execute ListRepositorySecrets');
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
        owner: owner,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      return response.data.secrets;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Gets a single repository secret without revealing its encrypted value.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  public async GetRepositorySecret(owner: string, repo: string, secretName: string): Promise<components['schemas']['actions-secret']> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: owner,
        repo: repo,
        secret_name: secretName,
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
   * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns
   */
  async GetPublicKey(owner: string, repo: string): Promise<components['schemas']['actions-public-key']> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: owner,
        repo: repo,
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
   * Creates or updates a repository secret with an encrypted value. Encrypt your secret using LibSodium.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  /* istanbul ignore next */
  public async CreateOrUpdateSecret(owner: string, repo: string, secretName: string, secretValue: string): Promise<number> {
    await ready;

    const publicKey = await this.GetPublicKey(owner, repo);
    let binkey: Uint8Array;
    let binsec: Uint8Array;
    let encBytes: Uint8Array;
    let output: string = '';

    // Convert Secret & Base64 key to Uint8Array.
    binkey = from_base64(publicKey.key, base64_variants.ORIGINAL);
    binsec = from_string(secretValue);
    //Encrypt the secret using LibSodium
    encBytes = crypto_box_seal(binsec, binkey);
    // Convert encrypted Uint8Array to Base64
    output = to_base64(encBytes, base64_variants.ORIGINAL);

    try {
      const postResponse = await this.octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: owner,
        repo: repo,
        secret_name: secretName,
        encrypted_value: output,
        key_id: publicKey.key_id,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });

      /* istanbul ignore next */
      return postResponse.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }

  /**
   * Deletes a secret in a repository using the secret name.
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  public async DeleteRepositorySecret(owner: string, repo: string, secretName: string): Promise<number> {
    try {
      const result = await this.octokit.request('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: owner,
        repo: repo,
        secret_name: secretName,
        headers: {
          'X-GitHub-Api-Version': this.apiVersion,
        },
      });
      return result.status;
    } catch (err: any) {
      this.errorHandler.handleError(err);
    }
  }
}
