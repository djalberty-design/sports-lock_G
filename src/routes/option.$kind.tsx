import { createFileRoute } from "@tanstack/react-router";
import { OptionPage } from "@/components/app/option-page";

export const Route = createFileRoute("/option/$kind")({
  component: OptionRoute,
});

function OptionRoute() {
  const { kind } = Route.useParams();
  return <OptionPage kind={kind} />;
}
