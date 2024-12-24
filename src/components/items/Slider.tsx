import { SliderProps, Slider as MantineSlider, Stack, Text } from "@mantine/core";
import { useState } from "react";

export const Slider = ({ value: _value, onChangeEnd, label, ...props }: {
  value: number,
  onChangeEnd: (value: number) => void,
  label: string,
} & SliderProps) => {
  const [value, setValue] = useState(() => _value);

  return (
    <Stack gap="xs">
      <Text size="sm">{label}</Text>
      <MantineSlider
        value={value}
        onChange={setValue}
        onChangeEnd={onChangeEnd}
        label={(x) => x}
        showLabelOnHover
        {...props}
      />
    </Stack>
  )
}  