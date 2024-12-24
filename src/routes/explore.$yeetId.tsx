import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from '@tanstack/react-router'
import { getYeet } from "../utils/api"
import { Yeet } from "../components/yeet/Yeet"

const yeetQueryOptions = (yeetId: number) => queryOptions({
    queryKey: ['yeets', yeetId],
    queryFn: () => getYeet(yeetId),
    staleTime: 60 * 1000,
})

export const Route = createFileRoute('/explore/$yeetId')({
    loader: ({ context: { queryClient }, params: { yeetId } }) => {
        return queryClient.ensureQueryData(yeetQueryOptions(parseInt(yeetId)))
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { yeetId } = Route.useParams();
    const yeetQuery = useSuspenseQuery(yeetQueryOptions(parseInt(yeetId)));

    return <Yeet yeet={yeetQuery.data?.response} />
}
