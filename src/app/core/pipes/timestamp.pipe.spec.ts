import { TimestampPipe } from './timestamp.pipe';

describe('TimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampPipe('fr-FR');
    expect(pipe).toBeTruthy();
  });
});
