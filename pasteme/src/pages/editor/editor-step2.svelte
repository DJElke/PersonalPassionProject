<script>
    import { imageCapture } from '../../store.js';

    let image;

    const unsubscribe = imageCapture.subscribe(value => {
        image = value;
    });
</script>

<main>
    <img src={image} alt="test"/>
</main>

<style>
    img{
        position: fixed;
        object-fit: cover;
        filter: FlipH;
    }
</style>