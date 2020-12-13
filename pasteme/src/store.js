import { writable } from 'svelte/store';

export const useFrontCamera = writable(true);
export const imageCapture = writable();
export const modelImage = writable();
export const finalEditImage = writable();