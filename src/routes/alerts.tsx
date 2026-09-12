import { createFileRoute } from "@tanstack/react-router";
import { AlertsPage } from "@/components/app/alerts-page";

export const Route = createFileRoute("/alerts")({ component: AlertsPage });
