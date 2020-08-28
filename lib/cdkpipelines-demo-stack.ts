import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';


export class CdkpipelinesDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     const handler = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda')),
    });

  }
}
