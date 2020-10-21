import admin from 'firebase-admin';
import * as mocha from 'mocha';
import { warnByAPI } from '../../../src/contexts/api/government/infraestructure/SecuritySocialNumberRapidapiFinder';
import { AdminWrapper } from '../../AdminWrapper';
import { MexicanFinder } from './../../../src/contexts/api/government/application/MexicanFinder';
import { CurpResponse } from './../../../src/contexts/api/government/domain/CurpResponse';


export class Transaction {
  private db = admin.firestore();
  private mexicanFinder = new MexicanFinder();
  transacte(query: FirebaseFirestore.Query): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> {
    let lastDocument: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> = null;
    return this.db.runTransaction(t =>
      t.get(query).then((snapshot) => {
        lastDocument = snapshot.docs[snapshot.docs.length - 1] as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
        return snapshot.docs.reduce(async (previousPromise, actual) => {
          await previousPromise;
          const response = await this.mexicanFinder.find(actual.data() as CurpResponse);
          t.update(actual.ref, response);
        },
          Promise.resolve())
      }
      )
    ).then(() => lastDocument);
  }
  transacteAll(query: FirebaseFirestore.Query) {
    return this.db.runTransaction(t =>
      t.get(query).then((snapshot) => {
        snapshot.docs.forEach((doc) => t.update(doc.ref, {
          isRegisteredInIMSS: false
        }))
      })
    )
  }
}

export class Batch {
  private db = admin.firestore();
  private actual = this.db.collection('id')
    .orderBy('curp')
    .limit(5);
  private lastDocument: string;
  getQuery() {
    return this.actual;
  }
  set _lastDocument(lastDocument: string) {
    this.lastDocument = lastDocument;
  }
  next() {
    this.actual = this.db.collection('id')
      .orderBy('curp')
      .startAfter(this.lastDocument)
      .limit(5);
  }
}

export function timeout<T>(miliseconds: number, parameter?: T): Promise<any> {
  return new Promise((resolve) => setTimeout(() => resolve(parameter), miliseconds));
}


mocha.describe('Download mexican key data', () => {
  const adminWrapper = new AdminWrapper();
  adminWrapper.setRealEnvironment(false);
  it.only('Admin CLI', async () => {
    const transaction = new Transaction();
    const startAfter = 'SOJJ941214HMCLRN08';
    let document = await admin.firestore().collection('id').doc(startAfter).get();
    while (document) {
      let query = admin.firestore().collection('id').orderBy('curp', 'desc').startAfter(document).limit(30);
      try {
        document = await transaction.transacte(query).catch(() => transaction.transacte(query));
      } catch (e) {
        if (e.message === '3 INVALID_ARGUMENT: The referenced transaction has expired or is no longer valid.') {
          warnByAPI('Transaction', 15, "The referenced transaction has expired or is no longer valid.", 'FIRESTORE LIBRARY')
        }
      }
    }
  });
});
