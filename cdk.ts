import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Stack, App } from 'aws-cdk-lib';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import 'dotenv/config';

const app = new App();
const stack = new Stack(app, 'CartServiceStack', {
  env: { region: 'eu-west-1' },
});

const lambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.AWS_REGION as string,
  },
};

const nestJsCartLambda = new NodejsFunction(stack, 'NestJsCartLambda', {
  ...lambdaProps,
  entry: 'dist/main.js',
  functionName: 'nestJsCartLambda',
});

const api = new apiGateway.HttpApi(stack, 'CartServiceApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowMethods: [
      apiGateway.CorsHttpMethod.OPTIONS,
      apiGateway.CorsHttpMethod.GET,
      apiGateway.CorsHttpMethod.POST,
      apiGateway.CorsHttpMethod.PUT,
      apiGateway.CorsHttpMethod.PATCH,
      apiGateway.CorsHttpMethod.DELETE,
    ],
    allowOrigins: ['*'],
  },
  defaultIntegration: new HttpLambdaIntegration(
    'LambdaIntegration',
    nestJsCartLambda,
  ),
});

new cdk.CfnOutput(stack, 'ApiUrl', {
  value: `${api.url}`,
});
