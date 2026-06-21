export async function transcribeAudio(blob: Blob): Promise<string> {
  const ext = blob.type.includes("mp4")
    ? "mp4"
    : blob.type.includes("mpeg")
      ? "mp3"
      : blob.type.includes("wav")
        ? "wav"
        : "webm";

  const form = new FormData();
  form.append("file", blob, `recording.${ext}`);

  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Transcription failed (${res.status})`);
  }

  const data = (await res.json()) as { text?: string };
  return (data.text ?? "").trim();
}
