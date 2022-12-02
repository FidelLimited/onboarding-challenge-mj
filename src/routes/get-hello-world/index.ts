import { APIKeyCredentialType } from '@fidel.uk/credential';
import { apiHandler } from '@fidel.uk/handler';
import { Log } from '@fidel.uk/log';
import { Identity } from '@fidel.uk/types';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { EnvironmentSchema, environment } from '../../common';

export const EventSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: true,
  properties: { name: { type: 'string' } },
  required: [],
  type: 'object',
};

const reply = async (name: string, log: Log): Promise<{ reply: string }> => {
  log.info(`Name value is ${name}`);
  return { reply: `Hello World ${name}!` };
};

export const hello = (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const requestBody: { name?: string } = JSON.parse(event.body || '{}');

  return apiHandler<APIGatewayProxyEvent>({
    config: {
      APIDynamoDBTableName: {
        account: 'account',
        credential: 'credential',
        identity: 'identity',
        program: 'program',
        user: 'user',
        version: 'version',
      },
    },
    context,
    credentials: [APIKeyCredentialType.SK_TEST],
    environment: { payload: environment, schema: EnvironmentSchema },
    event,
    execute: (log: Log) => reply(requestBody.name || environment.example, log),
    input: { payload: event },
    roles: [Identity.Roles.ACCOUNT, Identity.Roles.MODERATOR],
  });
};
