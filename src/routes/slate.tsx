import { createFileRoute } from "@tanstack/react-router";
import { SlatePage } from "@/components/app/slate-page";

export const Route = createFileRoute("/slate")({ component: SlatePage });
