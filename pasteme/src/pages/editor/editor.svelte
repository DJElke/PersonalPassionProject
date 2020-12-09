<script>
    import { onMount } from 'svelte';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let video;

    onMount(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;

        if (!video.captureStream) {
            video.captureStream = () => stream;
        }

        console.log(video);

        video.play();
    });

</script>

<main class="camera">
    <video class="camera__view" bind:this={video} width={width} height={height} playsinline autoplay muted></video>
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



