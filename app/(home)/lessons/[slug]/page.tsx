"use client";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

type Lesson = {
  title: string;
  content: string;
  audioUrl: string;
  description: string;
};

const lessonsContent: { [key: string]: Lesson } = {
  "daily-conversations": {
    title: "Daily Conversations",
    content: "Hi there, how are you doing today?",
    audioUrl: "/audios/daily-conversations.mp3",
    description: "A short chat between two friends meeting in the morning.",
  },
  "news-listening": {
    title: "News Listening",
    content:
      "Today’s headlines focus on the economy and the upcoming election.",
    audioUrl: "/audios/news-listening.mp3",
    description: "A news report from a local radio station.",
  },
  "movies-tv": {
    title: "Movies and TV Shows",
    content: "Did you see the latest episode last night? It was amazing!",
    audioUrl: "/audios/movies-tv.mp3",
    description: "Dialogue from a popular drama series.",
  },
  "academic-lectures": {
    title: "Academic Lectures",
    content:
      "Photosynthesis is the process by which green plants make their own food.",
    audioUrl: "/audios/academic-lectures.mp3",
    description: "A science lecture for high school students.",
  },
  podcasts: {
    title: "Podcasts",
    content:
      "Welcome back to the show, today we’re talking about productivity tips.",
    audioUrl: "/audios/podcasts.mp3",
    description: "An educational podcast for young professionals.",
  },
};

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = lessonsContent[params.slug];
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInput("");
    setResult(null);
    textareaRef.current?.focus();
  }, [params.slug]);

  if (!lesson) {
    return <div className="p-4">Lesson not found.</div>;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cleanedInput = input.trim().toLowerCase();
      const cleanedContent = lesson.content.trim().toLowerCase();
      setResult(cleanedInput === cleanedContent ? "correct" : "incorrect");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <audio
          controls
          src={lesson.audioUrl}
          className="w-full max-w-md mt-4"
        />
        <p className="mt-4 text-muted-foreground text-sm italic">
          {lesson.description}
        </p>
      </div>

      <div>
        <Textarea
          ref={textareaRef}
          placeholder="Type what you hear and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] text-base"
        />
        {result === "correct" && (
          <p className="text-green-600 mt-2 font-semibold">✅ Correct!</p>
        )}
        {result === "incorrect" && (
          <p className="text-red-600 mt-2 font-semibold">
            ❌ Incorrect. Try again.
          </p>
        )}
      </div>
    </main>
  );
}
