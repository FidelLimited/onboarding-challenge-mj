import { Common } from '@fidel.uk/types';
import { APIGatewayProxyResult, Context } from 'aws-lambda';

export const Mocks = {
  createContext: (): Context => {
    return {
      awsRequestId: '7c11f22e-b808-11e8-90d7-354a599263ca',
      callbackWaitsForEmptyEventLoop: false,
      done: (): void => {},
      fail: (): void => {},
      functionName: 'dev-fidel-invokes-test-func',
      functionVersion: '$LATEST',
      getRemainingTimeInMillis: (): number => 1,
      invokedFunctionArn:
        'arn:aws:lambda:eu-west-1:738417869583:function:dev-fidel-test-func',
      logGroupName: '/aws/lambda/dev-fidel-invokes-test-func',
      logStreamName: '2018/09/14/[$LATEST]4c0d09a40b974ddf8dd7baf4e18861aa',
      memoryLimitInMB: '512',
      succeed: (): void => {},
    };
  },

  setEnvironment: (environment: Record<string, string>): void => {
    environment.alertTopicArn =
      'arn:aws:sns:eu-west-1:738417869583:alert-topic';
    environment.debug = 'false';
    environment.example = 'William';
    environment.stage = 'test';
  },
};

export const expectResponse = (
  response: APIGatewayProxyResult,
  statusCode: number,
  expectedResponseBody: Common.JsonObject,
): void => {
  expect(response.statusCode).toBe(statusCode);

  const responseBody = isEventBodyJson(response.body)
    ? JSON.parse(response.body)
    : response.body;
  expect(responseBody).toEqual(expect.objectContaining(expectedResponseBody));
};

const isEventBodyJson = (eventBody: string | null): boolean => {
  try {
    JSON.parse(eventBody || '');
    return true;
  } catch (error) {
    return false;
  }
};
