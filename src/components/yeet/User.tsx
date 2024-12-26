import { Avatar, Paper, Stack, Text } from "@mantine/core"
import { useNavigate } from "@tanstack/react-router"
import { useMe } from "../../hooks/useMe";

export const User = ({ user, size }: { user: string, size?: "xl" | "wide" }) => {
  const navigate = useNavigate();
  const me = useMe();

  return (
    <Paper
      key={user}
      withBorder
      p="sm"
      flex={1}
      maw={(size === "xl" || size == "wide") ? undefined : 120}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate({ to: `/users/$userId`, params: { userId: user } })}
    >
      <Stack
        justify={size === "wide" ? "flex-start" : "center"}
        align="stretch"
        style={{
          alignItems: "center",
          flexDirection: size === "wide" ? "row" : "column",
        }}
      >
        <Avatar
          size={size === "xl" ? 300 : size === "wide" ? "md" : "lg"}
          radius="xl"
          alt={user}
          name={user}
          color="initials"
        />
        <Text>{user}</Text>
        {size === "wide" && me?.username === user && <Text c="dimmed">(me)</Text>}
      </Stack>
    </Paper>
  )
}