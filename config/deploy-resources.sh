npm run deploy:resources -- -c --stackName $SERVICE_NAME-$STAGE-resources \
--templateFileLocation config/resources.yml \
--capabilities NAMED_IAM \
-p StageParam=$STAGE \
-p ServiceParam=$SERVICE_NAME \
-p AlertTopicARNParam=$ALERT_TOPIC_ARN_PARAM \
-p DefaultAlertEmailParam=$DEFAULT_ALERT_EMAIL
