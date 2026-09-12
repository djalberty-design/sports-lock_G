import { createFileRoute } from "@tanstack/react-router";
import { NowPage } from "@/components/app/now-page";

export const Route = createFileRoute("/today")({ component: NowPage });
