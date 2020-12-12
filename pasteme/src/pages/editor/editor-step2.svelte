<script>
    import { useFrontCamera, imageCapture } from '../../store.js';

    let imageData;

    const unsubscribe = imageCapture.subscribe(value => {
        imageData = value;
    });
</script>

<main>
    {#if useFrontCamera}
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