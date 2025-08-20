export const colors = {
  primary: {
    main: '#005CA9',
    light: '#0066CC',
    dark: '#004A8A',
    contrast: '#FFFFFF',
  },

  secondary: {
    main: '#12161C',
    light: '#2A2E3A',
    dark: '#000000',
    contrast: '#FFFFFF',
  },

  background: {
    primary: '#F4F8FB',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  text: {
    primary: '#12161C',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#FFFFFF',
    hint: 'rgba(18, 22, 28, 0.6)',
  },

  status: {
    success: '#00C851',
    warning: '#FF8800',
    error: '#FF4444',
    info: '#33B5E5',
  },

  border: {
    light: '#EEEEEE',
    medium: '#DDDDDD',
    dark: '#CCCCCC',
  },

  component: {
    shadow: '#000000',
    ripple: 'rgba(0, 92, 169, 0.1)',
    divider: '#EEEEEE',
    placeholder: '#999999',
  },

  tabBar: {
    active: {
      background: '#FFFFFF',
      text: '#005CA9',
      icon: '#005CA9',
    },
    inactive: {
      text: 'rgba(255, 255, 255, 0.7)',
      icon: 'rgba(255, 255, 255, 0.7)',
    },
  },
} as const;
