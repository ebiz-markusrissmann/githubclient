import { OctokitResponse, ResponseHeaders } from '@octokit/types';

export class OctokitResponseBuilder {
  public static getResponse<T, S extends number>(status: S, url: string, data: T): OctokitResponse<T, S> {
    const responseHeaders: ResponseHeaders = {};

    const response: OctokitResponse<T, S> = {
      headers: responseHeaders,
      status: status,
      url: url,
      data: data,
    };

    return response;
  }
}
