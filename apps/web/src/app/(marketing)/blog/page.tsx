import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog | LeadFlow AI",
  description: "Read the latest news, tips, and strategies for modern sales teams.",
};

const POSTS = [
  {
    slug: "hello-world",
    title: "Introducing LeadFlow AI",
    date: "June 27, 2026",
    excerpt: "Today we are excited to announce LeadFlow AI, the modern platform for sales teams to automate their entire workflow.",
    author: "Jane Doe",
    category: "Announcements"
  }
];

export default function BlogIndexPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Latest news, tips, and strategies for modern sales teams.
          </p>
        </div>

        <div className="space-y-12">
          {POSTS.map((post) => (
            <article key={post.slug} className="group relative flex flex-col items-start justify-between rounded-2xl border p-6 hover:shadow-md transition-shadow bg-background">
              <div className="flex items-center gap-x-4 text-xs mb-4">
                <time dateTime={post.date} className="text-muted-foreground">
                  {post.date}
                </time>
                <span className="relative z-10 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary hover:bg-primary/20">
                  {post.category}
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-2xl font-bold font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-muted-foreground text-base">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-foreground">
                    <span className="absolute inset-0" />
                    {post.author}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
