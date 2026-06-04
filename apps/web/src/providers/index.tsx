"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

type ProviderProps = {
  children: React.ReactNode;
  locale: string;
  messages?: AbstractIntlMessages;
};

export default function Providers({
  children,
  messages,
  locale,
}: ProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
