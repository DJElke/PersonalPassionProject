import { writable } from 'svelte/store';

export const useFrontCamera = writable(true);
export const imageCapture = writable();
export const backgroundCapture = writable();
export const modelImage = writable();
export const finalEditImage = writable();
export const isBackground = writable(false);