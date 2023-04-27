import { faker } from '@faker-js/faker';
import { IActionsPublicKey } from '../../src/interfaces/responses/i-actions-public-key';

export function createFakeActionsPublicKey(): IActionsPublicKey {
  const actionsPublicKey: IActionsPublicKey = {
    key_id: faker.datatype.uuid(),
    key: faker.random.alphaNumeric(32),
    id: faker.datatype.number(),
    url: faker.internet.url(),
    title: faker.random.words(),
    created_at: faker.date.past().toISOString(),
  };

  return actionsPublicKey;
}
