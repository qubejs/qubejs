import helpers from './helpers';

describe('Email:Helpers', () => {
  describe('processBody()', () => {
    it('should inject keys given in data with ##data.key##', () => {
      const output = helpers.processBody('Hello there I am ##data.name##', { name: 'Rahul' });
      expect(output).toBe('Hello there I am Rahul');
    });

    it('should inject nested keys given in data with ##data.key##', () => {
      const output = helpers.processBody('Hello there I am ##data.name##', { name: 'Rocket of ##data.key##', key: 'Locket' });
      expect(output).toBe('Hello there I am Rocket of Locket');
    });
    it('should inject nested keys given in dynamic data', () => {
      helpers.setDataItems({
        block: 'section 1'
      })
      const output = helpers.processBody('Hello there I am ##data.block##', { name: 'Rocket of ##data.key##', key: 'Locket' });
      expect(output).toBe('Hello there I am section 1');
    });

    it('should inject nested keys as functions given in data with ##data.key##', () => {
      const output = helpers.processBody('Hello there I am ##data.name##', {
        name: (data) => {
          if (data.key === 'Locket') {
            return 'Rocket of ##data.key##';
          }
          return '';
        },
        key: 'Locket'
      });
      expect(output).toBe('Hello there I am Rocket of Locket');
    });
    it('should handle null or blank value', () => {
      const output = helpers.processBody('Hello there I am ##data.name##', {
        name: (data) => {
          if (data.key === 'Locket') {
            return 'Rocket of ##data.key##';
          }
          return '';
        },
        key: 'Locket2'
      });
      expect(output).toBe('Hello there I am ');
    });
    it('should handle 0 value', () => {
      const output = helpers.processBody('Hello there I am ##data.name##', {
        name: (data) => {
          if (data.key === 'Locket') {
            return 0;
          }
          return '';
        },
        key: 'Locket'
      });
      expect(output).toBe('Hello there I am 0');
    });
    it('should handle nested data items', () => {
      const output = helpers.processBody('Hello there I am ##data.nested.name##', { nested: { name: 'Gold' }, key: 'Locket' });
      expect(output).toBe('Hello there I am Gold');
    });
    it('should handle nested data items', () => {
      const output = helpers.processBody('Hello there I am ##data.nested.data.name##', { nested: { data: { name: 'Gold' } }, key: 'Locket' });
      expect(output).toBe('Hello there I am Gold');
    });
  });
});
