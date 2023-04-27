import { IActionsVariable } from '../../src/interfaces/responses/i-actions-variable';
import { faker } from '@faker-js/faker';

export function createActionsVariable(): IActionsVariable {
  return {
    name: faker.random.word(),
    value: faker.random.word(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  };
}
