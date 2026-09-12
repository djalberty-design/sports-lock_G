import { createFileRoute } from "@tanstack/react-router";
import { OptionsPage } from "@/components/app/options-page";

export const Route = createFileRoute("/options")({ component: OptionsPage });
