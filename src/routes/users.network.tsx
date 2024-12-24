import { createFileRoute } from '@tanstack/react-router'
import { getAllUsers, getUserFollowing } from "../utils/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PromiseAllObject } from "../utils";
import { NetworkData, NetworkDiagram } from "../components/items/NetworkDiagram";
import { useMemo, useState } from "react";
import { Accordion, Container, Paper, Stack, Switch } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { Slider } from "../components/items/Slider";

const allUsersFollowingQueryOptions = queryOptions({
  queryKey: ['users', 'following'],
  queryFn: async () => {
    const users = await getAllUsers();
    console.log("users length", users.response.length);

    const following = await PromiseAllObject(
      Object.fromEntries(
        users.response.map((user) => [user, getUserFollowing(user).then((r) => r.response)])
      )
    );
    console.log("following", Object.keys(following).length);
    return following;
  },
  staleTime: Infinity,
});

export const Route = createFileRoute('/users/network')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(allUsersFollowingQueryOptions);
  }
})

function RouteComponent() {
  const allUsersFollowingQuery = useSuspenseQuery(allUsersFollowingQueryOptions);

  const [includeNonFollowingUsers, setIncludeNonFollowingUsers] = useState(false);

  const data = useMemo<NetworkData>(() => {
    const nodes = [...new Set([
      ...Object.keys(allUsersFollowingQuery.data ?? {}),
      ...Object.values(allUsersFollowingQuery.data ?? {}).flat()
    ])].map(x => ({ id: x, followers: 0 }));

    const links = Object.entries(allUsersFollowingQuery.data ?? {})
      .flatMap(([source, targets]) => targets.map((target: any) => ({ source, target })));

    if (!includeNonFollowingUsers) {
      const activeUsers = new Set(links.flatMap((link) => [link.source, link.target]));

      return {
        nodes: nodes.filter((node) => activeUsers.has(node.id)),
        links
      };
    }

    return { nodes, links };
  }, [allUsersFollowingQuery.data, includeNonFollowingUsers]);

  const { ref } = useElementSize<HTMLDivElement>();

  const [centerForce, setCenterForce] = useState(0.15);
  const [chargeForce, setChargeForce] = useState(-75);
  const [linkForce, setLinkForce] = useState(0.4);
  const [linkDistance, setLinkDistance] = useState(75);
  const [linkThickness, setLinkThickness] = useState(2);

  return (
    <Container ref={ref as any} h="90vh">
      <Stack style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 300,
      }}>
        <Paper withBorder>
          <Accordion>
            <Accordion.Item value="settings">
              <Accordion.Control>Settings</Accordion.Control>
              <Accordion.Panel>
                <Switch
                  checked={includeNonFollowingUsers}
                  onChange={() => setIncludeNonFollowingUsers((v) => !v)}
                  label="Include non-active users"
                  pb={10}
                />

                <Slider
                  value={centerForce}
                  onChangeEnd={(e) => setCenterForce(e)}
                  label="Center force"
                  min={0.001}
                  max={0.5}
                  step={0.001}
                />

                <Slider
                  value={chargeForce}
                  onChangeEnd={setChargeForce}
                  label="Charge force"
                  min={-100}
                  max={-10}
                  step={1}
                />

                <Slider
                  value={linkForce}
                  onChangeEnd={setLinkForce}
                  label="Link force"
                  min={0.1}
                  max={1}
                  step={0.1}
                />

                <Slider
                  value={linkDistance}
                  onChangeEnd={setLinkDistance}
                  label="Link distance"
                  min={10}
                  max={200}
                  step={1}
                />

                <Slider
                  value={linkThickness}
                  onChangeEnd={setLinkThickness}
                  label="Link thickness"
                  min={1}
                  max={10}
                  step={1}
                />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>
      </Stack>

      <NetworkDiagram
        width={ref.current?.offsetWidth ?? 800}
        height={ref.current?.offsetHeight ?? 800}
        data={data}
        params={{
          centerForce: centerForce ** 2,
          chargeForce,
          linkForce,
          linkDistance,
          linkThickness,
        }}
      />
    </Container>
  )
}
