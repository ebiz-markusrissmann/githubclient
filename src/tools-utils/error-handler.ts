import { GithubClientError } from '../interfaces/i-github-error';

export class ErrorHandler {
  constructor() {}

  public handleError(err: any): never {
    console.error(JSON.stringify(err));
    const error: GithubClientError = {
      message: `HttpStatusCode: ${err.status} The request to ${err.response.url} failed! See ${err.response.data.documentation_url}`,
      name: 'GithubClientError',
    };
    throw error;
  }
}
