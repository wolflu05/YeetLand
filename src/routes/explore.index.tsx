import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getAllYeets } from '../utils/api'
import { Stack } from '@mantine/core'
import { YeetList } from '../components/yeet/YeetList'

const allYeetsQueryOptions = queryOptions({
  queryKey: ['yeets'],
  queryFn: getAllYeets,
  staleTime: 1000 * 10,
})

export const Route = createFileRoute('/explore/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(allYeetsQueryOptions)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const allYeetsQuery = useSuspenseQuery(allYeetsQueryOptions)

  return (
    <Stack>
      {allYeetsQuery.data && (
        <YeetList yeetIds={allYeetsQuery.data?.response ?? []} />
      )}
    </Stack>
  )
}
