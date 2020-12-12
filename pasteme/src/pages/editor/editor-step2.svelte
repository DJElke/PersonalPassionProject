<script>
    import { useFrontCamera, imageCapture } from '../../store.js';

    let imageData, frontCamera;

    imageCapture.subscribe(value => {
        imageData = value;
    });

    useFrontCamera.subscribe(value => {
        frontCamera = value;
    });
</script>

<main>
    {#if frontCamera}
   <img src={imageData} alt ="snapshot" class="image__canvas image__canvas--front">
   {:else}
   <img src={imageData} alt ="snapshot" class="image__canvas">
   {/if}
</main>

<style>
    .image__canvas{
        position: fixed;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image__canvas--front{
        transform: scaleX(-1);
        filter: FlipH;
    }
</style>