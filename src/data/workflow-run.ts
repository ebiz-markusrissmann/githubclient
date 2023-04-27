import { IActor } from '../interfaces/responses/i-actor';
import { IHeadCommit } from '../interfaces/responses/i-head-commit';
import { IHeadRepository } from '../interfaces/responses/i-head-repository';
import { IPullRequest } from '../interfaces/responses/i-pull-request';
import { IRepository } from '../interfaces/responses/i-repository';
import { IWorkflowRun } from '../interfaces/responses/i-workflow-run';

export class WorkflowRun implements IWorkflowRun {
  id: number;
  name?: string | null | undefined;
  node_id: string;
  check_suite_id?: number | undefined;
  check_suite_node_id?: string | undefined;
  head_branch?: string | null;
  head_sha?: string;
  run_number: number;
  event: string;
  status: string | null;
  conclusion: string | null;
  workflow_id: number;
  url: string;
  html_url: string;
  pull_requests?: IPullRequest[] | null | undefined;
  created_at: string;
  updated_at: string;
  actor?: IActor | undefined;
  run_attempt?: number | undefined;
  run_started_at?: string | null | undefined;
  triggering_actor?: IActor | undefined;
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  workflow_url: string;
  head_commit?: IHeadCommit | null | undefined;
  repository: IRepository;
  head_repository: IHeadRepository;

  constructor(
    id: number,
    name: string,
    node_id: string,
    check_suite_id: number,
    check_suite_node_id: string,
    head_branch: string,
    head_sha: string,
    run_number: number,
    event: string,
    status: string,
    conclusion: string | null,
    workflow_id: number,
    url: string,
    html_url: string,
    pull_requests: any[],
    created_at: string,
    updated_at: string,
    actor: IActor,
    run_attempt: number,
    run_started_at: string,
    triggering_actor: IActor,
    jobs_url: string,
    logs_url: string,
    check_suite_url: string,
    artifacts_url: string,
    cancel_url: string,
    rerun_url: string,
    workflow_url: string,
    head_commit: IHeadCommit,
    repository: IRepository,
    head_repository: IHeadRepository,
  ) {
    this.id = id;
    this.name = name;
    this.node_id = node_id;
    this.check_suite_id = check_suite_id;
    this.check_suite_node_id = check_suite_node_id;
    this.head_branch = head_branch;
    this.head_sha = head_sha;
    this.run_number = run_number;
    this.event = event;
    this.status = status;
    this.conclusion = conclusion;
    this.workflow_id = workflow_id;
    this.url = url;
    this.html_url = html_url;
    this.pull_requests = pull_requests;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.actor = actor;
    this.run_attempt = run_attempt;
    this.run_started_at = run_started_at;
    this.triggering_actor = triggering_actor;
    this.jobs_url = jobs_url;
    this.logs_url = logs_url;
    this.check_suite_url = check_suite_url;
    this.artifacts_url = artifacts_url;
    this.cancel_url = cancel_url;
    this.rerun_url = rerun_url;
    this.workflow_url = workflow_url;
    this.head_commit = head_commit;
    this.repository = repository;
    this.head_repository = head_repository;
  }
}
