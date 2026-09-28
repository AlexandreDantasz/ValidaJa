/**
 * Cores do app nos temas claro e escuro. Todas as cores usadas em texto
 * (primary, danger, warning, attention, success, textSecondary) têm contraste
 * mínimo de 4,5:1 (WCAG AA) contra `background` e `backgroundElement` do
 * próprio tema; `border` tem pelo menos 3:1 (mínimo para elementos gráficos).
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    border: '#7E808A',
    primary: '#0A66C2',
    onPrimary: '#ffffff',
    danger: '#C4262E',
    warning: '#A94700',
    attention: '#806200',
    success: '#1B7546',
    toastBackground: '#1C1D20',
    toastText: '#ffffff',
    toastAction: '#7CB8FF',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    border: '#7C8088',
    primary: '#4DA3FF',
    onPrimary: '#000000',
    danger: '#FF8589',
    warning: '#FFA657',
    attention: '#F2D34B',
    success: '#4CC38A',
    toastBackground: '#EDEEF0',
    toastText: '#111113',
    toastAction: '#0A66C2',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/**
 * Tamanho mínimo de qualquer alvo de toque (48dp — recomendação do Material
 * Design; o iOS recomenda 44pt). Aplicado em botões, pills, cards e steppers
 * para respeitar a Lei de Fitts: alvos maiores são mais rápidos e precisos
 * de acertar.
 */
export const MinTouchTarget = 48;

export const MaxContentWidth = 800;
