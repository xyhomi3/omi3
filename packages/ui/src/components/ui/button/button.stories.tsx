import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Button component is a fundamental UI element used to trigger actions or events in a user interface. It is a clickable button that can be customized with various styles and functionalities to enhance user experience.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      description: 'La variante du bouton',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      description: 'La taille du bouton',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean', description: "L'état désactivé du bouton" },
    asChild: { control: 'boolean', description: "L'état asChild du bouton" },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
    onClick: action('onClick'),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'neutral',
    children: 'Ghost',
    onClick: action('onClick'),
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
    onClick: action('onClick'),
  },
};

export const Outline: Story = {
  args: {
    variant: 'noShadow',
    children: 'Outline',
    onClick: action('onClick'),
  },
};

export const Reverse: Story = {
  args: {
    variant: 'reverse',
    children: 'Reverse',
    onClick: action('onClick'),
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
    onClick: action('onClick'),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
    onClick: action('onClick'),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
    onClick: action('onClick'),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
    onClick: action('onClick'),
  },
};
