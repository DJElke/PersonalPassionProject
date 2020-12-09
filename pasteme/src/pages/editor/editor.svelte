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

        video.play();
    });

</script>

<main class="camera">
    <!-- back button -->
    <img class="backbtn" src="/icons/back-white.svg" alt="back"/>

    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
        <img class="camera__options--icon" src="/icons/flash-white.svg" alt="flash"/>
        <img class="camera__options--icon" src="/icons/stopwatch-white.svg" alt="stopwatch"/>
    </div>

    <!-- show the camera output -->
    <video class="camera__view" bind:this={video} width={width} height={height} playsinline autoplay muted></video>

    <!-- button to take a picture -->
    <button class="camera__trigger"><img class="camera__icon" src="/icons/camera-main.svg" alt="camera"/></button>
</main>

<style>
    .camera, .camera__view{
        position: fixed;
        object-fit: cover;
    }

    .camera__view{
        transform: scaleX(-1);
        filter: FlipH;
    }

    .camera__trigger{
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: calc(100px - (80px/1));
        margin-bottom: 0;
        height: 80px;
        width: 80px;
        border-radius: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        background-color: white;
        z-index: 9;
        transition: height 0.3s;
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.2);
    }

    .camera__icon{
        width: 75%;
        height: auto;
    }

    .camera__options{
        right: 5%;
        top: 5%;
        width: 30px;
        height: auto;
        z-index: 9;
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #112140; 
        border-radius: 40px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .camera__options--icon{
        width: 75%;
        height: auto;
        padding-top: 12px;
        padding-bottom: 12px;
        position:relative;
    }
</style>



