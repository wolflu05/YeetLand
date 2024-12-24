import { Tooltip as MantineTooltip } from "@mantine/core";

export const Tooltip = ((props) => {
  if (!props.label) return props.children;

  return <MantineTooltip {...props} />;
}) as typeof MantineTooltip;
