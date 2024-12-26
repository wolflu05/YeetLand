import { createFileRoute } from '@tanstack/react-router';
import { useMe } from "../hooks/useMe";
import { userQueryOptions } from "../components/layout/UserPageQuery";
import { getMe } from "../utils/api";
import { UserPage } from "../components/layout/UserPage";


export const Route = createFileRoute('/profile')({
  loader: async ({ context: { queryClient } }) => {
    const me = await queryClient.fetchQuery({ queryKey: ['me'], queryFn: getMe });
    return queryClient.ensureQueryData(userQueryOptions(me.username));
  },
  component: RouteComponent,
})

function RouteComponent() {
  const me = useMe();

  if (!me) {
    return null;
  }

  return <UserPage userId={me.username} />
}
