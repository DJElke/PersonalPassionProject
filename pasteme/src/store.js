import { writable } from 'svelte/store';

export const useFrontCamera = writable(true);
export const imageCapture = writable();