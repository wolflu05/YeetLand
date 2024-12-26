import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import '@mantine/core/styles.css';
import PageWrapper from "../components/layout/PageWrapper";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Code } from "@mantine/core";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <PageWrapper>
      <Outlet />
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </PageWrapper>
  ),
  errorComponent: ({ error }) => (
    <PageWrapper>
      <Code block>
        {error.message}
      </Code>
    </PageWrapper>
  ),
})
