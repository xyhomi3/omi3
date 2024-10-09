import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '.';

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    docs: {
      description: {
        component: "The Input component is a fundamental UI element used to trigger actions or events in a user interface. It is a clickable button that can be customized with various styles and functionalities to enhance user experience.",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
