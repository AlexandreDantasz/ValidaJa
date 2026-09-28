import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo } from 'react-native';

import { Toast, type TipoFeedback } from '@/components/toast';

interface AcaoFeedback {
  rotulo: string;
  aoPressionar: () => void;
}

interface Feedback {
  id: number;
  mensagem: string;
  tipo: TipoFeedback;
  acao?: AcaoFeedback;
}

interface OpcoesFeedback {
  tipo?: TipoFeedback;
  acao?: AcaoFeedback;
}

interface FeedbackContextValue {
  mostrarFeedback: (mensagem: string, opcoes?: OpcoesFeedback) => void;
}

/** Tempo de exibição do aviso; maior quando há uma ação (ex.: Desfazer) para dar tempo de alcançá-la. */
const DURACAO_MS = 4000;
const DURACAO_COM_ACAO_MS = 7000;

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

/**
 * Feedback visual global das ações do usuário (salvar, consumir, descartar,
 * restaurar...). Exibe um aviso temporário na parte inferior da tela e
 * anuncia a mesma mensagem para leitores de tela (TalkBack/VoiceOver).
 */
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fechar = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFeedback(null);
  }, []);

  const mostrarFeedback = useCallback(
    (mensagem: string, { tipo = 'sucesso', acao }: OpcoesFeedback = {}) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFeedback({ id: Date.now(), mensagem, tipo, acao });
      AccessibilityInfo.announceForAccessibility(
        acao ? `${mensagem}. Ação disponível: ${acao.rotulo}.` : mensagem,
      );
      timeoutRef.current = setTimeout(
        () => setFeedback(null),
        acao ? DURACAO_COM_ACAO_MS : DURACAO_MS,
      );
    },
    [],
  );

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const value = useMemo(() => ({ mostrarFeedback }), [mostrarFeedback]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {feedback ? (
        <Toast
          key={feedback.id}
          mensagem={feedback.mensagem}
          tipo={feedback.tipo}
          rotuloAcao={feedback.acao?.rotulo}
          aoPressionarAcao={
            feedback.acao
              ? () => {
                  feedback.acao?.aoPressionar();
                  fechar();
                }
              : undefined
          }
          aoFechar={fechar}
        />
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser usado dentro de um FeedbackProvider');
  }
  return context;
}
