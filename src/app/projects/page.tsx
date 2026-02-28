import { ProjectsClient } from "@/components/projects-client";

export const metadata = {
  title: "Projects",
  description: "A collection of systems programming, compiler, and tooling projects.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
