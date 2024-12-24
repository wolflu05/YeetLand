import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllUsers } from '../utils/api'
import {
  Button,
  Group,
  Input,
  ScrollArea,
  Stack
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useMemo } from 'react'
import { z } from "zod"
import { User } from "../components/yeet/User"
import { IconTopologyStar3 } from "@tabler/icons-react"

const pathParamsSchema = z.object({
  search: z.string().optional(),
})

const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: getAllUsers,
  staleTime: 1000 * 60 * 5,
});

export const Route = createFileRoute('/users/')({
  validateSearch: search => pathParamsSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(usersQueryOptions)
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { search } = Route.useSearch();
  const userQuery = useSuspenseQuery(usersQueryOptions);

  const [debouncedSearchValue] = useDebouncedValue(search, 500)
  const filteredUsers = useMemo(
    () => {
      if (!debouncedSearchValue) {
        return userQuery.data?.response ?? []
      }

      return userQuery.data?.response.filter((user) =>
        user.includes(debouncedSearchValue)
      ) ?? []
    },
    [debouncedSearchValue, userQuery.data],
  )

  return (
    <Stack>
      <Group>
        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => navigate({ search: { search: e.currentTarget.value }, replace: true })}
          flex={1}
        />

        <Link to="/users/network">
          <Button leftSection={<IconTopologyStar3 />}>
            Network
          </Button>
        </Link>
      </Group>

      <ScrollArea h="90vh">
        <Group grow>
          {userQuery.isSuccess &&
            filteredUsers.map((user) => (
              <User key={user} user={user} />
            ))}
        </Group>
      </ScrollArea>
    </Stack>
  )
}
