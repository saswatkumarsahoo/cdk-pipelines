import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';


export class CdkpipelinesDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

     const revokeSGRuleLambda = new lambda.Function(this, 'RevokeSGRuleLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'revoke_sg_rule.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda')),
    });

  }
}
