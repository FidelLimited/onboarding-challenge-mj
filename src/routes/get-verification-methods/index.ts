import { APIKeyCredentialType } from '@fidel.uk/credential';
import { APIGatewayHandlerEvent, apiHandler } from '@fidel.uk/handler';
import { Log } from '@fidel.uk/log';
import { Identity } from '@fidel.uk/types';
import { JsonObject } from '@fidel.uk/types/lib/common';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { EnvironmentSchema, environment } from '../../common';
import {
  CardInfo,
  IdentityWithAccountName,
} from '../../domain/entities/common-types';
import { ListCardVerificationMethodsService } from '../../services/list-card-verification-methods-service';

export const EventSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: true,
  properties: { name: { type: 'string' } },
  required: [],
  type: 'object',
};

const getVerificationMethods = async (
  log: Log,
  event: APIGatewayHandlerEvent,
  identity: IdentityWithAccountName,
): Promise<JsonObject> => {
  try {
    const cardData: CardInfo = JSON.parse(JSON.stringify(event.body));

    log.info(`Received event ${JSON.stringify(event)}`);
    log.info(
      `Listing verification methods from card with mapId: ${cardData.mapId}`,
    );

    const listVerificationDataService = new ListCardVerificationMethodsService(
      log,
    );
    const cardVerificationData = await listVerificationDataService.execute(
      cardData,
      identity,
    );

    return {
      items: cardVerificationData,
      status: 200,
    };
  } catch (error) {
    log.error(`An error occurred: ${error}`);
    throw error;
  }
};

export const handler = (
  event: APIGatewayHandlerEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  return apiHandler<APIGatewayEvent>({
    config: {
      APIDynamoDBTableName: {
        account: 'account',
        credential: 'credential',
        identity: 'identity',
        program: 'program',
        user: 'user',
        version: 'version',
      },
      identityOptions: {
        accountProjection: ['name'],
      },
    },
    context,
    credentials: [APIKeyCredentialType.SK_TEST],
    environment: { payload: environment, schema: EnvironmentSchema },
    event,
    execute: (
      log: Log,
      handlerEvent: APIGatewayHandlerEvent,
      identity: Identity.Identity,
    ) =>
      getVerificationMethods(
        log,
        handlerEvent,
        identity as IdentityWithAccountName,
      ),
    input: { payload: event },
    roles: [Identity.Roles.ACCOUNT, Identity.Roles.MODERATOR],
  });
};
