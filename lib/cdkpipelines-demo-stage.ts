import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { CdkpipelinesDemoStack } from './cdkpipelines-demo-stack';

/**
 * Deployable unit of lambda stack
 */
export class CdkpipelinesDemoStage extends Stage {
 
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const lambdaStack = new CdkpipelinesDemoStack(this, 'lambdaStack');
      
  }
}