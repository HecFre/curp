import { StringObject } from '../shared/StringObject.js';
import { Database } from '../shared/database.js';

export class BadCurpFormat extends Error {
  constructor(curp: string) {
    super(`'${curp}' is an invalid curp`);
  }
}

export class CurpId extends StringObject {
  private readonly curpIdPattern =
    /[A-Z]{1}[AEIXOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}/;
  private database = new Database();

  constructor(curpId: string) {
    super(curpId);
    this.ensure();
  }

  get state() {
    return this.value.match(this.curpIdPattern)[3];
  }

  async getIsoState() {
    return (await this.database.collection('states').showData(this.state)).iso;
  }

  private ensure() {
    this.isNotUndefined();
    this.toUpperCase();
    this.ensureCurpId();
  }

  private toUpperCase() {
    this.value = this.value.toUpperCase();
  }

  private ensureCurpId() {
    const match = this.value.match(this.curpIdPattern);
    if (!match) {
      throw new BadCurpFormat(this.value);
    }
    this.value = match[0];
  }

  private isNotUndefined() {
    if (this.value === undefined) {
      throw new BadCurpFormat('');
    }
  }
}
