import { AppShell, Burger, createTheme, em, Group, MantineProvider, NavLink, Stack, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ModalsProvider } from '@mantine/modals';
import { IconBrandGithub, IconCompass, IconHome, IconSend, IconUserCircle, IconUsersGroup } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CreateYeetModal } from "../modals/CreateYeetModal";

const theme = createTheme({});

const NAV_LINKS: {
  href: string;
  label: string;
  icon: React.ReactNode;
}[] = [
    { href: "/", label: "Feed", icon: <IconHome /> },
    { href: "/explore", label: "Explore", icon: <IconCompass /> },
    { href: "/users", label: "Users", icon: <IconUsersGroup /> },
    { href: "/profile", label: "Profile", icon: <IconUserCircle /> },
  ];

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(767)})`);

  const [createYeetModalOpened, setCreateYeetModalOpened] = useState(false);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <AppShell
          header={isMobile ? { height: 60 } : undefined}
          navbar={{
            width: 260,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="sm"
        >
          <AppShell.Header hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} size="md" p="30px" />
          </AppShell.Header>

          <AppShell.Navbar p="md" styles={{ navbar: { justifyContent: "space-between" } }}>
            <Stack gap="xs">
              {NAV_LINKS.map(({ href, label, icon }) => (
                <NavLink
                  onClick={close}
                  key={href}
                  component={Link}
                  to={href}
                  label={label}
                  leftSection={icon}
                  styles={{
                    root: { borderRadius: "12px" },
                    label: { fontSize: "16px" }
                  }}
                />
              ))}

              <NavLink
                label="Yeet"
                leftSection={<IconSend />}
                styles={{
                  root: { borderRadius: "12px", border: "0.5px solid #ccc" },
                  label: { fontSize: "16px" }
                }}
                onClick={() => setCreateYeetModalOpened(true)}
              />
            </Stack>

            <Stack gap={-10} justify="center" style={{ alignItems: "center" }}>
              <Text size="sm" c="dimmed" mb={10}>Created by Lukas</Text>

              <Group gap="xs">
                <Text size="sm" c="dimmed">See on</Text>
                <a href="https://github.com/wolflu05/YeetLand" target="_blank" rel="noreferrer noopener" style={{ height: "25px" }}>
                  <IconBrandGithub size="25px" color="#fff" />
                </a>
                v{__APP_VERSION__}
              </Group>
            </Stack>
          </AppShell.Navbar>

          <AppShell.Main>
            {children}

            <CreateYeetModal
              opened={createYeetModalOpened}
              setOpened={setCreateYeetModalOpened}
            />
          </AppShell.Main>
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  )
}
