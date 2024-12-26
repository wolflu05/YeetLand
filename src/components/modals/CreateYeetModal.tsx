import { Box, Button, Group, Modal, Portal, Text, Textarea } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createYeet } from "../../utils/api";
import { MAX_YEET_LENGTH } from "../../utils/constants";
import { useInterval } from "@mantine/hooks";

const rocketSize = 200;
const initialState = { x: -rocketSize, y: -rocketSize, size: rocketSize, show: false, startTime: 0 };

export const CreateYeetModal = ({ reply_to, opened, setOpened }: { reply_to?: number, opened: boolean, setOpened: (v: boolean) => void }) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const [rocketState, setRocketState] = useState(() => ({ ...initialState }));
  const animationInterval = useInterval(() => {
    if (rocketState.x > window.innerWidth || rocketState.y > window.innerHeight) {
      setRocketState({ ...initialState });
      animationInterval.stop();
    } else {
      setRocketState((state) => {
        const speed = 2 ** ((Date.now() - state.startTime) * 0.009);
        return { ...state, x: state.x + speed, y: state.y + speed }
      });
    }
  }, 10);

  const startAnimation = () => {
    setRocketState({ ...initialState, show: true, startTime: Date.now() });
    animationInterval.start();
  };

  const createYeetMutation = useMutation({
    mutationFn: async () => {
      try {
        await createYeet({ content, reply_to });
        startAnimation();
        setContent("");
        queryClient.invalidateQueries({ queryKey: ['yeets'] });
        setOpened(false);
      } catch (e) {
        console.error(e);
      }
    }
  });

  return (
    <>
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
            🚀 Yeeeeet
          </Button>
        </Group>
      </Modal>

      <Portal>
        {rocketState.show && (
          <Box
            style={{
              position: "fixed",
              left: rocketState.x,
              bottom: rocketState.y,
              zIndex: 100000,
              fontSize: rocketState.size,
            }}
          >🚀</Box>
        )}
      </Portal>
    </>
  )
}
