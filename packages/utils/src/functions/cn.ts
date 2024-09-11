'use client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A function to merge class names with Tailwind CSS.
 * @param inputs - The class names to merge.
 *
 * See {@link https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper | the documentation} for more information.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
