import { Logger } from 'winston';
import { GithubClientError } from '../interfaces/i-github-error';

export class ErrorHandler {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public handleError(err: any): never {
    this.logger.error(JSON.stringify(err));
    const error: GithubClientError = {
      message: `HttpStatusCode: ${err.status} The request to ${err.response.url} failed! See ${err.response.data.documentation_url}`,
      name: 'GithubClientError',
    };
    throw error;
  }
}
