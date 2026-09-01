import {
  defineRailway,
  github,
  project,
  service,
  volume,
} from "railway/iac";

// ============================================================================
// Universo Pet — Railway Infrastructure as Code
// ----------------------------------------------------------------------------
// Replaces the deprecated `railway.json` (Config as Code). New services can no
// longer opt into CaC, so this file is the single source for the Railway
// environment: service, build/start commands, the persistent SQLite volume and
// public variables.
//
// Usage (from this directory):
//   railway login
//   railway init              # create + link the Railway project
//   railway config plan       # preview (safe)
//   railway config apply      # create service + volume, kick off the deploy
//
// NOTE: replace TU-USUARIO/TU-REPO with the actual GitHub owner/repo before
// applying (this demo service deploys straight from GitHub).
// ============================================================================

export default defineRailway(() => {
  // Persistent volume: the demo database is SQLite (prisma/dev.db), which lives
  // at /app/prisma inside the container. Mounting it keeps the demo data
  // (catalog, stock, orders) across redeploys. This is what replaces the
  // "Volumes" section you could not find in the dashboard — with IaC the
  // volume is declared here.
  const sqliteData = volume("universopet-data", {
    sizeMB: 1024,
  });

  const web = service("web", {
    source: github("TU-USUARIO/TU-REPO", { branch: "main" }),
    build: "npm run db:generate && npm run build",
    start: "npm run db:push && npm run db:seed && npm start",
    healthcheck: "/",
    healthcheckTimeout: 120,
    volumeMounts: {
      "/app/prisma": sqliteData,
    },
    env: {
      // Public variable (safe to commit — it is NEXT_PUBLIC_ and the demo
      // WhatsApp default). Change it to the store's real number in E.164.
      NEXT_PUBLIC_WHATSAPP_NUMBER: "5491122334455",
    },
  });

  return project("universopet", {
    resources: [web, sqliteData],
  });
});