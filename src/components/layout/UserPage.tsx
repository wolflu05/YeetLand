import { Accordion, Badge, Button, Group, Stack, Title } from '@mantine/core'
import {
  followUser, unfollowUser
} from '../../utils/api'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { User } from "../../components/yeet/User"
import { YeetList } from "../../components/yeet/YeetList"
import { useMe } from "../../hooks/useMe"
import { userQueryOptions } from "./UserPageQuery"

export const UserPage = ({ userId }: { userId: string }) => {
  const userQuery = useSuspenseQuery(userQueryOptions(userId));
  const me = useMe();

  const doIFollow = me && userQuery.data.followers.response.includes(me?.username);

  const toggleFollow = useMutation({
    mutationFn: async () => {
      if (!me) return;

      if (doIFollow) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      userQuery.refetch();
    }
  });

  return (
    <Stack>
      <Group>
        <Title ml={15} order={2}>{userId}'s Profile</Title>

        {userId !== me?.username && (
          <Button variant={doIFollow ? "filled" : "outline"} onClick={() => toggleFollow.mutate()} disabled={toggleFollow.isPending}>
            {doIFollow ? "Unfollow" : "Follow"}
          </Button>
        )}
      </Group>

      <Accordion multiple defaultValue={["yeets"]}>
        <Accordion.Item value="following">
          <Accordion.Control>
            <Group>
              <Title order={3}>Following</Title>
              <Badge color="blue">{userQuery.data?.following.response.length}</Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Group grow mt={10}>
              {userQuery.data?.following.response.map((user) => (
                <User key={user} user={user} />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="followers">
          <Accordion.Control>
            <Group>
              <Title order={3}>Followers</Title>
              <Badge color="blue">{userQuery.data?.followers.response.length}</Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Group grow mt={10}>
              {userQuery.data?.followers.response.map((user) => (
                <User key={user} user={user} />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="yeets">
          <Accordion.Control>
            <Group>
              <Title order={3}>Yeets</Title>
              <Badge color="blue">{userQuery.data?.yeets.response.length}</Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Group grow mt={10}>
              <YeetList yeetIds={userQuery.data?.yeets.response ?? []} showRootReplies maxDepth={0} />
            </Group>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="likes">
          <Accordion.Control>
            <Group>
              <Title order={3}>Likes</Title>
              <Badge color="blue">{userQuery.data?.likes.response.length}</Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Group grow mt={10}>
              <Group grow mt={10}>
                <YeetList yeetIds={userQuery.data?.likes.response ?? []} showRootReplies maxDepth={0} />
              </Group>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  )
}