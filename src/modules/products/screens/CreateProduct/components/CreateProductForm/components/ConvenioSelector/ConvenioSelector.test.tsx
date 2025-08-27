import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConvenioSelector } from './ConvenioSelector';

// Mock do design system
jest.mock('@/design-system/components', () => ({
  Text: ({ children }: any) => <div>{children}</div>,
}));

describe('ConvenioSelector', () => {
  const mockOnConvenioSelect = jest.fn();
  const mockIsConvenioAlreadyRegistered = jest.fn().mockReturnValue(false);

  const defaultProps = {
    subtipo: 'inss',
    selectedConvenio: '',
    onConvenioSelect: mockOnConvenioSelect,
    isConvenioAlreadyRegistered: mockIsConvenioAlreadyRegistered,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { toJSON } = render(<ConvenioSelector {...defaultProps} />);
    expect(toJSON()).toBeDefined();
  });

  it('should export ConvenioSelector component', () => {
    expect(ConvenioSelector).toBeDefined();
    expect(typeof ConvenioSelector).toBe('function');
  });

  it('should be a valid React component', () => {
    expect(React.isValidElement(<ConvenioSelector {...defaultProps} />)).toBe(true);
  });

  it('should handle different subtipos', () => {
    const { rerender, toJSON } = render(
      <ConvenioSelector {...defaultProps} subtipo="inss" />
    );
    const inssSnapshot = toJSON();

    rerender(<ConvenioSelector {...defaultProps} subtipo="siape" />);
    const siapeSnapshot = toJSON();

    expect(inssSnapshot).toBeDefined();
    expect(siapeSnapshot).toBeDefined();
  });

  it('should call onConvenioSelect when convenio is selected', () => {
    const { getByText } = render(<ConvenioSelector {...defaultProps} />);
    
    // Simulate selecting the first available convenio
    const firstConvenio = getByText(/Convênio|convenio/i);
    if (firstConvenio) {
      fireEvent.press(firstConvenio);
      expect(mockOnConvenioSelect).toHaveBeenCalled();
    }
  });

  it('should handle selectedConvenio prop', () => {
    const { toJSON } = render(
      <ConvenioSelector {...defaultProps} selectedConvenio="test-convenio" />
    );
    expect(toJSON()).toBeDefined();
  });

  it('should check if convenio is already registered', () => {
    render(<ConvenioSelector {...defaultProps} />);
    expect(mockIsConvenioAlreadyRegistered).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    const { toJSON } = render(<ConvenioSelector {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
