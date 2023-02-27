import { Octokit } from 'octokit';
import { githubSecret } from './models/secret';
import { base64_variants, crypto_box_seal, from_base64, from_string, ready, to_base64 } from 'libsodium-wrappers';
import { IGithubSecret } from './interfaces/i-github-secrets';

export class GithubSecrets implements IGithubSecret {
  private octokit: Octokit;

  constructor(octokit: Octokit) {
    this.octokit = octokit;
  }

  /**
   * List all repository secrets
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @returns A list of all secrets
   */
  public async ListRepositorySecrets(owner: string, repo: string): Promise<githubSecret[]> {
    const retVal: githubSecret[] = [];
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    response.data.secrets.forEach((secret) => {
      retVal.push(secret);
    });

    return retVal;
  }

  /**
   *  Gets a repository secret, but no value!
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns The secret itself without value
   */
  public async GetRepositorySecret(owner: string, repo: string, secretName: string): Promise<githubSecret | undefined> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: owner,
      repo: repo,
      secret_name: secretName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return response.data;
  }

  /**
   * Create or update a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @param {string} secretValue - The plan text value of the secret
   * @returns 204, if successful
   */
  public async CreateOrUpdateSecret(owner: string, repo: string, secretName: string, secretValue: string): Promise<number> {
    let responseStatus: number = -1;
    await ready
      .then(async () => {
        const keyResponse = await this.octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
          owner: owner,
          repo: repo,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        // Convert Secret & Base64 key to Uint8Array.
        let binkey = from_base64(keyResponse.data.key, base64_variants.ORIGINAL);
        let binsec = from_string(secretValue);

        //Encrypt the secret using LibSodium
        let encBytes = crypto_box_seal(binsec, binkey);

        // Convert encrypted Uint8Array to Base64
        let output = to_base64(encBytes, base64_variants.ORIGINAL);

        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
          owner: owner,
          repo: repo,
          secret_name: secretName,
          encrypted_value: output,
          key_id: keyResponse.data.key_id,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        console.log(output);

        responseStatus = response.status;
      })
      .catch((err: any) => {
        console.error(err.message);
      });

    return responseStatus;
  }

  /**
   * Deletes a repository secret
   * @param {string} owner - The owner of the repository
   * @param {string} repo - The name of the repository
   * @param {string} secretName - The name of the secret
   * @returns 204, if successful
   */
  public async DeleteRepositorySecret(owner: string, repo: string, secretName: string): Promise<number> {
    const result = await this.octokit.request('DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: owner,
      repo: repo,
      secret_name: secretName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return result.status;
  }
}
