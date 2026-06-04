export const ApiHeader = (): HeadersInit => {
  const headers = new Headers();
  headers.set(
    "authorization",
    (`Client-ID ` + process.env.NEXT_PUBLIC_UNSPLASH_CLIENT_KEY) as string,
  );
  return headers;
};

export const PexelApiHeader = (): HeadersInit => {
  const headers = new Headers();
  headers.set(
    "authorization",
    process.env.NEXT_PUBLIC_PEXEL_CLIENT_KEY as string,
  );
  return headers;
};
