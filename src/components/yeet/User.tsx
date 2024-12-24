import { Avatar, Paper, Stack, Text } from "@mantine/core"
import { useNavigate } from "@tanstack/react-router"

export const User = ({ user, size }: { user: string, size?: "xl" }) => {
  const navigate = useNavigate();

  return (
    <Paper
      key={user}
      withBorder
      p="sm"
      flex={1}
      maw={size === "xl" ? undefined : 120}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate({ to: `/users/$userId`, params: { userId: user } })}
    >
      <Stack
        justify="center"
        align="stretch"
        style={{ alignItems: 'center' }}
      >
        <Avatar
          size={size === "xl" ? 300 : "lg"}
          radius="xl"
          alt={user}
          name={user}
          color="initials"
        />
        <Text>{user}</Text>
      </Stack>
    </Paper>
  )
}