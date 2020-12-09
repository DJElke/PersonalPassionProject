<script>
    import { onMount } from 'svelte';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let canvas, video;
    let ctx;

    onMount(async() => {
        ctx = canvas.getContext('2d');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.loop = true;
        video.objectfit = "cover";
        video.height = height;
        video.srcObject = stream;

        if (!video.captureStream) {
            video.captureStream = () => stream;
        }

        console.log(video);

        video.play();
        requestAnimationFrame(draw);
    });

    const draw = () => {
        ctx.drawImage(video, 0,0, width, height);
        requestAnimationFrame(draw);
    };

</script>

<main class="camera">
    <canvas class="camera__view" bind:this={canvas} width={width} height={height}></canvas>
</main>

<style>
    .camera{
        position: fixed;
        object-fit: cover;
    }

    .camera__view{
        transform: scaleX(-1);
        filter: FlipH;
        object-fit: cover;
    }
</style>



