import { Log } from '@fidel.uk/log';
import {
  VisaVDSSConsentAPI,
  VisaVDSSConsentAPITypes,
  VisaVDSSIdentityAPITypes,
  VisaVDSSIdentityVerificationAPI,
} from '@fidel.uk/visa-vdss';

import {
  IdentityWithAccountName,
  VerificationMethod,
  VerificationMethodTypesEnum,
} from '../../domain/entities/common-types';

export class VisaAdapter {
  private constructor(
    private readonly consentAPI: VisaVDSSConsentAPI,
    private readonly identityAPI: VisaVDSSIdentityVerificationAPI,
  ) {}

  public static buildVisaAdapter(log: Log) {
    const authorizationData = { apiKey: 'dummy', sharedSecret: 'dummy2' };

    return new VisaAdapter(
      new VisaVDSSConsentAPI({ log: log, stage: 'MOCK' }, authorizationData),
      new VisaVDSSIdentityVerificationAPI(
        { log: log, stage: 'MOCK' },
        authorizationData,
      ),
    );
  }

  private buildConsentData = (
    cardData: {
      number: string;
      expMonth: number;
      expYear: number;
    },
    identity: IdentityWithAccountName,
  ) => {
    const stringifiedExpMonth =
      cardData.expMonth <= 9
        ? `0${cardData.expMonth}`
        : cardData.expMonth.toString();

    return {
      accountId: identity.permission.accountId,
      accountName: identity.name,
      applicability:
        VisaVDSSConsentAPITypes.CreateCardHistoryConsentRequestApplicabilityEnum
          .EXPIRATION_BASED,
      periodDays: 2,
      purpose: VisaVDSSConsentAPITypes.CreateConsentPurposeEnum.OTHER,
      rawCard: {
        accountNumber: cardData.number,
        expirationDate: {
          month: stringifiedExpMonth,
          year: cardData.expYear.toString(),
        },
      },
    };
  };

  public async createCardConsent(
    cardData: {
      number: string;
      expMonth: number;
      expYear: number;
    },
    identity: IdentityWithAccountName,
  ): Promise<VisaVDSSConsentAPITypes.CreateCardConsentResponse> {
    const consentData = this.buildConsentData(cardData, identity);
    const encryptionData = { apiKey: 'dummy', sharedSecret: 'dummy2' };

    const returnedConsentData = await this.consentAPI.requestCardHistoryConsent(
      consentData,
      encryptionData,
    );

    return returnedConsentData;
  }

  private getAuthenticationMethodType(
    type: string,
  ): VerificationMethodTypesEnum | undefined {
    if (type.includes('EMAIL')) {
      return VerificationMethodTypesEnum.email;
    } else if (type.includes('SMS')) {
      return VerificationMethodTypesEnum.phone;
    }
  }

  private buildAuthenticationMethods = (
    allowedMethods: VisaVDSSIdentityAPITypes.AuthorizeResponseProbeData[],
  ): VerificationMethod[] => {
    const methods = [];
    for (const method of allowedMethods) {
      const type = this.getAuthenticationMethodType(method.type);
      methods.push({
        methodRef: method.ref,
        type,
        value: method.spec.delivery[`${type}_mask`],
      });
    }
    return methods;
  };

  private async authorizeCard(
    consentID: string,
    vCardId: string,
  ): Promise<VisaVDSSIdentityAPITypes.AuthorizeResponse> {
    const returnAuthData = await this.identityAPI.authorize({
      act_for: {
        relationship_id: 'dummy-vdssAuthorizeCardRelationshipId',
      },
      client_id: '750a150b-651b-467d-be81-11dac9b631dd',
      consent_id: consentID,
      login_hint: vCardId,
      login_hint_type:
        VisaVDSSIdentityAPITypes.AuthorizeRequestLoginHintTypeEnum.VCARD_ID,
      prompt: VisaVDSSIdentityAPITypes.AuthorizeRequestPromptEnum.NONE,
      response_mode:
        VisaVDSSIdentityAPITypes.AuthorizeRequestResponseModeEnum.BODY,
      response_type:
        VisaVDSSIdentityAPITypes.AuthorizeRequestResponseTypeEnum.NONE,
      scope: 'openid',
    });

    return returnAuthData;
  }

  public async authorizeCardAndGetVerificationMethods(
    consentID: string,
    vCardId: string,
  ): Promise<VerificationMethod[]> {
    const returnAuthData = await this.authorizeCard(consentID, vCardId);

    const allowedVerificationMethods = this.buildAuthenticationMethods(
      returnAuthData.subjects[0].probes[0].data,
    );

    return allowedVerificationMethods;
  }
}
