import { lambdaHandler } from '@fidel.uk/handler';
import { Log } from '@fidel.uk/log';
import { Context } from 'aws-lambda';

import { EnvironmentSchema, environment } from '../../common';

const reply = async (name: string): Promise<Record<string, string>> => {
  return { reply: `Goodbye ${name}!` };
};

export const goodbye = (
  event: Record<string, string>,
  context: Context,
): Promise<Record<string, string>> => {
  const log: Log = new Log(
    environment.stage,
    environment.alertTopicArn,
    context,
  );

  return lambdaHandler<Record<string, string>, Record<string, string>>({
    context,
    environment: {
      payload: environment,
      schema: EnvironmentSchema,
    },
    execute: () => reply(environment.example),
    input: {
      payload: event,
    },
    log,
  });
};
