import React from 'react';
import { render } from '@testing-library/react-native';
import { IdentityHeader } from './IdentityHeader';

describe('IdentityHeader', () => {
  it('should render with default props', () => {
    const { getByText } = render(<IdentityHeader />);
    
    expect(getByText('Olá,')).toBeTruthy();
    expect(getByText('Usuário')).toBeTruthy();
    expect(getByText('Cliente CAIXA')).toBeTruthy();
  });

  it('should render with custom userName', () => {
    const { getByText } = render(
      <IdentityHeader userName="João Silva" />
    );
    
    expect(getByText('Olá,')).toBeTruthy();
    expect(getByText('João Silva')).toBeTruthy();
    expect(getByText('Cliente CAIXA')).toBeTruthy();
  });

  it('should render with custom userTitle', () => {
    const { getByText } = render(
      <IdentityHeader userTitle="Funcionário CAIXA" />
    );
    
    expect(getByText('Olá,')).toBeTruthy();
    expect(getByText('Usuário')).toBeTruthy();
    expect(getByText('Funcionário CAIXA')).toBeTruthy();
  });

  it('should render with both custom props', () => {
    const { getByText } = render(
      <IdentityHeader 
        userName="Maria Santos" 
        userTitle="Gerente de Contas" 
      />
    );
    
    expect(getByText('Olá,')).toBeTruthy();
    expect(getByText('Maria Santos')).toBeTruthy();
    expect(getByText('Gerente de Contas')).toBeTruthy();
  });

  it('should have proper container structure', () => {
    const { getByText } = render(<IdentityHeader />);
    const container = getByText('Olá,').parent;
    
    expect(container).toBeTruthy();
  });
});
