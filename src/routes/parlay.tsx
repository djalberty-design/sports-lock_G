import { createFileRoute } from "@tanstack/react-router";
import { ParlayPage } from "@/components/app/parlay-page";

export const Route = createFileRoute("/parlay")({ component: ParlayPage });
