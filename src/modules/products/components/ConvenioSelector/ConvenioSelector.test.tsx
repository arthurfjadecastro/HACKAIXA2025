import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ConvenioSelector from './ConvenioSelector';

// Mock do design system
jest.mock('../../../../design-system', () => ({
  RadioButton: ({ label, checked, onPress }: any) => (
    <div onClick={onPress} data-testid={`radio-${label}`}>
      {label} - {checked ? 'checked' : 'unchecked'}
    </div>
  ),
}));

const mockConvenios = [
  { id: '1', name: 'Convênio A' },
  { id: '2', name: 'Convênio B' },
  { id: '3', name: 'Convênio C' },
];

describe('ConvenioSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { toJSON } = render(
      <ConvenioSelector
        convenios={mockConvenios}
        selectedConvenio={null}
        onConvenioChange={mockOnChange}
      />
    );
    expect(toJSON()).toBeDefined();
  });

  it('should render all convenios', () => {
    const { getByTestId } = render(
      <ConvenioSelector
        convenios={mockConvenios}
        selectedConvenio={null}
        onConvenioChange={mockOnChange}
      />
    );

    mockConvenios.forEach(convenio => {
      expect(getByTestId(`radio-${convenio.name}`)).toBeTruthy();
    });
  });

  it('should show selected convenio as checked', () => {
    const { getByTestId } = render(
      <ConvenioSelector
        convenios={mockConvenios}
        selectedConvenio={mockConvenios[0]}
        onConvenioChange={mockOnChange}
      />
    );

    const selectedRadio = getByTestId(`radio-${mockConvenios[0].name}`);
    expect(selectedRadio.props.children).toContain('checked');
  });

  it('should call onConvenioChange when convenio is selected', () => {
    const { getByTestId } = render(
      <ConvenioSelector
        convenios={mockConvenios}
        selectedConvenio={null}
        onConvenioChange={mockOnChange}
      />
    );

    const radio = getByTestId(`radio-${mockConvenios[1].name}`);
    fireEvent.press(radio);

    expect(mockOnChange).toHaveBeenCalledWith(mockConvenios[1]);
  });

  it('should handle empty convenios array', () => {
    const { toJSON } = render(
      <ConvenioSelector
        convenios={[]}
        selectedConvenio={null}
        onConvenioChange={mockOnChange}
      />
    );
    expect(toJSON()).toBeDefined();
  });

  it('should export ConvenioSelector component', () => {
    expect(ConvenioSelector).toBeDefined();
    expect(typeof ConvenioSelector).toBe('function');
  });

  it('should match snapshot', () => {
    const { toJSON } = render(
      <ConvenioSelector
        convenios={mockConvenios}
        selectedConvenio={mockConvenios[0]}
        onConvenioChange={mockOnChange}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
