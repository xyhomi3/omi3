/**
 * Represents a function that handles value changes.
 * @param newValue The new value.
 */
type SeekHandler = (newValue: number) => void;

/**
 * Creates handlers for seek-like interactions compatible with Radix UI Slider.
 * This function can be used for audio seeking, volume control, or any other slider-based interaction.
 *
 * @param handler A function to be called with the newly calculated value.
 * @returns An object with onValueChange and onValueCommit handlers for the Slider component.
 */
export function seek(handler: SeekHandler) {
  return {
    onValueChange: (value: number[]) => {
      if (value.length > 0) {
        handler(value[0]);
      }
    },
    onValueCommit: (value: number[]) => {
      if (value.length > 0) {
        handler(value[0]);
      }
    },
  };
}
