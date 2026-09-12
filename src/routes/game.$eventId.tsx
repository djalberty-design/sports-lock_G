import { createFileRoute } from "@tanstack/react-router";
import { GamePage } from "@/components/app/game-page";

export const Route = createFileRoute("/game/$eventId")({
  component: GameRoute,
});

function GameRoute() {
  const { eventId } = Route.useParams();
  return <GamePage eventId={eventId} />;
}
