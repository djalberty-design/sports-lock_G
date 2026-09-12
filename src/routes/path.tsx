import { createFileRoute } from "@tanstack/react-router";
import { PathPage } from "@/components/app/path-page";

export const Route = createFileRoute("/path")({ component: PathPage });
