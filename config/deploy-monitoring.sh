#!/bin/bash
echo Monitoring enabled: "$MONITORING"

BUCKET_NAME="service-monitoring-$STAGE-$AWS_ACCOUNT_ID-$AWS_REGION-monitoring-files"

if $MONITORING -eq true
then
  echo "Validating monitoring.json contents"
  npm run check:monitoring
  echo "Contents are valid"
  echo "Storing monitoring.json file to S3 Bucket $BUCKET_NAME, folder $SERVICE_NAME (if changed)"
  aws s3 sync monitoring s3://$BUCKET_NAME/$SERVICE_NAME --include "monitoring.json" --delete --size-only
  echo "Storing operation complete"
else
  echo "Deleting monitoring.json file and parent folder (if exists)"
  aws s3 rm s3://$BUCKET_NAME/$SERVICE_NAME --recursive
  echo "Deletion operation complete"
fi
