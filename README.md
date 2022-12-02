# Service Starter

- [Structure](#structure)
- [Service](#service)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Commands](#commands)

# Structure

```text
/__mocks__
/__tests__
    /common - shared test utilities
    /integration - tests for events/routes
    /unit - tests for lib and events/routes individual functions
/config - AWS resources and common serverless.yml
/scripts - project scripts
/src
    /common - shared code (const, types, schemas and utilities)
    /events - non-apig events (dynamodb, sqs)
    /internal - non-event lambdas (custom)
        /reply-goodbye
    /routes - apig events
        /get-hello-world (authenticated)
    serverless.yml - service serverless.yml
```

# Service

## Setup

### 1. Repository (replace _new-service_ with the service name)

1. [Create _new-service_ repository under Fidel](https://github.com/organizations/FidelLimited/repositories/new) following [this guide](https://fidel.atlassian.net/wiki/spaces/CGC/pages/285081615/Setting+the+Github+repository)
2. Create _new-service_ local repository with `service-starter` as `origin-starter`:

```sh
mkdir new-service && cd new-service
git clone git@github.com:FidelLimited/service-starter.git .
git remote add origin-starter git@github.com:FidelLimited/service-starter.git
git remote set-url origin git@github.com:FidelLimited/new-service.git
```

### 2. Install dependencies

```sh
npm ci
```

### 3. Configure the service

1. [**CODEOWNERS**](.github/CODEOWNERS): update file with the correct team owning the repository
2. Rename service-starter reference to current directory name`npm run-script init:rename-service <NAME> '<DESCRIPTION>'`
3. [**Resources**](config/resources.yml): refactor `config/resources.yml` with service resources
4. **CloudFormation**:
   1. update service name in `config/codebuild.yml` to the same name as `package.json`
   2. [create a new stack](https://eu-west-1.console.aws.amazon.com/cloudformation/home#/stacks/new) by uploading `config/codebuild.yml`
      1. set service name parameter the same as `package.json`
      2. set stage parameter
      3. set any other necessary parameters (if applicable)
5. [**Source**](src): add/refactor lambdas to `serverless.yml` from `src/events` and `src/routes`

## Information

- Name: `npm run service:name`
- Version: `npm run service:version`

## Update from Service Starter

```sh
git pull origin-starter master --no-ff --no-rebase
```

## Update Lambda Runtime

1. Update [package.json](package.json#L14-L17) `engines.node` and `engines.npm` properties
2. Update [config/serverless.yml](config/serverless.yml#L21) `provider.runtime` property
3. Update [.github/workflows/unit-test.yml](.github/workflows/unit-test.yml#L15) `node-version` property

# Documentation

Service documentation can be found in Confluence.

# Contributing

Read the [Contributing Document](CONTRIBUTING.md) for contribution guidelines.

# Commands

## Check Node/NPM Versions

Use this command to check local Node and NPM versions match expected versions set in `package.json`.

- `npm run check:engines`

## Lint

- Lint: `npm run lint`
- Fix: `npm run lint:fix`

## Test

- Tests: `npm run test`
- Tests watch changes: `npm run test:watch`
- Tests with coverage: `npm run test:coverage`
- Tests with no cache: `npm run test:nocache`

## Local Server

- Dev Stage: `npm run start`
- Other Stage: `npm run start -- -s otherStage`

## Invoke: _function `-f` parameter required_

- Dev Stage: `npm run invoke -- -f replyGoodbye`
- Other Stage: `npm run invoke -- -s otherStage -f replyGoodbye`

## Package

- Dev Stage: `npm run package`
- Other Stage: `npm run package -- -s otherStage`

## Deploy

- Dev Stage: `npm run deploy`
- Other Stage: `npm run deploy -- -s otherStage`

## Remove

- Dev Stage: `npm run remove`
- Other Stage: `npm run remove -- -s otherStage`

## Deploy in AWS account

Use the Cloudformation script `config/codebuild.yml` to create a new Cloudformation stack and create the necessary
CodePipeline/CodeBuild infrastructure.

To avoid naming conflicts, the stack name should be set to `{service-name}-{stage}-pipeline`. Most parameters are self-explanatory, however keep in mind the following notes:

- `GitHubAutoDetectChanges`: To avoid unnecessary builds on personal accounts only set to `true` when necessary.
- `DefaultAlertEmailParam`: Set the value to the appropriate team or individual email address. Only leave the default value when the service is company-wide.
- `Monitoring`: Set the value to `true` to create monitoring dashboards depending on the service configuration `monitoring.json`.
