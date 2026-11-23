import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/content/site";
import CaseStudy from "./CaseStudy";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: project.image ? [project.image] : undefined },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return <CaseStudy project={PROJECTS[index]} index={index} next={next} />;
}
