import { useCallback, useEffect, useRef, useState } from "react";

type SpeakOptions = {
  id?: string;
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice | null;
};

type UseTextToSpeechResult = {
  supported: boolean;
  speakingId: string | null;
  isSpeaking: boolean;
  speak: (text: string, options?: SpeakOptions) => void;
  stop: () => void;
  toggle: (text: string, options?: SpeakOptions) => void;
};

export function useTextToSpeech(): UseTextToSpeechResult {
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeakingId(null);
  }, [supported]);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!supported || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.voice) utterance.voice = options.voice;

      const id = options.id ?? "default";
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setSpeakingId(null);
        }
      };
      utterance.onerror = () => {
        if (utteranceRef.current === utterance) {
          utteranceRef.current = null;
          setSpeakingId(null);
        }
      };

      utteranceRef.current = utterance;
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  const toggle = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      const id = options.id ?? "default";
      if (speakingId === id) {
        stop();
        return;
      }
      speak(text, options);
    },
    [speakingId, speak, stop],
  );

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return {
    supported,
    speakingId,
    isSpeaking: speakingId !== null,
    speak,
    stop,
    toggle,
  };
}
