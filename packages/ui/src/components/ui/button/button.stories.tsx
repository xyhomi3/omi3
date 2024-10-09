import type { Meta, StoryObj } from "@storybook/react";

import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Button component is a fundamental UI element used to trigger actions or events in a user interface. It is a clickable button that can be customized with various styles and functionalities to enhance user experience.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      description: "The variant of the button",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      description: "The size of the button",
      options: ["default", "sm", "lg", "icon"],
    },

    disabled: { control: "boolean", description: "The disabled state of the button" },
    asChild: { control: "boolean", description: "The asChild state of the button" },


  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default"
  },
};

export const Ghost: Story = {
  args: {
    variant: "neutral",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const Outline: Story = {
  args: {
    variant: "noShadow",
    children: "Outline",
  },
};
export const Reverse: Story = {
  args: {
    variant: "reverse",
    children: "Reverse",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};




export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

