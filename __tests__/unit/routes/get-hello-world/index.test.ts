import { verifyAccess } from '@fidel.uk/handler/lib/verify-access';
import { Log } from '@fidel.uk/log';
import createEvent from '@serverless/event-mocks';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { environment } from '../../../../src/common';
import { hello } from '../../../../src/routes/get-hello-world';
import { Mocks, expectResponse } from '../../../common';

jest.mock('@fidel.uk/handler/lib/verify-access');
jest.mock('@fidel.uk/log');

describe('Routes - Hello World', (): void => {
  let eventMock: APIGatewayProxyEvent;
  let contextMock: Context;

  beforeEach((): void => {
    Mocks.setEnvironment(environment);

    eventMock = createEvent('aws:apiGateway', {
      headers: {
        'Content-Type': 'application/json',
      } as APIGatewayProxyEventHeaders,
      httpMethod: 'PATCH',
      path: 'RESOURCE_PATH',
      requestContext: { requestTimeEpoch: Date.now() },
    } as APIGatewayProxyEvent) as APIGatewayProxyEvent;

    contextMock = Mocks.createContext();

    (verifyAccess as jest.Mock).mockResolvedValue({
      identity: { liveActive: 1, permission: { accountId: 'ACCOUNT_ID' } },
    });
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test.each(['alertTopicArn', 'debug', 'example', 'stage'])(
    'should return error when %s is not specified on the environment',
    async (propEnv: string) => {
      delete environment[propEnv];

      const response: APIGatewayProxyResult = await hello(
        eventMock,
        contextMock,
      );

      expectResponse(response, 500, {
        error: expect.objectContaining({
          code: 'environment-schema',
          message: 'Invalid configuration variables',
        }),
      });
    },
  );

  test('should return Hello World Superman message', async (): Promise<void> => {
    eventMock.body = JSON.stringify({
      name: 'Superman',
    });

    const response: APIGatewayProxyResult = await hello(eventMock, contextMock);

    expectResponse(response, 200, { reply: 'Hello World Superman!' });
    expect(Log.prototype.info).toHaveBeenCalledWith('Name value is Superman');
  });

  test.each([{}, { otherVar: 'value' }])(
    'should return Hello World William message when request is %j',
    async (eventBody): Promise<void> => {
      eventMock.body = JSON.stringify(eventBody);

      const response: APIGatewayProxyResult = await hello(
        eventMock,
        contextMock,
      );

      expectResponse(response, 200, { reply: 'Hello World William!' });
      expect(Log.prototype.info).toHaveBeenCalledWith('Name value is William');
    },
  );
});
