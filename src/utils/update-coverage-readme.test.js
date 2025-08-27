const updateCoverageReadme = require('../scripts/update-coverage-readme');

describe('update-coverage-readme', () => {
  it('should export a function', () => {
    expect(typeof updateCoverageReadme).toBe('function');
  });

  it('should be defined', () => {
    expect(updateCoverageReadme).toBeDefined();
  });

  it('should have the correct name', () => {
    expect(updateCoverageReadme.name).toBe('updateCoverageReadme');
  });

  it('should be a valid JavaScript function', () => {
    expect(updateCoverageReadme).toBeInstanceOf(Function);
  });
});
