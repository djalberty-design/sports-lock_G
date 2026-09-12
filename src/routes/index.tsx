import { createFileRoute } from "@tanstack/react-router";
import { StartPage } from "@/components/app/start-page";

export const Route = createFileRoute("/")({ component: StartPage });
