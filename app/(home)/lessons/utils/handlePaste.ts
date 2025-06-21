import React from "react";

export function cleanText(input: string): string {
  return input.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

export function handlePasteEvent(
  event: React.ClipboardEvent<HTMLTextAreaElement>,
  useInput: string,
  setUseInput: (value: string) => void,
) {
  event.preventDefault();
  const pasted = cleanText(event.clipboardData.getData("text"));
  const textarea = event.target as HTMLTextAreaElement;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const before = useInput.slice(0, start);
  const after = useInput.slice(end);

  const newText = cleanText(`${before} ${pasted} ${after}`);
  setUseInput(newText);

  const cursor = cleanText(`${before} ${pasted}`).length;

  requestAnimationFrame(() => {
    textarea.setSelectionRange(cursor, cursor);
  });
}
