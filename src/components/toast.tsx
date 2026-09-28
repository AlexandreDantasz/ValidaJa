import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TipoFeedback = 'sucesso' | 'info' | 'erro';

const ICONE_TIPO = {
  sucesso: 'check-circle',
  info: 'info',
  erro: 'error',
} as const;

/**
 * Distância da borda inferior: acima da barra de abas e do botão principal
 * da tela Início, para o aviso não cobrir a ação mais usada do app.
 */
const DISTANCIA_BASE = 136;

interface ToastProps {
  mensagem: string;
  tipo: TipoFeedback;
  rotuloAcao?: string;
  aoPressionarAcao?: () => void;
  aoFechar: () => void;
}

/**
 * Aviso temporário ("snackbar") exibido após uma ação. Fica na parte
 * inferior da tela — zona de alcance do polegar — para que a ação
 * opcional (ex.: Desfazer) seja fácil de tocar.
 */
export function Toast({ mensagem, tipo, rotuloAcao, aoPressionarAcao, aoFechar }: ToastProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const entrada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrada, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [entrada]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: insets.bottom + DISTANCIA_BASE }]}>
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          {
            backgroundColor: theme.toastBackground,
            opacity: entrada,
            transform: [
              { translateY: entrada.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
            ],
          },
        ]}>
        <MaterialIcons
          name={ICONE_TIPO[tipo]}
          size={22}
          color={theme.toastText}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
        <ThemedText type="small" style={[styles.mensagem, { color: theme.toastText }]}>
          {mensagem}
        </ThemedText>

        {rotuloAcao && aoPressionarAcao ? (
          <Pressable
            onPress={aoPressionarAcao}
            accessibilityRole="button"
            accessibilityLabel={rotuloAcao}
            style={({ pressed }) => [styles.botao, pressed && { opacity: 0.6 }]}>
            <ThemedText type="smallBold" style={{ color: theme.toastAction }}>
              {rotuloAcao.toUpperCase()}
            </ThemedText>
          </Pressable>
        ) : null}

        <Pressable
          onPress={aoFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar aviso"
          style={({ pressed }) => [styles.botaoFechar, pressed && { opacity: 0.6 }]}>
          <MaterialIcons name="close" size={20} color={theme.toastText} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  toast: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
    borderRadius: Spacing.three,
    minHeight: MinTouchTarget + Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  mensagem: {
    flex: 1,
    paddingVertical: Spacing.two,
  },
  botao: {
    minHeight: MinTouchTarget,
    minWidth: MinTouchTarget,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoFechar: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
