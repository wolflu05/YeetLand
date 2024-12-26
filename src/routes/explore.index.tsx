import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getAllYeets } from '../utils/api'
import { Group, Stack, Switch } from '@mantine/core'
import { YeetList } from '../components/yeet/YeetList'
import { z } from "zod"

const allYeetsQueryOptions = queryOptions({
  queryKey: ['yeets'],
  queryFn: getAllYeets,
  staleTime: 1000 * 10,
})

const pathParamsSchema = z.object({
  showRootReplies: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/explore/')({
  validateSearch: search => pathParamsSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(allYeetsQueryOptions)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { showRootReplies } = Route.useSearch();
  const navigate = Route.useNavigate();
  const allYeetsQuery = useSuspenseQuery(allYeetsQueryOptions);

  return (
    <Stack>
      <Group justify="flex-end">
        <Switch label="Show new replies" checked={showRootReplies} onChange={(e) => navigate({ search: { showRootReplies: e.currentTarget.checked } })}></Switch>
      </Group>

      {allYeetsQuery.data && (
        <YeetList yeetIds={allYeetsQuery.data?.response ?? []} showRootReplies={showRootReplies} />
      )}
    </Stack>
  )
}
