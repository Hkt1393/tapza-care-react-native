export interface ExampleItem {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export * from './domain';

export type ScreenState = 'idle' | 'loading' | 'success' | 'error' | 'empty';
