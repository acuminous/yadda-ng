const expect = require('expect');

const { Languages } = require('../..');
const { BaseLanguage, utils } = Languages;

class Esperanto extends BaseLanguage {
  constructor({ name }) {
    super({
      name,
      vocabulary: {
        step: [],
        feature: [],
        scenario: [],
        background: [],
      }
    });
  }
}

describe('utils', () => {

  afterEach(() => {
    utils.setDefault('none');
  });

  it('should set the default to no language', () => {
    expect(utils.getDefault().name).toBe('None');
  });

  it('should set the default language', () => {
    utils.setDefault('English');
    expect(utils.getDefault().name).toBe('English');
  });

  it('should find a language by name', () => {
    expect(utils.find('english').name).toBe('English');
  });

  it('should find a language by code', () => {
    expect(utils.find('en').name).toBe('English');
  });

  it('should tolerate missing languages when finding', () => {
    expect(utils.find('missing')).toBe(undefined);
  });

  it('should get a language by name', () => {
    expect(utils.get('english').name).toBe('English');
  });

  it('should get a language by code', () => {
    expect(utils.get('en').name).toBe('English');
  });

  it('should not tolerate missing languages when getting', () => {
    expect(() => utils.get('missing')).toThrow('Language: missing was not found');
  });

  it('should add a new language', () => {
    utils.add(new Esperanto({ name: 'Arnold' }));
    expect(utils.find('Arnold').name).toBe('Arnold');
    expect(utils.getDefault().name).toBe('Arnold');
  });

  it('should add a new language without making it default', () => {
    utils.add(new Esperanto({ name: 'Rimmer' }), false);
    expect(utils.find('Rimmer').name).toBe('Rimmer');
    expect(utils.getDefault().name).toBe('None');
  });

});
