import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/design-system/components';

export interface Installment {
  index: number;           // 1..months
  dueDate: string;         // ISO
  installment: number;     // parcela fixa (ajustada no último mês)
  interest: number;        // juros do mês
  amortization: number;    // parcela - juros
  remaining: number;       // saldo após pagamento
}

export interface ExpandPanelProps {
  schedule: Installment[];
  totalWithInterest: number;
  monthlyInstallment: number;
  initiallyOpenIndex?: number;
  multiOpen?: boolean;
  onToggle?(index: number, open: boolean): void;
  onEndReached?(): void;
  testID?: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: any;
  hideInternalHeader?: boolean; // Nova prop para esconder o header interno
}

const ExpandPanel: React.FC<ExpandPanelProps> = ({
  schedule,
  totalWithInterest,
  monthlyInstallment,
  initiallyOpenIndex,
  multiOpen = false,
  onToggle,
  onEndReached,
  testID,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  hideInternalHeader = false // Valor padrão false
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(initiallyOpenIndex !== undefined ? [initiallyOpenIndex] : [])
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).toUpperCase();
  };

  const getOrdinal = (index: number) => {
    return `${index}º`;
  };

  const toggleItem = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const newOpenItems = new Set(openItems);
    const isOpen = openItems.has(index);
    
    if (isOpen) {
      newOpenItems.delete(index);
    } else {
      if (!multiOpen) {
        newOpenItems.clear();
      }
      newOpenItems.add(index);
    }
    
    setOpenItems(newOpenItems);
    onToggle?.(index, !isOpen);
  };

  const renderInstallmentItem = ({ item }: { item: Installment }) => {
    const isOpen = openItems.has(item.index);
    
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleItem(item.index)}
          accessibilityRole="button"
          accessibilityLabel={`Parcela ${item.index} de ${schedule.length}, vence em ${formatDate(item.dueDate)}. ${isOpen ? 'Aberto' : 'Fechado'}. Valor da parcela ${formatCurrency(item.installment)}.`}
          accessibilityHint={`Toque para ${isOpen ? 'recolher' : 'expandir'} e ver juros, amortização e saldo devedor.`}
          accessibilityState={{ expanded: isOpen }}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.ordinal}>{getOrdinal(item.index)}</Text>
            <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <Text style={styles.installmentValue}>{formatCurrency(item.installment)}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="#666666"
              style={[
                styles.chevron,
                { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }
              ]}
            />
          </View>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.body}>
            <View style={styles.separator} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Parcela</Text>
              <Text style={StyleSheet.flatten([styles.detailValue, styles.detailValueStrong])}>
                {formatCurrency(item.installment)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Juros</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(item.interest)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amortização</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(item.amortization)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Saldo devedor</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(item.remaining)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const InternalListHeaderComponent = () => (
    <Text style={styles.listHeader}>
      {schedule.length} parcelas restantes
    </Text>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Sem parcelas para exibir</Text>
    </View>
  );

  return (
    <View style={styles.container} testID={testID}>
      <FlatList
        data={schedule}
        renderItem={renderInstallmentItem}
        keyExtractor={(item) => item.index.toString()}
        ListHeaderComponent={ListHeaderComponent || (hideInternalHeader ? null : InternalListHeaderComponent)}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={contentContainerStyle}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        initialNumToRender={12}
        windowSize={10}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: 60, // altura aproximada do item fechado
          offset: 60 * index,
          index,
        })}
      />
    </View>
  );
};

export default ExpandPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    marginTop: 8,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Aumentado de 16 para 24 para mais espaço lateral
    paddingVertical: 16,
    minHeight: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ordinal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#666666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  installmentValue: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
  body: {
    paddingHorizontal: 24, // Aumentado de 16 para 24 para consistência
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  detailValueStrong: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
