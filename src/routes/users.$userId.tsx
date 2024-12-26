import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from "../components/layout/UserPageQuery"
import { UserPage } from "../components/layout/UserPage"

export const Route = createFileRoute('/users/$userId')({
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(userQueryOptions(userId))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams();

  return <UserPage userId={userId} />
}
