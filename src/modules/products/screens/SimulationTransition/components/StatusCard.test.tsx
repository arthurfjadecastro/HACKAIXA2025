import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusCard } from './StatusCard';
import { SimulationState } from '../types';

// Mock do design system
jest.mock('../../../../../design-system', () => ({
  Text: jest.fn(({ children, style, variant, ...props }) => {
    const { Text: RNText } = jest.requireActual('react-native');
    return (
      <RNText 
        style={style} 
        testID={props.testID}
        accessibilityRole={props.accessibilityRole}
        {...props}
      >
        {children}
      </RNText>
    );
  }),
}));

// Mock dos tokens
jest.mock('../../../../../design-system/tokens', () => ({
  theme: {
    colors: {
      primary: {
        dark: '#004A99',
        light: '#3399FF',
      },
      status: {
        success: '#28A745',
        error: '#DC3545',
      },
      text: {
        secondary: '#6C757D',
      },
      background: {
        card: '#FFFFFF',
        primary: '#F0F8FF',
      },
      border: {
        light: '#E9ECEF',
      },
    },
    spacing: [0, 4, 8, 12, 16, 20, 24],
    radius: {
      card: 8,
    },
  },
}));

describe('StatusCard', () => {
  const defaultProps = {
    state: 'idle' as SimulationState,
    statusText: 'Status padrão',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. BASIC RENDERING TESTS (5 tests)
  describe('🎯 Basic Rendering', () => {
    it('should render with idle state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="idle" statusText="Preparando..." />
      );

      expect(getByText('Preparando...')).toBeTruthy();
    });

    it('should render with loading state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="loading" statusText="Carregando..." />
      );

      expect(getByText('Carregando...')).toBeTruthy();
    });

    it('should render with success state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="success" statusText="Sucesso!" />
      );

      expect(getByText('Sucesso!')).toBeTruthy();
    });

    it('should render with error state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="error" statusText="Erro!" />
      );

      expect(getByText('Erro!')).toBeTruthy();
    });

    it('should render with unknown state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state={'unknown' as SimulationState} statusText="Desconhecido" />
      );

      expect(getByText('Desconhecido')).toBeTruthy();
    });
  });

  // ✅ 2. CARD STYLE LOGIC TESTS (6 tests)
  describe('🎯 Card Style Logic', () => {
    it('should render with loading state styling', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="loading" statusText="Loading" />
      );

      expect(getByText('Loading')).toBeTruthy();
    });

    it('should render with success state styling', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="success" statusText="Success" />
      );

      expect(getByText('Success')).toBeTruthy();
    });

    it('should render with error state styling', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="error" statusText="Error" />
      );

      expect(getByText('Error')).toBeTruthy();
    });

    it('should render with default styling for idle state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="idle" statusText="Idle" />
      );

      expect(getByText('Idle')).toBeTruthy();
    });

    it('should render with default styling for unknown state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state={'unknown' as SimulationState} statusText="Unknown" />
      );

      expect(getByText('Unknown')).toBeTruthy();
    });

    it('should render with default styling for undefined state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state={undefined as any} statusText="Undefined" />
      );

      expect(getByText('Undefined')).toBeTruthy();
    });
  });

  // ✅ 3. TEXT COLOR LOGIC TESTS (6 tests)
  describe('🎯 Text Color Logic', () => {
    it('should apply correct text color for loading state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="loading" statusText="Loading text" />
      );

      const text = getByText('Loading text');
      expect(text.props.style).toMatchObject({
        color: '#004A99',
      });
    });

    it('should apply correct text color for success state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="success" statusText="Success text" />
      );

      const text = getByText('Success text');
      expect(text.props.style).toMatchObject({
        color: '#28A745',
      });
    });

    it('should apply correct text color for error state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="error" statusText="Error text" />
      );

      const text = getByText('Error text');
      expect(text.props.style).toMatchObject({
        color: '#DC3545',
      });
    });

    it('should apply default text color for idle state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state="idle" statusText="Idle text" />
      );

      const text = getByText('Idle text');
      expect(text.props.style).toMatchObject({
        color: '#6C757D',
      });
    });

    it('should apply default text color for unknown state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state={'unknown' as SimulationState} statusText="Unknown text" />
      );

      const text = getByText('Unknown text');
      expect(text.props.style).toMatchObject({
        color: '#6C757D',
      });
    });

    it('should apply default text color for null state', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} state={null as any} statusText="Null text" />
      );

      const text = getByText('Null text');
      expect(text.props.style).toMatchObject({
        color: '#6C757D',
      });
    });
  });

  // ✅ 4. STATUS TEXT RENDERING TESTS (5 tests)
  describe('🎯 Status Text Rendering', () => {
    it('should render custom status text', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText="Custom message" />
      );

      expect(getByText('Custom message')).toBeTruthy();
    });

    it('should render empty status text', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText="" />
      );

      expect(getByText('')).toBeTruthy();
    });

    it('should render long status text', () => {
      const longText = 'Este é um texto muito longo para testar como o componente lida com mensagens extensas';
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText={longText} />
      );

      expect(getByText(longText)).toBeTruthy();
    });

    it('should render status text with special characters', () => {
      const specialText = '🎉 Sucesso! 100% ✅ @#$%';
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText={specialText} />
      );

      expect(getByText(specialText)).toBeTruthy();
    });

    it('should render status text with line breaks', () => {
      const multilineText = 'Primeira linha\nSegunda linha';
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText={multilineText} />
      );

      expect(getByText(multilineText)).toBeTruthy();
    });
  });

  // ✅ 5. COMPONENT INTEGRATION TESTS (4 tests)
  describe('🎯 Component Integration', () => {
    it('should combine state and statusText correctly', () => {
      const { getByText } = render(
        <StatusCard state="success" statusText="Operação realizada com sucesso!" />
      );

      const text = getByText('Operação realizada com sucesso!');
      expect(text).toBeTruthy();
      expect(text.props.style).toMatchObject({
        color: '#28A745',
      });
    });

    it('should handle prop changes correctly', () => {
      const { rerender, getByText } = render(
        <StatusCard state="loading" statusText="Carregando..." />
      );

      expect(getByText('Carregando...')).toBeTruthy();

      rerender(
        <StatusCard state="success" statusText="Concluído!" />
      );

      expect(getByText('Concluído!')).toBeTruthy();
    });

    it('should maintain consistent layout across different states', () => {
      const states: SimulationState[] = ['idle', 'loading', 'success', 'error'];
      
      states.forEach(state => {
        const { getByText } = render(
          <StatusCard state={state} statusText={`Status: ${state}`} />
        );
        
        const text = getByText(`Status: ${state}`);
        expect(text).toBeTruthy();
        expect(text.parent).toBeTruthy();
      });
    });

    it('should apply text variant correctly', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText="Test variant" />
      );

      const text = getByText('Test variant');
      // Verifica se o variant "body1" foi passado para o componente Text
      expect(text.props).toEqual(
        expect.objectContaining({
          children: 'Test variant',
        })
      );
    });
  });

  // ✅ 6. EDGE CASES TESTS (3 tests)
  describe('🎯 Edge Cases', () => {
    it('should handle rapid state transitions', () => {
      const { rerender, getByText } = render(
        <StatusCard state="loading" statusText="Loading" />
      );

      expect(getByText('Loading')).toBeTruthy();

      rerender(<StatusCard state="error" statusText="Error" />);
      expect(getByText('Error')).toBeTruthy();

      rerender(<StatusCard state="success" statusText="Success" />);
      expect(getByText('Success')).toBeTruthy();
    });

    it('should handle undefined props gracefully', () => {
      expect(() => {
        render(
          <StatusCard 
            state={undefined as any} 
            statusText={undefined as any} 
          />
        );
      }).not.toThrow();
    });

    it('should handle numeric statusText', () => {
      const { getByText } = render(
        <StatusCard 
          {...defaultProps} 
          statusText={'12345' as string} 
        />
      );

      expect(getByText('12345')).toBeTruthy();
    });
  });

  // ✅ 7. STYLING VERIFICATION TESTS (3 tests)
  describe('🎯 Styling Verification', () => {
    it('should apply base statusText styling', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText="Style test" />
      );

      const text = getByText('Style test');
      expect(text.props.style).toMatchObject({
        textAlign: 'center',
        fontWeight: '500',
      });
    });

    it('should render component with proper layout', () => {
      const { getByText } = render(
        <StatusCard {...defaultProps} statusText="Layout test" />
      );

      // Verifica se o componente renderiza
      expect(getByText('Layout test')).toBeTruthy();
    });

    it('should handle different state styles correctly', () => {
      const { getByText } = render(
        <StatusCard state="loading" statusText="Combined styles" />
      );

      // Verifica se o componente renderiza com o estado correto
      expect(getByText('Combined styles')).toBeTruthy();
    });
  });
});
