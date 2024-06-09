import { writable } from 'svelte/store';

export const hideNavigation = writable(false);
export const isSmallScreen = writable(false);