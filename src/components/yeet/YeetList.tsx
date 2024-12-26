import { useQueries } from "@tanstack/react-query";
import { getYeet } from "../../utils/api";
import { Yeet } from "./Yeet";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowEvent } from "@mantine/hooks";


export const YeetList = ({ yeetIds: _yeetIds, maxLoad = 10, depth = 0, showRootReplies = false, maxDepth = Infinity }: { yeetIds: number[], maxLoad?: number, depth?: number, showRootReplies?: boolean, maxDepth?: number }) => {
  const [cursor, setCursor] = useState(maxLoad);
  const stackRef = useRef<HTMLDivElement>(null);

  const yeetIds = useMemo(() => _yeetIds.sort((a, b) => b - a), [_yeetIds]);

  const yeetQueries = useQueries({
    queries: yeetIds.map((yeetId) => ({
      queryKey: ['yeets', yeetId],
      queryFn: () => getYeet(yeetId),
      staleTime: Infinity,
      enabled: yeetIds.indexOf(yeetId) < cursor,
    }))
  });

  const isLoading = useMemo(() => yeetQueries.some((query) => query.isLoading), [yeetQueries]);

  const scrollBottom = useCallback(() => {
    setCursor(c => c < yeetIds.length ? c + 10 : c);
  }, [yeetIds.length]);

  // auto load new yeets when there are not enough yeets to fill the screen by trying to only load 10 yeets initially
  useEffect(() => {
    if (!stackRef.current) return;

    const observer = new ResizeObserver(() => {
      if (!stackRef.current || isLoading) return;

      if (stackRef.current.scrollHeight - stackRef.current.scrollTop < window.innerHeight + 100 && cursor < yeetIds.length) {
        scrollBottom();
      }
    });

    observer.observe(stackRef.current);
    return () => observer.disconnect();
  }, [cursor, isLoading, scrollBottom, yeetIds.length]);

  useWindowEvent("scroll", () => {
    if (depth !== 0) return;

    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if (bottom && cursor < yeetIds.length && !isLoading) {
      scrollBottom();
    }
  });

  const activeYeets = yeetQueries.slice(0, cursor).filter(query => query.isFetched && ((depth === 0 && !showRootReplies) ? !query.data?.response.reply_to : true));
  const allYeetsLength = (depth === 0 && !showRootReplies) ? yeetQueries.filter(query => !query.data?.response.reply_to || !query.isFetched).length : yeetIds.length

  return (
    <Stack gap="xs" ref={stackRef}>
      <Stack gap="lg">
        {activeYeets
          .map((query) => (
            query.data && <Yeet key={query.data.response.yeet_id} yeet={query.data?.response} depth={depth} maxDepth={maxDepth} />
          ))}
      </Stack>

      {isLoading && (
        <Center>
          <Loader />
        </Center>
      )}

      {depth === 0 && <Text c="dimmed" pt={0}>
        Showing {activeYeets.length} of {allYeetsLength} yeets{" "}
        {activeYeets.length < allYeetsLength && <span onClick={scrollBottom} style={{ textDecoration: "underline", cursor: "pointer" }}>load more</span>}
      </Text>}
    </Stack>
  );
}
