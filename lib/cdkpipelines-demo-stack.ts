import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';


export class CdkpipelinesDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const lambdaRole = new iam.Role(this, "lambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "role assumed by lambda function",
    })

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        "ec2:InvokeFunction",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:CreateSecurityGroup",
        "ec2:Describe*"
      ],
    }));

    const revokeSGRuleLambda = new lambda.Function(this, 'RevokeSGRuleLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'revoke_sg_rule.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda')),
      role: lambdaRole
    });


    new events.Rule(this, 'sgEvents', {
      description: "events associated with ec2 sg",
      enabled: true,
      ruleName: "SG_CREATE_MODIFY",
      targets: [new targets.LambdaFunction(revokeSGRuleLambda)],
      eventPattern: {
        "source": [
          "aws.ec2"
        ],
        "detailType": [
          "AWS API Call via CloudTrail"
        ],
        "detail": {
          "eventSource": [
            "ec2.amazonaws.com"
          ],
          "eventName": [
            "AuthorizeSecurityGroupIngress",
            "AuthorizeSecurityGroupEgress",
            "RevokeSecurityGroupIngress",
            "RevokeSecurityGroupEgress",
            "CreateSecurityGroup"
          ]
        }
      }
    })


  }
}
