import '@testing-library/jest-native/extend-expect';

// Silenciar warnings desnecessários
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('DevMenu') ||
    args[0].includes('TurboModuleRegistry') ||
    args[0].includes('NativeEventEmitter')
  )) {
    return;
  }
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('DevMenu') ||
    args[0].includes('TurboModuleRegistry') ||
    args[0].includes('NativeEventEmitter')
  )) {
    return;
  }
  originalConsoleError(...args);
};

// Mock global do TurboModuleRegistry antes de outros mocks
global.TurboModuleRegistry = {
  getEnforcing: jest.fn(() => ({})),
  get: jest.fn(() => ({})),
};

// Mock do react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Icon',
  MaterialIcons: 'Icon',
  FontAwesome: 'Icon',
}));

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock do Expo Linear Gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock do Expo constants
jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
  },
}));

// Mock do react-native-lottie
jest.mock('lottie-react-native', () => 'LottieView');

// Mock apenas do Keyboard sem interferir no resto do react-native
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  dismiss: jest.fn(),
  isVisible: jest.fn(() => false),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
}));
