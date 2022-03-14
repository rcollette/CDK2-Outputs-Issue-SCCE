import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Cluster, ContainerImage, ScalableTaskCount } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Vpc } from "aws-cdk-lib/aws-ec2";

export interface IFargateStackBaseProps extends StackProps{
  /**
   * The environment variable values that will be set for the service.
   */
  environment: { [key: string]: string };
}

export class FargateStackBase<T extends IFargateStackBaseProps> extends Stack {
  public vpc: Vpc;
  public cluster: Cluster;
  public loadBalancedFargateService: ApplicationLoadBalancedFargateService;
  public scalableTarget: ScalableTaskCount;

  constructor(
    scope: Construct,
    id: string,
    private _parameterStackBaseProps: T
  ) {
    super(scope, id, _parameterStackBaseProps);
    this._createVpc();
    this._createCluster();
    this._createService();
  }

  private _createVpc() {
    this.vpc = new Vpc(this, `temp-vpc`, {
      maxAzs: 1,
    });
  }

  private _createCluster(): void {
    this.cluster = new Cluster(this, "ComputeCluster", {
      vpc: this.vpc,
      // resource names cannot have slashes in them.
      clusterName: `temp-cdkexportsissue-cluster`,
      containerInsights: true,
    });
  }

  private _createService(): void {
    this.loadBalancedFargateService = new ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: this.cluster,
      memoryLimitMiB: 1024,
      desiredCount: 1,
      cpu: 512,
      taskImageOptions: {
        image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        environment: this._parameterStackBaseProps.environment
      },
    });
    this.scalableTarget = this.loadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 1,
    });

  }
}
