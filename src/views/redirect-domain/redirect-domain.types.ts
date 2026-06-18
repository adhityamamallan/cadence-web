export type RouteParams = {
  domainParams: Array<string>;
};

export type Props = {
  params: Promise<RouteParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};
