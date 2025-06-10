import {
  BookCheck,
  ChartPie,
  FolderSync,
  Goal,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Hero from "../Hero";

const features = [
  {
    icon: Goal,
    title: "Essential Greetings & Introductions",
    overview: "Survival English (A1)",
    description:
      "Build confidence with daily expressions, greetings, and basic introductions in everyday contexts.",
    lessons: [
      {
        title: "Saying Hello and Goodbye",
        href: "/lessons/daily-conversations",
      },
      {
        title: "Introducing Yourself Clearly",
        href: "/lessons/introducing-yourself",
      },
      {
        title: "Asking and Answering 'How Are You?'”",
        href: "/lessons/how-are-you",
      },
      {
        title: "Talking About Your Profession",
        href: "/lessons/talking-about-job",
      },
      { title: "Engaging in Small Talk", href: "/lessons/simple-small-talk" },
    ],
    fullListHref: "/features/essential-greetings-introductions",
  },
  {
    icon: BookCheck,
    title: "Grammar Essentials",
    overview: "Core Grammar (A2)",
    description:
      "Establish a solid foundation in English grammar, covering verb tenses, articles, and sentence construction.",
    lessons: [
      {
        title: "Understanding the Present Simple",
        href: "/lessons/present-simple",
      },
      { title: "Forming the Past Simple", href: "/lessons/past-simple" },
      { title: "Mastering Articles: a, an, the", href: "/lessons/articles" },
      {
        title: "Basic Sentence Structure",
        href: "/lessons/sentence-structure",
      },
      { title: "Using Prepositions Correctly", href: "/lessons/prepositions" },
    ],
    fullListHref: "/features/grammar-essentials",
  },
  {
    icon: ChartPie,
    title: "Practical Conversations",
    overview: "Functional Speaking (B1)",
    description:
      "Develop real-world speaking skills through scenario-based dialogues for daily activities and social settings.",
    lessons: [
      {
        title: "Dining Out Conversations",
        href: "/lessons/restaurant-dialogue",
      },
      {
        title: "Clothing and Shopping Talk",
        href: "/lessons/shopping-clothes",
      },
      {
        title: "Navigating and Asking for Directions",
        href: "/lessons/asking-directions",
      },
      { title: "Making Social Plans", href: "/lessons/making-plans" },
      {
        title: "Sharing Hobbies and Interests",
        href: "/lessons/talking-hobbies",
      },
    ],
    fullListHref: "/features/practical-conversations",
  },
  {
    icon: Users,
    title: "Vocabulary Development",
    overview: "Expanding Word Power (B2)",
    description:
      "Broaden your vocabulary with idiomatic expressions, phrasal verbs, and domain-specific language for fluent communication.",
    lessons: [
      { title: "Everyday Idioms", href: "/lessons/common-idioms" },
      { title: "Mastering Phrasal Verbs", href: "/lessons/phrasal-verbs" },
      {
        title: "Professional Business Vocabulary",
        href: "/lessons/business-vocab",
      },
      { title: "Travel and Leisure Vocabulary", href: "/lessons/travel-vocab" },
      { title: "Healthcare Vocabulary", href: "/lessons/health-vocab" },
    ],
    fullListHref: "/features/vocabulary-development",
  },
  {
    icon: FolderSync,
    title: "Advanced Writing Techniques",
    overview: "Academic & Professional Writing (C1)",
    description:
      "Refine your writing through structured essays, formal communication, and advanced editing practices.",
    lessons: [
      { title: "Organizing an Essay", href: "/lessons/essay-structure" },
      { title: "Formal vs. Informal Tone", href: "/lessons/formal-informal" },
      { title: "Using Logical Connectors", href: "/lessons/connectors" },
      { title: "Proofreading and Self-editing", href: "/lessons/editing" },
      {
        title: "Writing Effective Business Emails",
        href: "/lessons/business-emails",
      },
    ],
    fullListHref: "/features/advanced-writing-techniques",
  },
  {
    icon: Zap,
    title: "Fluency in Discussion",
    overview: "Masterclass in Speaking (C2)",
    description:
      "Engage in high-level conversations, persuasive speaking, and articulate presentations to achieve fluency.",
    lessons: [
      {
        title: "Structured Debate Strategies",
        href: "/lessons/debate-techniques",
      },
      {
        title: "Techniques for Persuasion",
        href: "/lessons/persuasive-speaking",
      },
      {
        title: "Delivering Impactful Presentations",
        href: "/lessons/giving-presentations",
      },
      {
        title: "Advanced Idiomatic Use",
        href: "/lessons/idiomatic-expressions",
      },
      {
        title: "Nuanced and Precise Vocabulary",
        href: "/lessons/nuanced-vocab",
      },
    ],
    fullListHref: "/features/fluency-in-discussion",
  },
];

const linkClass =
  "text-sm text-zinc-800 dark:text-white hover:text-purple-500 hover:underline underline-offset-4 transition-colors duration-200";

export default function FeaturesGrid() {
  return (
    <>
      <Hero />
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-screen-xl w-full py-10 px-6">
          <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-xl md:text-center md:mx-auto">
            Let Your Language Flow with the Wind 🌿
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 p-6 rounded-xl bg-background shadow-sm hover:ring hover:ring-muted transition-all overflow-hidden max-w-lg"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-grow">
                    <span className="font-semibold tracking-tight text-lg">
                      {feature.title}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-primary">
                    {feature.lessons?.map((lesson) => (
                      <li key={lesson.href}>
                        <Link href={lesson.href} className={linkClass}>
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {feature.fullListHref && (
                    <Link href={feature.fullListHref} className={linkClass}>
                      See Full Lesson →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
