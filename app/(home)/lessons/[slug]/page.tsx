import React from "react";
import LessonClient from "@/app/(home)/lessons/components/LessonClient";
import { getLessonBySlug } from "@/lib/getLessonBySlug";
import { Link } from "lucide-react";
import { readTranscript } from "@/lib/readTranscript";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) {
    return (
      <div>
        <Link href="/not-found"></Link>
      </div>
    );
  }
  const segments = await readTranscript(lesson.transcriptJsonPath!);

  return (
    <LessonClient
      title={lesson.title}
      audioSrc={lesson.audioUrl}
      segments={segments}
    />
  );
};

export default LessonPage;
