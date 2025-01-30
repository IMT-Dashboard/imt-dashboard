import { type Writable, writable } from 'svelte/store';
import type { Subject } from '$lib/models/schedule.model';

export const scheduleStore: Writable<Subject[]> = writable([]);
