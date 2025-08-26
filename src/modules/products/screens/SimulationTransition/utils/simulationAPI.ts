import { SimulationResult } from '../types';

export const simulateAPI = async (
  amount: string,
  months: number
): Promise<SimulationResult> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
  // TODO: Buscar taxa real do produto
  const rateAm = 0.01; // 1% ao mês (deve vir do produto)
  
  // Cálculo Price com arredondamento bancário
  const installment = numericAmount * rateAm / (1 - Math.pow(1 + rateAm, -months));
  const roundedInstallment = Math.round(installment * 100) / 100; // Arredondamento bancário
  const total = roundedInstallment * months;
  
  return {
    installment: roundedInstallment,
    total,
    rate: rateAm * 100, // Taxa em %
    months,
    amount: numericAmount
  };
};
