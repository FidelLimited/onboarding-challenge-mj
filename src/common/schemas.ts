export const EnvironmentSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: true,
  properties: {
    alertTopicArn: { type: 'string' },
    debug: { type: 'string' },
    example: { type: 'string' },
    stage: { type: 'string' },
  },
  required: ['alertTopicArn', 'debug', 'example', 'stage'],
  type: 'object',
};
