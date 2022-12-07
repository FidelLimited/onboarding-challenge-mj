import { Log } from '@fidel.uk/log';

import {
  IdentityWithAccountName,
  VerificationMethod,
} from '../domain/entities/common-types';
import { VisaAdapter } from '../infra/visa';

interface CardVerificationData {
  consentID: string;
  methods: VerificationMethod[];
  vCardID: string;
}

export class ListCardVerificationMethodsService {
  log: Log;

  constructor(log: Log) {
    this.log = log;
  }

  public async execute(
    cardData: {
      mapId: string;
      number: string;
      expMonth: number;
      expYear: number;
    },
    identity: IdentityWithAccountName,
  ): Promise<CardVerificationData> {
    try {
      const visaAdapter = VisaAdapter.buildVisaAdapter(this.log);
      const cardConsentData = await visaAdapter.createCardConsent(
        cardData,
        identity,
      );

      this.log.info(
        `Created card consent with data: ${JSON.stringify(cardConsentData)}`,
      );

      const authorizedMethods =
        await visaAdapter.authorizeCardAndGetVerificationMethods(
          cardConsentData.consentID,
          cardConsentData.vCardID,
        );

      this.log.info(`Authorized methods: ${JSON.stringify(authorizedMethods)}`);

      return {
        consentID: cardConsentData.consentID,
        methods: authorizedMethods,
        vCardID: cardConsentData.vCardID,
      };
    } catch (error) {
      this.log.info(`An error happened: ${error}`);

      throw error;
    }
  }
}
