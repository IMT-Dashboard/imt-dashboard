import { writable, type Writable } from 'svelte/store';

export const currentSemester: Writable<number> = writable();
