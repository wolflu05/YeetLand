import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useMe } from "../hooks/useMe"

export const Route = createFileRoute('/profile')({
    component: RouteComponent,
})

function RouteComponent() {
    const me = useMe();

    if (me) {
        return <Navigate to={`/users/${me.username}`} />
    };
}
