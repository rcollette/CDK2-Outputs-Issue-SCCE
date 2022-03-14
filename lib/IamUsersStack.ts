import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnAccessKey, User } from "aws-cdk-lib/aws-iam";

export interface IIamUsersStackProps extends StackProps {
}

export class IamUsersStack extends Stack {
  public signerIamUser: User;
  public signerAccessKey: CfnAccessKey;

  constructor(
    scope: Construct,
    id: string,
    private _props: IIamUsersStackProps
  ) {
    super(scope, id, _props);
    this._createUrlSignerIAMUser();
  }

  /**
   * Creates an IAM User that is used by the API to pre-sign URLs
   *
   * We use an IAM User rather than an IAM Role because EvaporateJS does not currently support a load balanced
   * scenario where the signers in a pool each have different temporary (STS) aws credentials.
   * @private
   */
  private _createUrlSignerIAMUser(): void {
    const userName = `signer`;
    // This use is not intended to have console access and therefore there is no user secret.
    this.signerIamUser = new User(this, "SignerUser", {
      userName,
    });
    this.signerAccessKey = new CfnAccessKey(this, "SignerAccessKey", {
      // Do not use the string userName.  CDK takes the userName referenced here and returns the logical id of the user.
      userName: this.signerIamUser.userName,
    });
  }
}
