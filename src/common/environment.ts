const processEnv = process.env as Record<string, string>;

export const environment: Record<string, string> = {
  alertTopicArn: processEnv.alertTopicArn || 'alert-topic',
  debug: processEnv.debug || 'false',
  example: processEnv.example || 'William',
  stage: processEnv.stage || 'dev',
};
