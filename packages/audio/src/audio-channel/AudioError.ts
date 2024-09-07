export class AudioError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AudioError';
  }
}
