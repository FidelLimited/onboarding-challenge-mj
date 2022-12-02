import { Context } from 'aws-lambda';

import { environment } from '../../../../src/common/environment';
import { goodbye } from '../../../../src/internal/reply-goodbye';
import { Mocks } from '../../../common';

jest.mock('@fidel.uk/log');

describe('Events - Reply Goodbye', (): void => {
  let contextMock: Context;

  beforeEach((): void => {
    Mocks.setEnvironment(environment);
    contextMock = Mocks.createContext();
  });

  afterEach((): void => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test.each(['alertTopicArn', 'stage', 'debug', 'example'])(
    'should return error when %s is not specified on the environment',
    async (propEnv: string) => {
      delete environment[propEnv];

      await expect(goodbye({}, contextMock)).rejects.toThrowError(
        'Invalid configuration variables',
      );
    },
  );

  test('should return Goodbye message', async (): Promise<void> => {
    const response: Record<string, string> = await goodbye({}, contextMock);
    expect(response).toEqual({ reply: 'Goodbye William!' });
  });
});
