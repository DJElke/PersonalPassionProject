import { writable } from 'svelte/store';

export const useFrontCamera = writable();
useFrontCamera.set(true);
export const imageCapture = writable();