npm run deploy:resources -- -c --stackName $SERVICE_NAME-$STAGE-integration \
--templateFileLocation config/integration.yml \
--capabilities NAMED_IAM \
-p StageParam=$STAGE \
-p ServiceParam=$SERVICE_NAME
