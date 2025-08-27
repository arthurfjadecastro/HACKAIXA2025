import SimulationLoadingScreen from './index';

describe('SimulationLoading Screens Index', () => {
  it('should export SimulationLoadingScreen component', () => {
    expect(SimulationLoadingScreen).toBeDefined();
    expect(typeof SimulationLoadingScreen).toBe('function');
  });

  it('should be a valid React component', () => {
    expect(SimulationLoadingScreen.name).toBe('SimulationLoadingScreen');
  });

  it('should match snapshot', () => {
    expect(SimulationLoadingScreen).toMatchSnapshot();
  });
});
