import { createFileRoute } from "@tanstack/react-router";
import { MorePage } from "@/components/app/more-page";

export const Route = createFileRoute("/more")({ component: MorePage });
