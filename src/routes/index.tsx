import { createFileRoute } from '@tanstack/react-router'
import { useMe } from '../hooks/useMe'
import { Stack, Title } from '@mantine/core'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getMe, getUserFollowing, getUserYeets } from '../utils/api'
import { YeetList } from "../components/yeet/YeetList"

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

export const Route = createFileRoute('/')({
  component: Index,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(allYeetsQueryOptions);
  }
})

function Index() {
  const me = useMe();
  const allYeetsQuery = useSuspenseQuery(allYeetsQueryOptions);

  return (
    <Stack gap="xl">
      <Title order={2}>Welcome {me?.username}!</Title>

      <Stack>
        {allYeetsQuery.data && <YeetList yeetIds={allYeetsQuery.data ?? []} />}
      </Stack>
    </Stack>
  )
}
