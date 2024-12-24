import { Button, Group, Modal, Text, Textarea } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createYeet } from "../../utils/api";
import { MAX_YEET_LENGTH } from "../../utils/constants";

export const CreateYeetModal = ({ reply_to, opened, setOpened }: { reply_to?: number, opened: boolean, setOpened: (v: boolean) => void }) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const createYeetMutation = useMutation({
    mutationFn: async () => {
      try {
        await createYeet({ content, reply_to });
        setContent("");
        queryClient.invalidateQueries({ queryKey: ['yeets'] });
        setOpened(false);
      } catch (e) {
        console.error(e);
      }
    }
  });

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title={reply_to ? "Reply to" : "Create yeet"}>
      <Textarea
        placeholder="Yeet something"
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        autosize
        minRows={3}
        maxRows={20}
      />
      <Text size="sm" ta="right" c={content.length > MAX_YEET_LENGTH ? "red" : "dimmed"}>
        {content.length} / {MAX_YEET_LENGTH}
      </Text>

      <Group justify="flex-end" mt="md">
        <Button
          onClick={() => {
            createYeetMutation.mutate();
          }}
          disabled={content.length === 0 || content.length > MAX_YEET_LENGTH}
          loading={createYeetMutation.isPending}
        >
          Yeeeeet
        </Button>
      </Group>
    </Modal>
  )
}
