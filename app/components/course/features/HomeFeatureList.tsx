import Link from "next/link";
import { getCategoriesWithLessons } from "@/lib/getFeatureList";

const linkClass =
  "text-sm text-zinc-800 dark:text-white hover:text-purple-500 hover:underline underline-offset-4 transition-colors duration-200";

export default async function HomeFeatureList() {
  const features = await getCategoriesWithLessons();

  return (
    <>
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
                      <li key={lesson.id}>
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className={linkClass}
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {feature.slug && (
                    <Link
                      href={`/features/${feature.slug}`}
                      className={linkClass}
                    >
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
