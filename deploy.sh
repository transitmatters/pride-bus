#!/bin/bash -x

set -e

export AWS_PROFILE=transitmatters
export AWS_REGION=us-east-1
export AWS_DEFAULT_REGION=us-east-1
export AWS_PAGER=""

if [[ -z "$DD_API_KEY" || -z "$TM_PRIDEBUS_CERN_ARN" || -z "$TM_LABS_WILDCARD_CERT_ARN" || -z "$MBTA_V3_API_KEY" ]]; then
    echo "Must provide DD_API_KEY, TM_PRIDEBUS_CERN_ARN, TM_LABS_WILDCARD_CERT_ARN and MBTA_V3_API_KEY in environment" 1>&2
    exit 1
fi

STACK_NAME=pride-bus
CHALICE_STAGE=production

FRONTEND_HOSTNAME="pridebus.transitmatters.org"
FRONTEND_ZONE="pridebus.transitmatters.org"
FRONTEND_BUCKET="$FRONTEND_HOSTNAME"
FRONTEND_CERT_ARN="$TM_PRIDEBUS_CERN_ARN"

BACKEND_HOSTNAME="pride-bus-api.labs.transitmatters.org"
BACKEND_ZONE="labs.transitmatters.org"
BACKEND_BUCKET=pride-bus-backend
BACKEND_CERT_ARN="$TM_LABS_WILDCARD_CERT_ARN"

# Identify the version and commit of the current deploy
GIT_VERSION=`git describe --tags --always`
GIT_SHA=`git rev-parse HEAD`
echo "Deploying version $GIT_VERSION | $GIT_SHA"

# Adding some datadog tags to get better data
DD_TAGS="git.commit.sha:$GIT_SHA,git.repository_url:github.com/transitmatters/pride-bus"

npm run build

# Deploy to cloudformation
pushd server/ > /dev/null
poetry export --without-hashes --output requirements.txt
poetry run chalice package --stage $CHALICE_STAGE --merge-template cloudformation.json cfn/
aws cloudformation package --template-file cfn/sam.json --s3-bucket $BACKEND_BUCKET --output-template-file cfn/packaged.yaml
aws cloudformation deploy --template-file cfn/packaged.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --parameter-overrides \
    TMFrontendHostname=$FRONTEND_HOSTNAME \
    TMFrontendZone=$FRONTEND_ZONE \
    TMFrontendCertArn=$FRONTEND_CERT_ARN \
    TMBackendCertArn=$BACKEND_CERT_ARN \
    TMBackendHostname=$BACKEND_HOSTNAME \
    TMBackendZone=$BACKEND_ZONE \
    MbtaV3ApiKey=$MBTA_V3_API_KEY \
    DDApiKey=$DD_API_KEY \
    GitVersion=$GIT_VERSION \
    DDTags=$DD_TAGS

popd > /dev/null
aws s3 sync dist/ s3://$FRONTEND_BUCKET

# Grab the cloudfront ID and invalidate its cache
CLOUDFRONT_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items!=null] | [?contains(Aliases.Items, '$FRONTEND_HOSTNAME')].Id | [0]" --output text)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
