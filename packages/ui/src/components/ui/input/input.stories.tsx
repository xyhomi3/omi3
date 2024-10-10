import type { Meta, StoryObj } from "@storybook/react";

import { Input } from ".";
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Input component is a fundamental UI element used for text or data input. It can be customized with various styles and functionalities to enhance user experience.",
      },
    },
  },
  argTypes: {

    disabled: { control: "boolean", description: "The disabled state of the input" },
    placeholder: { control: "text", description: "The placeholder text of the input" },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter text",
    onChange: action('onChange'),
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Password",
    onChange: action('onChange'),
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Email",
    onChange: action('onChange'),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled",
    onChange: action('onChange'),
  },
};
