import * as server from './index';

describe('CMS::Server', function () {
  it('should have .ContentServer', () => {
    expect(server.ContentServer).toBeDefined();
  });
  it('should have .JobScheduler', () => {
    expect(server.JobScheduler).toBeDefined();
  });
});
