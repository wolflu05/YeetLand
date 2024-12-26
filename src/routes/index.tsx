import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '../hooks/useMe'
import { Group, Stack, Switch, Title } from '@mantine/core'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getMe, getUserFollowing, getUserYeets } from '../utils/api'
import { YeetList } from "../components/yeet/YeetList"
import { z } from "zod"

const allYeetsQueryOptions =
  queryOptions({
    queryKey: ['yeets-feed'],
    queryFn: async () => {
      const me = await getMe();
      const following = await getUserFollowing(me.username)

      const yeets = await Promise.all(
        following.response.map((user) => getUserYeets(user)),
      )

      return yeets.flatMap(r => r.response);
    },
    staleTime: 1000 * 10,
  })

const pathParamsSchema = z.object({
  showRootReplies: z.boolean().optional().default(false),
});

export const Route = createFileRoute('/')({
  validateSearch: search => pathParamsSchema.parse(search),
  component: Index,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(allYeetsQueryOptions);
  }
})

function Index() {
  const { showRootReplies } = Route.useSearch();
  const navigate = Route.useNavigate();
  const me = useMe();
  const allYeetsQuery = useSuspenseQuery(allYeetsQueryOptions);

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={2}>Welcome {me?.username}!</Title>
        <Switch label="Show new replies" checked={showRootReplies} onChange={(e) => navigate({ search: { showRootReplies: e.currentTarget.checked } })}></Switch>
      </Group>

      <Stack>
        {allYeetsQuery.data && <YeetList yeetIds={allYeetsQuery.data ?? []} showRootReplies={showRootReplies} />}
      </Stack>
    </Stack>
  )
}
