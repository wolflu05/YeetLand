import { Button, ButtonGroup, Drawer, Group, Paper, Stack, Text } from "@mantine/core";
import { formatTimestamp, PromiseAllObject } from "../../utils";
import { IconArrowForward, IconExternalLink, IconThumbUp, IconTrash } from "@tabler/icons-react";
import { createLike, getYeetLikes, getYeetReplies, removeLike, removeYeet, YeetT } from "../../utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { modals } from "@mantine/modals";
import { useMe } from "../../hooks/useMe";
import { Tooltip } from "../items/Tooltip";
import { Link } from "@tanstack/react-router";
import { YeetList } from "./YeetList";
import { useState } from "react";
import { CreateYeetModal } from "../modals/CreateYeetModal";
import { useLongPress } from "@uidotdev/usehooks";
import { useDisclosure } from "@mantine/hooks";
import { User } from "./User";

export const Yeet = ({ yeet, depth = 0, maxDepth = Infinity }: { yeet: YeetT, depth?: number, maxDepth?: number }) => {
  const detailQuery = useQuery({
    queryKey: ['yeets', yeet.yeet_id, { type: 'detail' }],
    queryFn: () => PromiseAllObject({
      likes: getYeetLikes(yeet.yeet_id),
      replies: getYeetReplies(yeet.yeet_id),
    }),
    staleTime: 1000 * 10,
  });
  const me = useMe();
  const queryClient = useQueryClient();

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!me) return;

      if (detailQuery.data?.likes.response.includes(me?.username)) {
        await removeLike(yeet.yeet_id);
      } else {
        await createLike(yeet.yeet_id);
      }

      detailQuery.refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await removeYeet(yeet.yeet_id);
      queryClient.invalidateQueries({ queryKey: ['yeets'] });
    },
  });

  const openDeleteModal = () => modals.openConfirmModal({
    title: "Delete yeet",
    children: (
      <Text size="sm">
        Are you sure you want to delete this yeet?
        This action cannot be undone.
      </Text>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: () => deleteMutation.mutate(),
  });

  const [replyOpen, setReplyOpen] = useState(false);

  const likeButtonProps = useLongPress(() => openLikeDrawer(), {
    onCancel: () => toggleLike.mutate(),
  });
  const [likeDrawerOpen, { open: openLikeDrawer, close: closeLikeDrawer }] = useDisclosure(false);

  const [showReplies, setShowReplies] = useState(depth < maxDepth);

  return (
    <Paper withBorder p="sm">
      <Group justify="space-between">
        <Stack gap="4px" miw="200px" w="100%">
          <Text style={{ overflowWrap: "break-word" }}>{yeet.content}</Text>

          <Group gap="xs">
            <Text c="dimmed" size="xs">
              <Link to="/users/$userId" params={{ userId: yeet.author }} style={{ color: "inherit" }}>
                {yeet.author}
              </Link> - {formatTimestamp(yeet.date)}</Text>
          </Group>
        </Stack>

        <ButtonGroup>
          {me?.username === yeet.author && (
            <Button
              variant="outline"
              color="red"
              size="sm"
              px={10}
              loading={detailQuery.isLoading}
              onClick={openDeleteModal}
            >
              <IconTrash size={18} />
            </Button>
          )}

          <Button variant="outline" size="sm" px={10} loading={detailQuery.isLoading} onClick={() => setReplyOpen(true)}>
            <IconArrowForward size={18} />

            <Text ml="xs">
              {detailQuery.data?.replies.response.length}
            </Text>
          </Button>

          <Button
            variant={me && detailQuery.data?.likes.response.includes(me?.username) ? "filled" : "outline"}
            size="sm"
            px={10}
            loading={detailQuery.isLoading || toggleLike.isPending}
            {...likeButtonProps}
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
          >
            <Tooltip label={detailQuery.data?.likes.response.join(", ")}>
              <IconThumbUp size={18} />
            </Tooltip>

            <Text ml="xs">
              {detailQuery.data?.likes.response.length}
            </Text>
          </Button>

          <Button variant="outline" size="sm" px={10} component={Link} to="/explore/$yeetId" params={{ yeetId: `${yeet.yeet_id}` } as any}>
            <IconExternalLink size={18} />
          </Button>
        </ButtonGroup>
      </Group>

      {detailQuery.data && detailQuery.data.replies.response.length > 0 && (showReplies ? (
        <Stack gap="xs" mt="sm" ml="lg">
          <YeetList yeetIds={detailQuery.data?.replies.response ?? []} maxLoad={Infinity} depth={depth + 1} maxDepth={maxDepth} />
        </Stack>
      ) : (
        <Button onClick={() => setShowReplies(true)} mt="sm" variant="outline">Load replies</Button>
      ))}

      <CreateYeetModal opened={replyOpen} setOpened={setReplyOpen} reply_to={yeet.yeet_id} />

      <Drawer position="bottom" opened={likeDrawerOpen} onClose={closeLikeDrawer} title="Likes" styles={{ title: { fontSize: "20px" } }}>
        <Stack gap="xs">
          {detailQuery.data?.likes.response.map((username) => (
            <User key={username} user={username} size="wide" />
          ))}
        </Stack>
      </Drawer>
    </Paper >
  )
}
