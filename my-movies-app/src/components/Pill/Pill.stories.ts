import type { Meta, StoryObj } from "@storybook/react";

import Pill from "./Pill";

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  tags: ["autodocs"],
  args: {
    text: "Hello",
    color: "default",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "destructive", "success", "custom"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {};
export const Success: Story = {
  args: {
    color: "success",
    text: "Success",
  },
};

export const Destructive: Story = {
  args: {
    color: "destructive",
    text: "Error",
  },
};

export const Custom: Story = {
  args: {
    color: "custom",
    text: "Custom Pill",
  },
};
