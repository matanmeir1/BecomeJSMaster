export const colors = {
  // Matrix theme colors
  matrix: {
    green: '#00ff41',
    darkGreen: '#003b00',
    black: '#000000',
    darkGray: '#1a1a1a',
    lightGray: '#2a2a2a'
  },
  // Accent colors
  accent: {
    purple: '#9d4edd',
    blue: '#4cc9f0',
    pink: '#f72585',
    orange: '#ff9e00'
  },
  // UI colors
  ui: {
    white: '#ffffff',
    light: '#f8f9fa',
    dark: '#212529',
    gray: '#6c757d',
    grayLight: '#e9ecef',
    grayDark: '#343a40'
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem'
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px'
};

export const shadows = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  glow: '0 0 10px rgba(0, 255, 65, 0.5)'
};

export const buttonStyles = {
  base: {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  primary: {
    backgroundColor: colors.matrix.green,
    color: colors.matrix.black,
    boxShadow: shadows.glow,
    '&:hover': {
      backgroundColor: colors.accent.blue,
      transform: 'translateY(-2px)'
    }
  },
  secondary: {
    backgroundColor: colors.matrix.darkGreen,
    color: colors.matrix.green,
    border: `1px solid ${colors.matrix.green}`,
    '&:hover': {
      backgroundColor: colors.matrix.green,
      color: colors.matrix.black
    }
  },
  danger: {
    backgroundColor: colors.accent.pink,
    color: colors.ui.white,
    '&:hover': {
      backgroundColor: colors.accent.orange,
      transform: 'translateY(-2px)'
    }
  }
};

export const cardStyles = {
  base: {
    backgroundColor: colors.matrix.darkGray,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: shadows.lg,
    border: `1px solid ${colors.matrix.green}`,
    color: colors.matrix.green
  },
  glass: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    boxShadow: shadows.glow,
    border: `1px solid ${colors.matrix.green}`
  }
};

export const inputStyles = {
  base: {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.matrix.green}`,
    backgroundColor: colors.matrix.black,
    color: colors.matrix.green,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: colors.accent.blue,
      boxShadow: shadows.glow
    }
  }
};

export const matrixBackground = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  backgroundColor: colors.matrix.black,
  backgroundImage: `
    linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px'
}; 