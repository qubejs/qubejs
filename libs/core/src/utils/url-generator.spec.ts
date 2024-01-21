import UrlGenerator from './url-generator';

describe('Utils:UrlGenerator', () => {

    const defaultConfig = {
      server: {
        host: 'http://localhost:4000'
      }
    };
    describe('ensureSlashEnd(url)', () => {
      const urlGener = new UrlGenerator({
        ...defaultConfig
      });
      it('should add / at the end', () => {
        expect(urlGener.ensureSlashEnd('http://localhost:4000')).toBe('http://localhost:4000/')
      });
      it('should not add / at the end', () => {
        expect(urlGener.ensureSlashEnd('http://localhost:4000/')).toBe('http://localhost:4000/')
      });
  
  
    });
    describe('ensureNoSlashStart(url)', () => {
      const urlGener = new UrlGenerator();
      it('should remove / at the start', () => {
        expect(urlGener.ensureNoSlashStart('/emailverify')).toBe('emailverify')
      });
      it('should return as it is', () => {
        expect(urlGener.ensureNoSlashStart('emailverify')).toBe('emailverify')
      });
  
  
    });
    describe('create(url, params)', () => {
      const urlGener = new UrlGenerator({
        ...defaultConfig
      });
      it('should create url with query params', () => {
        expect(urlGener.create('/emailverify', { token: 'heytoken' })).toBe('http://localhost:4000/emailverify?token=heytoken')
      });
    });
  
  });