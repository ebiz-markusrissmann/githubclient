import { IActionsSecret } from './I-actions-secret';

export interface ISecretsResponse {
  total_count: number;
  secrets: IActionsSecret[];
}
