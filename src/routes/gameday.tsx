import { createFileRoute } from "@tanstack/react-router";
import { GamedayPage } from "@/components/app/gameday-page";

export const Route = createFileRoute("/gameday")({ component: GamedayPage });
