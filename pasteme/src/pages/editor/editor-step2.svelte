<script>
    import { imageCapture } from '../../store.js';

    let imageData;

    const unsubscribe = imageCapture.subscribe(value => {
        imageData = value;
    });

    console.log(imageData);
</script>

<main>
   <img src={imageData} alt ="snapshot" class="image__canvas">
</main>

<style>
    .image__canvas{
        position: fixed;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1);
        filter: FlipH;
    }
</style>