import {
  BookCheck,
  ChartPie,
  FolderSync,
  Goal,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Goal,
    title: "Identify Opportunities",
    description:
      "Easily uncover untapped areas to explore and expand your reach effortlessly and effectively.",
  },
  {
    icon: BookCheck,
    title: "Build Authority",
    description:
      "Create valuable content that resonates, inspires trust, and positions you as an expert.",
  },
  {
    icon: ChartPie,
    title: "Instant Insights",
    description:
      "Gain immediate, actionable insights with a quick glance, enabling fast decision-making.",
  },
  {
    icon: Users,
    title: "Engage with Your Audience",
    description:
      "Boost audience engagement with interactive features like polls, quizzes, and forms.",
  },
  {
    icon: FolderSync,
    title: "Automate Your Workflow",
    description:
      "Streamline your processes by automating repetitive tasks, saving time and reducing effort.",
  },
  {
    icon: Zap,
    title: "Accelerate Growth",
    description:
      "Supercharge your growth by implementing strategies that drive results quickly and efficiently.",
  },
  {
    icon: BookCheck,
    title: "Build Authority",
    description:
      "Create valuable content that resonates, inspires trust, and positions you as an expert.",
  },
  {
    icon: ChartPie,
    title: "Instant Insights",
    description:
      "Gain immediate, actionable insights with a quick glance, enabling fast decision-making.",
  },
  {
    icon: Goal,
    title: "Identify Opportunities",
    description:
      "Easily uncover untapped areas to explore and expand your reach effortlessly and effectively.",
  },
];

export default function FeaturesGrid() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-screen-xl w-full py-10 px-6">
        <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight max-w-xl md:text-center md:mx-auto">
          Boost Your Strategy with Smart Features
        </h2>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href="#">
              <div className="flex gap-4 items-start hover:ring hover:ring-muted rounded-xl p-4 transition-all bg-background shadow-sm">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
