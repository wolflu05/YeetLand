import { useQueries } from "@tanstack/react-query";
import { getYeet } from "../../utils/api";
import { Yeet } from "./Yeet";
import { Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";


export const YeetList = ({ yeetIds: _yeetIds, maxLoad = 10, depth = 0 }: { yeetIds: number[], maxLoad?: number, depth?: number }) => {
  const [cursor, setCursor] = useState(maxLoad);
  // const scrollRef = useRef<HTMLDivElement>(null);

  const yeetIds = useMemo(() => _yeetIds.sort((a, b) => b - a), [_yeetIds]);

  const yeetQueries = useQueries({
    queries: yeetIds.map((yeetId) => ({
      queryKey: ['yeets', yeetId],
      queryFn: () => getYeet(yeetId),
      staleTime: Infinity,
      enabled: yeetIds.indexOf(yeetId) < cursor,
    }))
  });

  // const isLoading = useMemo(() => yeetQueries.some((query) => query.isLoading), [yeetQueries]);

  // const handleScroll = (e: any) => {
  //   const bottom = Math.abs(Math.abs(e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight);
  //   if (bottom < 2 && !isLoading) {
  //     setCursor(c => c + 10);
  //   }
  // }

  const activeYeets = yeetQueries.slice(0, cursor).filter(query => (depth === 0 ? !query.data?.response.reply_to : true) && !!query.data);

  return (
    <Stack gap="xs">
      <Stack gap="lg">
        {activeYeets
          .map((query) => (
            query.data && <Yeet key={query.data.response.yeet_id} yeet={query.data?.response} depth={depth} />
          ))}
      </Stack>

      {depth === 0 && <Text c="dimmed" pt={0}>
        Showing {activeYeets.length} of {yeetIds.length} yeets{" "}
        <span onClick={() => setCursor(c => c + 10)} style={{ textDecoration: "underline", cursor: "pointer" }}>load more</span>
      </Text>}
    </Stack>
  );
}
