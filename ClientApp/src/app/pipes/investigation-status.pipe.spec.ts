import { InvestigationStatusPipe } from './investigation-status.pipe';

describe('InvestigationStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new InvestigationStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
