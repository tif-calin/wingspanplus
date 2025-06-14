import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout('pages/layout.tsx', [
    index("pages/home/index.ts"),
    route('taxalink', 'pages/taxalink/index.ts'),
    route('makecard', 'pages/makecard/index.ts'),
  ]),
] satisfies RouteConfig;
