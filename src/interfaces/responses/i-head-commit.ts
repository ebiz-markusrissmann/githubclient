import { ICommitAuthor } from './i-commit-author';
import { ICommitter } from './i-committer';

export interface IHeadCommit {
  id: string;
  tree_id: string;
  message: string;
  timestamp: string;
  author?: ICommitAuthor | null | undefined;
  committer: ICommitter | null | undefined;
}
