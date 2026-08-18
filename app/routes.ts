import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("roadmap", "./routes/roadmap.tsx"),
  route("cards", "./routes/cards.tsx"),
  
  // Okanos (Beta) - Login & Onboarding (outside layout)
  route("finances/login", "./routes/finances.login.tsx"),
  route("finances/onboarding", "./routes/finances.onboarding.tsx"),
  
  // Okanos (Beta) - Main App (with sidebar layout)
  ...prefix("finances", [
    layout("./routes/finances.layout.tsx", [
      index("./routes/finances.dashboard.tsx"),
      route("budget", "./routes/finances.budget.tsx"),
      route("credit-cards", "./routes/finances.credit-cards.tsx"),
      route("loans", "./routes/finances.loans.tsx"),
      route("income", "./routes/finances.income.tsx"),
      route("reports", "./routes/finances.reports.tsx"),
      route("settings", "./routes/finances.settings.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
