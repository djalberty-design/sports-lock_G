import { createFileRoute } from "@tanstack/react-router";
import { LearnPage } from "@/components/app/learn-page";

export const Route = createFileRoute("/learn")({ component: LearnPage });
