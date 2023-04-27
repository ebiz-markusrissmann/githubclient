import { faker } from '@faker-js/faker';

import { IActionsSecret } from '../../src/interfaces/responses/I-actions-secret';

export function createFakeActionsSecret(): IActionsSecret {
  const actionsSecret: IActionsSecret = {
    name: faker.lorem.word(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  };

  return actionsSecret;
}
