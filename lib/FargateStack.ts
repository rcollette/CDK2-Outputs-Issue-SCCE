import { FargateStackBase, IFargateStackBaseProps } from "./FargateStackBase";
import { Construct } from "constructs";
import { CfnAccessKey } from "aws-cdk-lib/aws-iam";

export interface IFargateStackProps extends IFargateStackBaseProps {
  signerAccessKey: CfnAccessKey;
}

export class FargateStack extends FargateStackBase<IFargateStackProps> {

  constructor(scope: Construct, id: string, private fargateStackProps: IFargateStackProps) {
    super(scope, id, fargateStackProps);
  }

  protected _augmentStackProps(props: IFargateStackProps) {
    super._augmentStackProps(props);
    const environment = props.environment;
    environment[
      "DeliveriesBucketConfiguration__SignerAccessKey"
      ] = props.signerAccessKey.ref;
    environment[
      "DeliveriesBucketConfiguration__SignerSecretAccessKey"
      ] = props.signerAccessKey.attrSecretAccessKey;
    return props;
  }

}
