import { IActor } from './i-actor';
import { IHeadCommit } from './i-head-commit';
import { IHeadRepository } from './i-head-repository';
import { IPullRequest } from './i-pull-request';
import { IRepository } from './i-repository';

export interface IWorkflowRun {
  id: number;
  name?: string | null | undefined;
  node_id: string;
  check_suite_id?: number | undefined;
  check_suite_node_id?: string | undefined;
  head_branch?: string | null;
  head_sha?: string;
  run_number?: number;
  event?: string;
  status?: string | null;
  conclusion?: string | null;
  workflow_id?: number;
  url?: string;
  html_url?: string;
  pull_requests?: IPullRequest[] | null | undefined;
  created_at?: string;
  updated_at?: string;
  actor?: IActor | undefined;
  run_attempt?: number | undefined;
  run_started_at?: string | null | undefined;
  triggering_actor?: IActor | undefined;
  jobs_url?: string;
  logs_url?: string;
  check_suite_url?: string;
  artifacts_url?: string;
  cancel_url?: string;
  rerun_url?: string;
  workflow_url?: string;
  head_commit?: IHeadCommit | null | undefined;
  repository?: IRepository;
  head_repository?: IHeadRepository;
}
