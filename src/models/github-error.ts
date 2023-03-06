import { StatusCodes } from 'http-status-codes';

export type GithubError = {
  name: string;
  status: StatusCodes;
  response: {
    url: string;
    status: StatusCodes;
    headers: any;
    data: {
      message: string;
      documentation_url: string;
    };
  };
  request: {
    method: string;
    url: string;
    headers: any;
    request: any;
  };
};
