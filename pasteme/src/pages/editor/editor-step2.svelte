<script>
    import { onMount } from 'svelte';
    import { imageCapture } from '../../store.js';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let imageData, img, canvas;

    const unsubscribe = imageCapture.subscribe(value => {
        imageData = value;
    });

    onMount(() => {
        canvas = document.querySelector('.imgCanvas');
        img = document.createElement('img');
        img.src = imageData;
        img.alt = "snapshot";
        requestAnimationFrame(draw);
    });

    const draw = () => {
        canvas.getContext('2d').drawImage(img,0,0);
        requestAnimationFrame(draw);
    }


</script>

<main>
    <canvas class="imgCanvas" width={width} height={height}></canvas>
</main>

<style>
    .imgCanvas{
        position: fixed;
        object-fit: cover;
        filter: FlipH;
    }

    img{
        object-fit: cover;
    }
</style>