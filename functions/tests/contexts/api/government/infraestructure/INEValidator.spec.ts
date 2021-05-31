import { expect } from 'chai';
import * as mocha from 'mocha';
import { mockEnv } from '../../../../env';
import {
  GoogleCloudVision,
  INEGoogleCloudVision,
  INEModelType,
} from '../../../../../src/contexts/api/government/infraestructure/INEGoogleCloudVision';
import { BucketFile } from '../../../../../src/models/file';

mocha.describe('INE Validator', () => {
  it('should derive INE MODEL EFGH', async () => {
    const ineVision = new INEGoogleCloudVision(
      new GoogleCloudVision(),
      new BucketFile(mockEnv.obverse),
      new BucketFile(mockEnv.back)
    );
    const ine = await ineVision.derive();
    expect(ine.type.toString()).eql(`INEModelEFGH ${mockEnv.cic} ${mockEnv.id}`);
    expect(ine.curp).eql(mockEnv.curp);
  });
  it('should match back ine', () => {
    const ineModelType = new INEModelType('INSTITUTO NACIONAL ELECTORAL').factory().match('', mockEnv.backText);
    expect(ineModelType.toString()).eql(`INEModelEFGH ${mockEnv.cic} ${mockEnv.id}`);
  });
  it.only('should derive INE MODEL D', async () => {
    const ineVision = new INEGoogleCloudVision(
      new GoogleCloudVision(),
      new BucketFile('assets/ifeD-observe.png'),
      new BucketFile('assets/ifeD-back.png')
    );
    const ine = await ineVision.derive();
    expect(ine.type.toString()).eql(`INEModelD 183657717 0747116375842`);
  });
});