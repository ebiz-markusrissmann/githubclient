export interface IPullRequest {
  id: number;
  number: number;
  url: string;
  head: {
    ref: string;
    sha: string;
    repo: {
      id: number;
      url: string;
      name: string;
    };
  };
  base: {
    ref: string;
    sha: string;
    repo: {
      id: number;
      url: string;
      name: string;
    };
  };
}
