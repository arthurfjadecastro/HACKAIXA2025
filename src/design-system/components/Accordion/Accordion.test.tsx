import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import Accordion, { AccordionItem } from './Accordion';

// Mock do LayoutAnimation
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.LayoutAnimation = {
    configureNext: jest.fn(),
    Presets: {
      easeInEaseOut: {},
    },
  };
  return RN;
});

interface TestAccordionItem extends AccordionItem {
  title: string;
  content: string;
}

const mockData: TestAccordionItem[] = [
  { id: 1, title: 'Item 1', content: 'Content 1' },
  { id: 2, title: 'Item 2', content: 'Content 2' },
  { id: 3, title: 'Item 3', content: 'Content 3' },
];

const mockRenderHeader = (item: TestAccordionItem, isOpen: boolean) => (
  <View testID={`header-${item.id}`}>
    <Text>{item.title}</Text>
    <Text>{isOpen ? '▼' : '▶'}</Text>
  </View>
);

const mockRenderContent = (item: TestAccordionItem) => (
  <View testID={`content-${item.id}`}>
    <Text>{item.content}</Text>
  </View>
);

describe('Accordion', () => {
  const mockOnToggle = jest.fn();
  const mockOnEndReached = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🎯 Basic Rendering', () => {
    it('should render accordion with all headers', () => {
      const { getByText } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          testID="test-accordion"
        />
      );

      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
      expect(getByText('Item 3')).toBeTruthy();
    });

    it('should render with custom testID', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          testID="custom-accordion"
        />
      );

      expect(getByTestId('custom-accordion')).toBeTruthy();
    });

    it('should render with empty data', () => {
      const { getByTestId } = render(
        <Accordion
          data={[]}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          testID="empty-accordion"
        />
      );

      expect(getByTestId('empty-accordion')).toBeTruthy();
    });
  });

  describe('🎯 Single Item Mode (Default)', () => {
    it('should show no content initially', () => {
      const { queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
        />
      );

      expect(queryByTestId('content-1')).toBeNull();
      expect(queryByTestId('content-2')).toBeNull();
      expect(queryByTestId('content-3')).toBeNull();
    });

    it('should show content when header is pressed', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
        />
      );

      const header1 = getByTestId('header-1');
      fireEvent.press(header1);

      expect(getByTestId('content-1')).toBeTruthy();
    });

    it('should close content when same header is pressed again', () => {
      const { getByTestId, queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
        />
      );

      const header1 = getByTestId('header-1');
      
      // Open
      fireEvent.press(header1);
      expect(getByTestId('content-1')).toBeTruthy();
      
      // Close
      fireEvent.press(header1);
      expect(queryByTestId('content-1')).toBeNull();
    });

    it('should close previous item when new item is opened', () => {
      const { getByTestId, queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
        />
      );

      const header1 = getByTestId('header-1');
      const header2 = getByTestId('header-2');
      
      // Open first item
      fireEvent.press(header1);
      expect(getByTestId('content-1')).toBeTruthy();
      
      // Open second item (should close first)
      fireEvent.press(header2);
      expect(queryByTestId('content-1')).toBeNull();
      expect(getByTestId('content-2')).toBeTruthy();
    });
  });

  describe('🎯 Multi Open Mode', () => {
    it('should allow multiple items to be open simultaneously', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          multiOpen={true}
        />
      );

      const header1 = getByTestId('header-1');
      const header2 = getByTestId('header-2');
      
      fireEvent.press(header1);
      fireEvent.press(header2);
      
      expect(getByTestId('content-1')).toBeTruthy();
      expect(getByTestId('content-2')).toBeTruthy();
    });

    it('should close individual items in multi open mode', () => {
      const { getByTestId, queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          multiOpen={true}
        />
      );

      const header1 = getByTestId('header-1');
      const header2 = getByTestId('header-2');
      
      // Open both
      fireEvent.press(header1);
      fireEvent.press(header2);
      expect(getByTestId('content-1')).toBeTruthy();
      expect(getByTestId('content-2')).toBeTruthy();
      
      // Close first, second should remain open
      fireEvent.press(header1);
      expect(queryByTestId('content-1')).toBeNull();
      expect(getByTestId('content-2')).toBeTruthy();
    });
  });

  describe('🎯 Initially Open Index', () => {
    it('should open specified item initially', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          initiallyOpenIndex={1}
        />
      );

      expect(getByTestId('content-2')).toBeTruthy();
    });

    it('should handle invalid initial index gracefully', () => {
      const { queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          initiallyOpenIndex={10}
        />
      );

      expect(queryByTestId('content-1')).toBeNull();
      expect(queryByTestId('content-2')).toBeNull();
      expect(queryByTestId('content-3')).toBeNull();
    });

    it('should handle negative initial index', () => {
      const { queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          initiallyOpenIndex={-1}
        />
      );

      expect(queryByTestId('content-1')).toBeNull();
      expect(queryByTestId('content-2')).toBeNull();
      expect(queryByTestId('content-3')).toBeNull();
    });
  });

  describe('🎯 Callbacks', () => {
    it('should call onToggle when item is opened', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header1 = getByTestId('header-1');
      fireEvent.press(header1);

      expect(mockOnToggle).toHaveBeenCalledWith(1, true);
    });

    it('should call onToggle when item is closed', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header1 = getByTestId('header-1');
      
      // Open
      fireEvent.press(header1);
      expect(mockOnToggle).toHaveBeenCalledWith(1, true);
      
      // Close
      fireEvent.press(header1);
      expect(mockOnToggle).toHaveBeenCalledWith(1, false);
    });

    it('should call onEndReached when scrolled to end', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onEndReached={mockOnEndReached}
          testID="scroll-accordion"
        />
      );

      const accordion = getByTestId('scroll-accordion');
      fireEvent(accordion, 'onEndReached');

      expect(mockOnEndReached).toHaveBeenCalled();
    });
  });

  describe('🎯 Header and Footer Components', () => {
    const HeaderComponent = () => <Text testID="header-component">Header</Text>;
    const FooterComponent = () => <Text testID="footer-component">Footer</Text>;

    it('should render ListHeaderComponent', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          ListHeaderComponent={HeaderComponent}
        />
      );

      expect(getByTestId('header-component')).toBeTruthy();
    });

    it('should render ListFooterComponent', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          ListFooterComponent={FooterComponent}
        />
      );

      expect(getByTestId('footer-component')).toBeTruthy();
    });

    it('should render both header and footer components', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          ListHeaderComponent={HeaderComponent}
          ListFooterComponent={FooterComponent}
        />
      );

      expect(getByTestId('header-component')).toBeTruthy();
      expect(getByTestId('footer-component')).toBeTruthy();
    });
  });



  describe('🎯 Header State Rendering', () => {
    it('should pass correct isOpen state to renderHeader', () => {
      const mockRenderHeaderWithState = jest.fn((item, isOpen) => (
        <View testID={`header-${item.id}`}>
          <Text>{item.title}</Text>
          <Text testID={`state-${item.id}`}>{isOpen ? 'open' : 'closed'}</Text>
        </View>
      ));

      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeaderWithState}
          renderContent={mockRenderContent}
        />
      );

      // Initially closed
      expect(getByTestId('state-1')).toHaveTextContent('closed');
      
      // After opening
      const header1 = getByTestId('header-1');
      fireEvent.press(header1);
      expect(getByTestId('state-1')).toHaveTextContent('open');
    });
  });

  describe('🎯 Custom Content Container Style', () => {
    it('should apply custom contentContainerStyle', () => {
      const customStyle = { paddingTop: 20 };
      
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          contentContainerStyle={customStyle}
          testID="styled-accordion"
        />
      );

      const accordion = getByTestId('styled-accordion');
      expect(accordion.props.contentContainerStyle).toEqual(customStyle);
    });
  });

  describe('🎯 String and Number IDs', () => {
    const mixedIdData = [
      { id: 'string-1', title: 'String ID', content: 'String content' },
      { id: 42, title: 'Number ID', content: 'Number content' },
    ];

    it('should handle string IDs correctly', () => {
      const { getByTestId } = render(
        <Accordion
          data={mixedIdData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header = getByTestId('header-string-1');
      fireEvent.press(header);

      expect(mockOnToggle).toHaveBeenCalledWith('string-1', true);
      expect(getByTestId('content-string-1')).toBeTruthy();
    });

    it('should handle number IDs correctly', () => {
      const { getByTestId } = render(
        <Accordion
          data={mixedIdData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header = getByTestId('header-42');
      fireEvent.press(header);

      expect(mockOnToggle).toHaveBeenCalledWith(42, true);
      expect(getByTestId('content-42')).toBeTruthy();
    });
  });

  describe('🎯 Integration Tests', () => {
    it('should handle complete open/close cycle with callbacks', async () => {
      const { getByTestId, queryByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header1 = getByTestId('header-1');
      
      // Open item
      fireEvent.press(header1);
      expect(mockOnToggle).toHaveBeenCalledWith(1, true);
      expect(getByTestId('content-1')).toBeTruthy();
      
      // Close item
      fireEvent.press(header1);
      expect(mockOnToggle).toHaveBeenCalledWith(1, false);
      expect(queryByTestId('content-1')).toBeNull();
      
      expect(mockOnToggle).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid successive toggles', () => {
      const { getByTestId } = render(
        <Accordion
          data={mockData}
          renderHeader={mockRenderHeader}
          renderContent={mockRenderContent}
          onToggle={mockOnToggle}
        />
      );

      const header1 = getByTestId('header-1');
      
      // Rapid toggles
      fireEvent.press(header1);
      fireEvent.press(header1);
      fireEvent.press(header1);
      
      expect(mockOnToggle).toHaveBeenCalledTimes(3);
      expect(mockOnToggle).toHaveBeenNthCalledWith(1, 1, true);
      expect(mockOnToggle).toHaveBeenNthCalledWith(2, 1, false);
      expect(mockOnToggle).toHaveBeenNthCalledWith(3, 1, true);
    });
  });
});
