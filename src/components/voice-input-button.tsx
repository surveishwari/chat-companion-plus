import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { transcribeAudio } from "@/lib/transcription";
import { cn } from "@/lib/utils";

type VoiceInputButtonProps = {
  onTranscript: (text: string, autoSend: boolean) => void;
  autoSend: boolean;
  disabled?: boolean;
};

export function VoiceInputButton({
  onTranscript,
  autoSend,
  disabled,
}: VoiceInputButtonProps) {
  const { status, error, start, stop } = useAudioRecorder();
  const [transcribing, setTranscribing] = useState(false);

  const isRecording = status === "recording";
  const isBusy =
    status === "requesting" || status === "stopping" || transcribing;

  const handleClick = useCallback(async () => {
    if (transcribing) return;
    if (isRecording) {
      const blob = await stop();
      if (!blob || blob.size < 1024) {
        toast.error("That recording was empty — please try again.");
        return;
      }
      try {
        setTranscribing(true);
        const text = await transcribeAudio(blob);
        if (!text) {
          toast.error("No speech detected.");
          return;
        }
        onTranscript(text, autoSend);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Transcription failed",
        );
      } finally {
        setTranscribing(false);
      }
      return;
    }
    await start();
    if (error) toast.error(error);
  }, [
    isRecording,
    transcribing,
    stop,
    start,
    error,
    onTranscript,
    autoSend,
  ]);

  const label = transcribing
    ? "Transcribing"
    : isRecording
      ? "Stop recording"
      : "Start voice input";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={disabled || isBusy}
      aria-label={label}
      title={label}
      className={cn(
        "size-9 rounded-full",
        isRecording && "bg-destructive/10 text-destructive hover:bg-destructive/20",
      )}
    >
      {transcribing ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isRecording ? (
        <Square className="size-4 fill-current" />
      ) : (
        <Mic className="size-4" />
      )}
    </Button>
  );
}
