import path from 'path';
import { mocks } from '../../../test';
import ContentServer from './content-server';
import mockSiteConfig from './test-data/test.mocksite.config';
const mockSiteConfigCustomized = {
  ...mockSiteConfig,
  siteMap: {
    ...mockSiteConfig.siteMap,
    errorRedirects: {
      500: '/content/pages/mockerror',
      404: '/content/pages/mock404',
      launchSoon: '/content/pages/mocklaunch',
    },
  },
};

describe('CMS::ContentServer', function () {
  let fse;
  let app;
  let common_inst;
  let real_inst;
  let real_inst_customized;
  beforeEach(() => {
    fse = mocks.createMockRepository({}, [
      'readdir',
      'existsSync',
      'lstatSync',
      'readdirSync',
      'readFileSync',
    ]);
    app = mocks.createMockRepository({}, ['get', 'post', 'use']);
    jest.spyOn(fse, 'readdir').mockImplementation(() => []);
    jest
      .spyOn(fse, 'lstatSync')
      .mockImplementation(() => ({ isDirectory: () => true }));
    jest.spyOn(fse, 'readdirSync').mockImplementation(() => []);
    jest.spyOn(fse, 'readFileSync').mockImplementation(() => '');
    jest.spyOn(app, 'use').mockImplementation(() => []);
    jest.spyOn(app, 'get').mockImplementation(() => []);
    jest.spyOn(app, 'post').mockImplementation(() => []);
    common_inst = new ContentServer(
      {
        contentPath: '/test/content',
        serverPath: '/content/*',
        rootApp: '/test/',
        damAssets: '/test/dam',
        clientLibs: '/clientlibs',
        envConfig: {},
        mode: 'production',
        siteConfig: mockSiteConfig,
        fse,
        dirname: '/test/server',
      },
      app
    );

    real_inst = new ContentServer(
      {
        contentPath: path.resolve('libs/cms/src/lib/server/test-data/content'),
        serverPath: '/content/*',
        rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
        damAssets: path.resolve('libs/cms/src/lib/server/test-data/dam'),
        clientLibs: '/clientlibs',
        envConfig: {},
        mode: 'production',
        siteConfig: mockSiteConfig,
        dirname: `${process.cwd()}/libs/cms`,
      },
      app
    );
    real_inst_customized = new ContentServer(
      {
        contentPath: path.resolve('libs/cms/src/lib/server/test-data/content'),
        serverPath: '/content/*',
        rootApp: path.resolve('libs/cms/src/lib/server/test-data'),
        damAssets: path.resolve('libs/cms/src/lib/server/test-data/dam'),
        clientLibs: '/clientlibs',
        envConfig: {},
        mode: 'production',
        siteConfig: mockSiteConfigCustomized,
      },
      app
    );
  });
  it('should exists', () => {
    expect(ContentServer).toBeDefined();
  });
  it('should be able to create new instance', () => {
    expect(new ContentServer({ fse })).toBeDefined();
  });

  describe('pass the options', () => {
    let inst;
    beforeAll(() => {
      inst = new ContentServer({
        contentPath: '/test/content',
        serverPath: '/content/*',
        rootApp: '/test/',
        internalDevPath: '/test/',
        damAssets: '/test/dam',
        envConfig: {},
        mode: 'production',
        siteConfig: {},
        fse,
        dirname: '/test/',
      });
    });

    it('should have contentFolder', () => {
      expect(inst.contentFolder).toBe('/content');
    });
    it('should have clientLibs', () => {
      expect(inst.clientLibs).toBe('/test/client');
    });
  });

  describe('mapVanity()', () => {
    it('should call app.use with string', () => {
      common_inst.mapVanity({
        test: '/test',
      });
      expect(app.use.mock.calls[0][0]).toBe('/test');
    });
    it('should call app.use with target', () => {
      common_inst.mapVanity({
        '/content/(.*)': {
          type: 'regex',
          target: '/content/$1',
        },
      });
      expect(app.use).not.toBeCalledWith('/content/$1');
    });
  });
  describe('getFilePath(path)', () => {
    let inst;
    beforeEach(() => {
      inst = new ContentServer({
        contentPath: '/test/content',
        serverPath: '/content/*',
        rootApp: '/test',
        damAssets: '/test/dam',
        envConfig: {},
        mode: 'production',
        siteConfig: {},
        fse,
        dirname: '/test/server',
      });
    });

    afterEach(() => {});

    it('should give priority to file gold.yaml', () => {
      jest
        .spyOn(fse, 'existsSync')
        .mockImplementation((path: any) =>
          path.indexOf('gold') > -1 ? true : false
        );
      expect(inst.getFilePath('/test/dir/gold')).toBe(
        '/test/test/dir/gold.yaml'
      );
      jest.restoreAllMocks()
    });
    it('should give priority to if have /index.yaml', () => {
      jest
        .spyOn(fse, 'existsSync')
        .mockImplementation((path:any) =>
          path.indexOf('/index.yaml') > -1 ? true : false
        );
      expect(inst.getFilePath('/test/dir/site')).toBe(
        '/test/test/dir/site/index.yaml'
      );
      jest.restoreAllMocks()
    });
    it('should return same path if not has yaml file', () => {
      jest
        .spyOn(fse, 'existsSync')
        .mockImplementation((path:any) =>
          path.indexOf('.yaml') > -1 ? false : true
        );
      expect(inst.getFilePath('/test/dir/site')).toBe('/test/dir/site');
      jest.restoreAllMocks()
    });
    it('should return path if not matched', () => {
      jest.spyOn(fse, 'existsSync').mockImplementation((path) => false);
      expect(inst.getFilePath('/test/dir/site')).toBe('/test/dir/site');
      jest.restoreAllMocks()
    });
  });

  describe('getPageNode(node, path)', () => {
    const navigation = {
      children: [
        {
          title: 'Products',
          href: '/content/in/services',
          iconName: 'calendar-plus-fill',
          children: [
            {
              title: 'Gold',
              href: '/content/in/gold',
              children: [
                {
                  title: 'Chain',
                  href: '/content/in/gold/chain',
                },
                {
                  title: 'Ring',
                  href: '/content/in/gold/ring',
                },
              ],
            },
            {
              title: 'Silver',
              href: '/content/in/silver',
              children: [
                {
                  title: 'Panjeb',
                  href: '/content/in/silver/panjeb',
                },
                {
                  title: 'Kada',
                  href: '/content/in/silver/kada',
                },
              ],
            },
          ],
        },
      ],
    };
    describe('finding root as site', () => {
      let result;
      beforeEach(() => {
        result = common_inst.getPageNode(navigation, '/content/in/home');
      });
      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
    describe('finding root as site', () => {
      let result;
      beforeEach(() => {
        result = common_inst.getPageNode(navigation, '/content/in/gold');
      });
      it('should have 2 sub menu', () => {
        expect(result.children.length).toBe(2);
      });
      it('should have href as /content/in/gold', () => {
        expect(result.href).toBe('/content/in/gold');
      });
    });
    describe('finding child node as site', () => {
      let result;
      beforeEach(() => {
        result = common_inst.getPageNode(navigation, '/content/in/silver/kada');
      });
      it('should have 2 sub menu', () => {
        expect(result.children.length).toBe(2);
      });
      it('should have href as /content/in/silver', () => {
        expect(result.href).toBe('/content/in/silver');
      });
    });
  });

  describe('getAppNameFromUrl(path)', () => {
    it('should return appName "test"', () => {
      expect(common_inst.getAppNameFromUrl('test/app/gold')).toBe('test');
    });
  });
  describe('processContent(content, data)', () => {
    let result;
    beforeEach(() => {
      result = common_inst.processContent(
        {
          inject: {
            value: 'cold.war',
          },
          items: [
            {
              inject: {
                take: 'item',
              },
            },
          ],
        },
        {
          item: 'gold',
          cold: {
            war: 'test',
          },
        }
      );
    });

    it('should return value "test"', () => {
      expect(result.value).toBe('test');
    });
    it('should return items[0].item "gold"', () => {
      expect(result.items[0].take).toBe('gold');
    });
  });
  describe('init()', () => {
    beforeEach(() => {
      common_inst.init();
    });

    it('should call app.get to server html', () => {
      expect(app.get.mock.calls[0][0]).toBe('/content/*');
    });

    it('should call app.post to server json', () => {
      expect(app.post.mock.calls[0][0]).toBe('/content/*');
    });
    it('should call app.use to /client libs', () => {
      expect(app.use.mock.calls[0][0]).toBe('/env/app-config.js');
    });

    it('should call app.use to /client libs', () => {
      expect(app.use.mock.calls[1][0]).toBe('/client');
    });
    it('should call app.use to dam assets', () => {
      expect(app.use.mock.calls[2][0]).toBe('/dam');
    });
    it('should call app.use to clientLibs', () => {
      expect(app.use.mock.calls[3][0]).toBe('/clientlibs');
    });
  });

  describe('real instance test with test data', () => {
    describe('getPageData() parameters', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst.getPageData('crm/goodpage');
      });
      it('should return mode', () => {
        expect(result.mode).toBe('production');
      });
      it('should return status', () => {
        expect(result.status).toBe(200);
      });
      it('should return path', () => {
        expect(result.path).toBe('/content/crm/goodpage');
      });
      it('should return site', () => {
        expect(result.site).toBeDefined();
      });
      it('should return siteConfig', () => {
        expect(result.siteConfig).toEqual(mockSiteConfig);
      });
      it('should return currentNode', () => {
        expect(result.currentNode.title).toBe('CRM');
      });
      it('should return merged', () => {
        expect(result.merged).toBeDefined();
      });
      it('should return extraParams.launchTime', () => {
        expect(result.extraParams.launchTime).toBe('');
      });
      it('should return merged.navigation', () => {
        expect(result.merged.navigation).toEqual([
          {
            title: 'home',
          },
        ]);
      });
    });
    describe('getPageData() for good pages', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst.getPageData('crm/goodpage');
      });
      it('should have page title "Sample page"', () => {
        expect(result.pageData.title).toBe('Sample page');
      });
    });

    describe('getPageData() for page has errors [default]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst.getPageData('crm/dataerror');
      });
      it('should return defined page "Error occurred"', () => {
        expect(result.pageData.title).toBe('Error occurred');
      });
    });
    describe('getPageData() for page dont exists [default]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst.getPageData('crm/non-exist');
      });
      it('should return defined page "Page not found"', () => {
        expect(result.pageData.title).toBe('Page not found');
      });
    });
    describe('getPageData() for page not launched [default]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst.getPageData('crm/launch');
      });
      it('should return defined page "Page not found"', () => {
        expect(result.pageData.title).toBe('Page not found');
      });
    });

    describe('getPageData() for page has errors [customized]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst_customized.getPageData('crm/dataerror');
      });
      it('should return defined page "Mock error"', () => {
        expect(result.pageData.title).toBe('Mock error');
      });
    });
    describe('getPageData() for page dont exists [customized]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst_customized.getPageData('crm/non-exist');
      });
      it('should return defined page "Mock not found"', () => {
        expect(result.pageData.title).toBe('Mock not found');
      });
    });
    describe('getPageData() for page not launched [customized]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst_customized.getPageData('crm/launch');
      });
      it('should return defined page "Mock launch"', () => {
        expect(result.pageData.title).toBe('Mock launch');
      });
    });
    describe('getPageData() for page already launched [customized]', () => {
      let result;
      beforeEach(async () => {
        result = await real_inst_customized.getPageData('crm/launched');
      });
      it('should return defined page "Launched page"', () => {
        expect(result.pageData.title).toBe('Launched page');
      });
      it('should return launchTime', () => {
        expect(!!result.extraParams.launchTime).toBe(true);
      });
    });
  });
});
