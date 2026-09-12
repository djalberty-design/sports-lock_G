import { createFileRoute } from "@tanstack/react-router";
import { BoardPage } from "@/components/app/board-page";

export const Route = createFileRoute("/board")({ component: BoardPage });
