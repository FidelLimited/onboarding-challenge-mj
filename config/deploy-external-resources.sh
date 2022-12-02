npm run deploy:resources -- -c --stackName $SERVICE_NAME-$STAGE-external-resources \
--templateFileLocation config/external-resources.yml \
--capabilities NAMED_IAM \
-p StageParam=$STAGE \
-p ServiceParam=$SERVICE_NAME
