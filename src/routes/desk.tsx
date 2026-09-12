import { createFileRoute } from "@tanstack/react-router";
import { DeskPage } from "@/components/app/desk-page";

export const Route = createFileRoute("/desk")({ component: DeskPage });
