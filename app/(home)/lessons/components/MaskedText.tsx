interface MaskedTranscriptProps {
  fullText: string;
  revealedWords: number;
}

export function MaskedTranscript({
  fullText,
  revealedWords,
}: MaskedTranscriptProps) {
  const words = fullText.split(" ");

  return (
    <p className="font-medium text-lg">
      {words.map((word, index) => (
        <span key={index} className="mr-2">
          {index < revealedWords ? word : "***"}
        </span>
      ))}
    </p>
  );
}
