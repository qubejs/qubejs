import path from 'path';
// const { chai, mocks } = require('../../../tests/setup');
// import { mocks } from '../../../../test';
import PageBuilder from './page-builder';
import mockSiteConfig from '../test-data/test.mocksite.config';

describe('CMS::PageBuilder', function () {
  beforeEach(() => {});
  it('should exists', () => {
    expect(PageBuilder).toBeDefined();
  });
  it('should be able to create new instance', () => {
    const builder = new PageBuilder({
      site: {
        rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
        srcPath: path.resolve('libs/cms'),
        siteConfig: mockSiteConfig,
        mode: 'development',
        pageData: {
          template: 'apps/fake-app/templates/fake-t',
          layout: 'apps/fake-app/layouts/fake-l',
        },
      },
    });
    expect(builder).toBeDefined();
  });

  describe('PageBuilder with defined custom templates', () => {
    let builder, result;
    beforeEach(async () => {
      builder = new PageBuilder({
        site: {
          rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
          srcPath: path.resolve('libs/cms'),
        },
        siteConfig: mockSiteConfig,
        mode: 'development',
        pageData: {
          template: 'apps/fake-app/templates/fake-t',
          layout: 'apps/fake-app/layouts/fake-l',
          blocks: [],
        },
      });
      result = await builder.build();
    });

    it('should have proper html', () => {
      expect(result.output).toBe(
        `<html> <head></head> <body> <span></span> </body></html>`
      );
    });
  });

  describe('PageBuilder with defined extraParams, merged', () => {
    let builder, result;
    beforeEach(async () => {
      builder = new PageBuilder({
        site: {
          rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
          srcPath: path.resolve('libs/cms'),
        },
        siteConfig: mockSiteConfig,
        mode: 'development',
        pageData: {
          template: 'apps/fake-app/templates/fake-t-extra',
          layout: 'apps/fake-app/layouts/fake-l-extra',
        },
        extraParams: {
          Ice: {
            ok: 'ok',
          },
        },
        merged: {
          merged: {
            params: 'test',
          },
        },
      });
      result = await builder.build();
    });

    it('should have proper html', () => {
      expect(result.output).toBe(
        `<html> <head></head> <body> <span>ok:test</span> </body></html>`
      );
    });
  });

  describe('PageBuilder with not defined should use default template/page', () => {
    let builder, result;
    beforeEach(async () => {
      builder = new PageBuilder({
        site: {
          rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
          srcPath: path.resolve('libs/cms'),
        },
        siteConfig: mockSiteConfig,
        mode: 'development',
        pageData: {
          template: 'apps/core/templates/page2',
          layout: 'apps/core/layouts/default2',
          blocks: [],
        },
        currentNode: {
          children: [],
        },
      });
      result = await builder.build();
    });

    it('should have default template html html', () => {
      expect(result.output).not.toBe(
        `<html> <head></head> <body> <span></span> </body></html>`
      );
    });
  });
});
