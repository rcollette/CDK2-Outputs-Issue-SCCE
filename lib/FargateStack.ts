import { FargateStackBase, IFargateStackBaseProps } from "./FargateStackBase";
import { Construct } from "constructs";
import { CfnAccessKey } from "aws-cdk-lib/aws-iam";

export interface IFargateStackProps extends IFargateStackBaseProps {
  signerAccessKey: CfnAccessKey;
}

export class FargateStack extends FargateStackBase<IFargateStackProps> {
  constructor(scope: Construct, id: string, private fargateStackProps: IFargateStackProps) {
    super(scope, id, fargateStackProps);
    this._setSignerEnvironmentVariables();
  }

  private _setSignerEnvironmentVariables(): void {
    this.fargateStackProps.environment[
      "DeliveriesBucketConfiguration__SignerAccessKey"
      ] = this.fargateStackProps.signerAccessKey.ref;
    this.fargateStackProps.environment[
      "DeliveriesBucketConfiguration__SignerSecretAccessKey"
      ] = this.fargateStackProps.signerAccessKey.attrSecretAccessKey;
  }
}
