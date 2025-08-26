import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, LayoutAnimation } from 'react-native';

export interface AccordionItem {
  id: string | number;
  [key: string]: any; // Permite qualquer estrutura de dados
}

export interface AccordionProps<T extends AccordionItem> {
  data: T[];
  renderHeader: (item: T, isOpen: boolean) => React.ReactElement;
  renderContent: (item: T) => React.ReactElement;
  initiallyOpenIndex?: number;
  multiOpen?: boolean;
  onToggle?: (id: string | number, open: boolean) => void;
  onEndReached?: () => void;
  testID?: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: any;
}

function Accordion<T extends AccordionItem>({
  data,
  renderHeader,
  renderContent,
  initiallyOpenIndex,
  multiOpen = false,
  onToggle,
  onEndReached,
  testID,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle
}: AccordionProps<T>) {
  const [openItems, setOpenItems] = useState<Set<string | number>>(
    new Set(initiallyOpenIndex !== undefined && data[initiallyOpenIndex] ? [data[initiallyOpenIndex].id] : [])
  );

  const toggleItem = (id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    const newOpenItems = new Set(openItems);
    const isOpen = openItems.has(id);
    
    if (isOpen) {
      newOpenItems.delete(id);
    } else {
      if (!multiOpen) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }
    
    setOpenItems(newOpenItems);
    onToggle?.(id, !isOpen);
  };

  const renderItem = ({ item }: { item: T }) => {
    const isOpen = openItems.has(item.id);

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => toggleItem(item.id)}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
        >
          {renderHeader(item, isOpen)}
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.content}>
            {renderContent(item)}
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      testID={testID}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginVertical: 3, // Reduzido de 4 para 3
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12, // Reduzido de 16 para 12
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 12, // Reduzido de 16 para 12
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default Accordion;
