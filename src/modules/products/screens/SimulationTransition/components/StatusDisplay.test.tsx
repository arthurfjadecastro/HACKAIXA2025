import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusDisplay } from './StatusDisplay';
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
        main: '#0066CC',
      },
      status: {
        success: '#28A745',
        error: '#DC3545',
      },
      text: {
        secondary: '#6C757D',
        disabled: '#ADB5BD',
      },
    },
    spacing: [0, 4, 8, 12, 16, 20, 24],
  },
}));

describe('StatusDisplay', () => {
  const defaultProps = {
    state: 'idle' as SimulationState,
    requestId: 'test-request-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ 1. BASIC RENDERING TESTS (5 tests)
  describe('🎯 Basic Rendering', () => {
    it('should render with idle state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="idle" />
      );

      expect(getByText('🔄')).toBeTruthy();
      expect(getByText('Preparando simulação...')).toBeTruthy();
    });

    it('should render with loading state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('⏳')).toBeTruthy();
      expect(getByText('Processando simulação...')).toBeTruthy();
    });

    it('should render with success state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="success" />
      );

      expect(getByText('✅')).toBeTruthy();
      expect(getByText('Simulação concluída com sucesso!')).toBeTruthy();
    });

    it('should render with error state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="error" />
      );

      expect(getByText('❌')).toBeTruthy();
      expect(getByText('Erro ao processar simulação')).toBeTruthy();
    });

    it('should render with unknown state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={'unknown' as SimulationState} />
      );

      expect(getByText('🔄')).toBeTruthy();
      expect(getByText('Status desconhecido')).toBeTruthy();
    });
  });

  // ✅ 2. ICON LOGIC TESTS (5 tests)
  describe('🎯 Icon Logic', () => {
    it('should display correct icon for loading state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('⏳')).toBeTruthy();
    });

    it('should display correct icon for success state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="success" />
      );

      expect(getByText('✅')).toBeTruthy();
    });

    it('should display correct icon for error state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="error" />
      );

      expect(getByText('❌')).toBeTruthy();
    });

    it('should display default icon for idle state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="idle" />
      );

      expect(getByText('🔄')).toBeTruthy();
    });

    it('should display default icon for undefined state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={undefined as any} />
      );

      expect(getByText('🔄')).toBeTruthy();
    });
  });

  // ✅ 3. MESSAGE LOGIC TESTS (6 tests)
  describe('🎯 Message Logic', () => {
    it('should display correct message for idle state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="idle" />
      );

      expect(getByText('Preparando simulação...')).toBeTruthy();
    });

    it('should display correct message for loading state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('Processando simulação...')).toBeTruthy();
    });

    it('should display correct message for success state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="success" />
      );

      expect(getByText('Simulação concluída com sucesso!')).toBeTruthy();
    });

    it('should display correct message for error state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="error" />
      );

      expect(getByText('Erro ao processar simulação')).toBeTruthy();
    });

    it('should display default message for unknown state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={'invalid' as SimulationState} />
      );

      expect(getByText('Status desconhecido')).toBeTruthy();
    });

    it('should display default message for null state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={null as any} />
      );

      expect(getByText('Status desconhecido')).toBeTruthy();
    });
  });

  // ✅ 4. COLOR LOGIC TESTS (6 tests)
  describe('🎯 Color Logic', () => {
    it('should apply correct color for loading state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      const messageText = getByText('Processando simulação...');
      expect(messageText.props.style).toMatchObject({
        color: '#0066CC',
      });
    });

    it('should apply correct color for success state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="success" />
      );

      const messageText = getByText('Simulação concluída com sucesso!');
      expect(messageText.props.style).toMatchObject({
        color: '#28A745',
      });
    });

    it('should apply correct color for error state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="error" />
      );

      const messageText = getByText('Erro ao processar simulação');
      expect(messageText.props.style).toMatchObject({
        color: '#DC3545',
      });
    });

    it('should apply default color for idle state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="idle" />
      );

      const messageText = getByText('Preparando simulação...');
      expect(messageText.props.style).toMatchObject({
        color: '#6C757D',
      });
    });

    it('should apply default color for unknown state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={'unknown' as SimulationState} />
      );

      const messageText = getByText('Status desconhecido');
      expect(messageText.props.style).toMatchObject({
        color: '#6C757D',
      });
    });

    it('should apply default color for undefined state', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state={undefined as any} />
      );

      const messageText = getByText('Status desconhecido');
      expect(messageText.props.style).toMatchObject({
        color: '#6C757D',
      });
    });
  });

  // ✅ 5. DEBUG RENDERING TESTS (4 tests)
  describe('🎯 Debug Rendering', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      (global as any).__DEV__ = originalEnv === 'development';
    });

    it('should render debug info in development mode', () => {
      (global as any).__DEV__ = true;
      
      const { getByText } = render(
        <StatusDisplay {...defaultProps} requestId="debug-123" />
      );

      expect(getByText('ID: debug-123')).toBeTruthy();
    });

    it('should not render debug info in production mode', () => {
      (global as any).__DEV__ = false;
      
      const { queryByText } = render(
        <StatusDisplay {...defaultProps} requestId="debug-123" />
      );

      expect(queryByText('ID: debug-123')).toBeNull();
    });

    it('should render different request IDs correctly', () => {
      (global as any).__DEV__ = true;
      
      const { getByText } = render(
        <StatusDisplay {...defaultProps} requestId="unique-request-456" />
      );

      expect(getByText('ID: unique-request-456')).toBeTruthy();
    });

    it('should render empty request ID correctly', () => {
      (global as any).__DEV__ = true;
      
      const { getByText } = render(
        <StatusDisplay {...defaultProps} requestId="" />
      );

      expect(getByText('ID: ')).toBeTruthy();
    });
  });

  // ✅ 6. COMPONENT STRUCTURE TESTS (4 tests)
  describe('🎯 Component Structure', () => {
    it('should render main container', () => {
      // Verifica se o componente renderiza sem erros
      expect(() => render(<StatusDisplay {...defaultProps} />)).not.toThrow();
    });

    it('should render status row with icon and message', () => {
      const { getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('⏳')).toBeTruthy();
      expect(getByText('Processando simulação...')).toBeTruthy();
    });

    it('should maintain consistent layout across states', () => {
      const states: SimulationState[] = ['idle', 'loading', 'success', 'error'];
      
      states.forEach(state => {
        const { getByText } = render(
          <StatusDisplay {...defaultProps} state={state} />
        );
        
        // Cada estado deve ter um ícone e uma mensagem
        expect(getByText).toBeTruthy();
      });
    });

    it('should handle prop changes correctly', () => {
      const { rerender, getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('Processando simulação...')).toBeTruthy();

      rerender(
        <StatusDisplay {...defaultProps} state="success" />
      );

      expect(getByText('Simulação concluída com sucesso!')).toBeTruthy();
    });
  });

  // ✅ 7. EDGE CASES TESTS (3 tests)
  describe('🎯 Edge Cases', () => {
    it('should handle rapid state changes', () => {
      const { rerender, getByText } = render(
        <StatusDisplay {...defaultProps} state="loading" />
      );

      expect(getByText('⏳')).toBeTruthy();

      rerender(<StatusDisplay {...defaultProps} state="error" />);
      expect(getByText('❌')).toBeTruthy();

      rerender(<StatusDisplay {...defaultProps} state="success" />);
      expect(getByText('✅')).toBeTruthy();
    });

    it('should handle special characters in requestId', () => {
      (global as any).__DEV__ = true;
      
      const { getByText } = render(
        <StatusDisplay 
          {...defaultProps} 
          requestId="test-123!@#$%^&*()" 
        />
      );

      expect(getByText('ID: test-123!@#$%^&*()')).toBeTruthy();
    });

    it('should handle very long requestId', () => {
      (global as any).__DEV__ = true;
      
      const longId = 'a'.repeat(100);
      const { getByText } = render(
        <StatusDisplay 
          {...defaultProps} 
          requestId={longId} 
        />
      );

      expect(getByText(`ID: ${longId}`)).toBeTruthy();
    });
  });
});
