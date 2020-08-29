import * as functions from 'firebase-functions';
import { Response } from 'express';
import { CurpIdFinder } from '../../../contexts/api/government/application/CurpIdFinder';
import { CurpId } from '../../../contexts/api/government/domain/CurpId';
import { CurpIdScraper } from '../../../contexts/api/government/infraestructure/CurpIdScraper';
import { ensureIsValidApiKey } from '../../../contexts/api/government/domain/ApiKey';
import { CurpIdQueryFinder } from '../../../contexts/api/government/infraestructure/CurpIdQueryFinder';
import { https } from 'firebase-functions';

export const curp = functions
  .runWith({
    timeoutSeconds: 70,
    memory: '2GB',
  })
  .https.onRequest(async (req: https.Request | any, response: Response) => {
    try {
      await ensureIsValidApiKey(req.query.apiKey);
      const curpResponse = await new CurpIdFinder(new CurpIdScraper(), new CurpIdQueryFinder()).find(
        new CurpId(req.query.curp)
      );
      response.setHeader('Content-Type', 'application/json');
      return response.send(curpResponse);
    } catch (e) {
      console.warn(e);
      return response.status(400).send({
        error: e.message,
      });
    }
  });
