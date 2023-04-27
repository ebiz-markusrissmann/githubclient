import { IWorkflow } from '../interfaces/responses/i-workflow-response';

export class Workflow implements IWorkflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: 'active' | 'deleted' | 'disabled_fork' | 'disabled_inactivity' | 'disabled_manually';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
  deleted_at?: string;

  constructor(data: IWorkflow) {
    this.id = data.id;
    this.node_id = data.node_id;
    this.name = data.name;
    this.path = data.path;
    this.state = data.state;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.url = data.url;
    this.html_url = data.html_url;
    this.badge_url = data.badge_url;
    this.deleted_at = data.deleted_at;
  }
}
