export type Props = {
  params: Promise<RouteParams>;
};

export type RouteParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};
