import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home/index.ts"),
  route('taxalink', 'pages/taxalink/index.ts'),
] satisfies RouteConfig;
