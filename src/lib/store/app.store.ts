import { type Writable, writable } from 'svelte/store';
import { type AppState, defaultAppState } from '$lib/models/app.model';

export const appStore: Writable<AppState> = writable(defaultAppState);

export function setPlanningLoadedState(isPlanningLoaded: boolean) {
	appStore.update((state) => ({ ...state, isPlanningLoaded }));
}
