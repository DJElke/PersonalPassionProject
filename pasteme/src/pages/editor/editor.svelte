<script>
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let video, stream, cameraView, flash, timer, frontFlash;

    let useFrontCamera = true;
    let useFlash = false;
    let useTimer = false;

    const constraints = {
        video: {
            width: {
                min: 1280,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 720,
                ideal: 1080,
                max: 1440
            },
        }, 
        audio: false, 
    };

    const stopVideoStream = () => {
        if(stream){
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };

    onMount(async() => {
        if(!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices){
            alert("Camera API is not available in your browser");
            return;
        }

        cameraView = document.querySelector('.camera__view');
        flash = document.querySelector('.flash');
        frontFlash = document.querySelector('.frontFlash');
        timer = document.querySelector('.timer');

        //hide the frontFlash div
        frontFlash.classList.add('display-none');

        initializeCamera();
    });

    const initializeCamera = async() => {
        stopVideoStream();
        constraints.video.facingMode = useFrontCamera ? "user" : "environment";
        try{
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;

            if (!video.captureStream) {
                video.captureStream = () => stream;
            }

            video.play();
        } catch(e){
            alert('Could not access the camera');
        }
    };

    const flipCamera = () => {
        useFrontCamera = !useFrontCamera;
        if(useFrontCamera){
            cameraView.classList.add('camera__view--front');
            cameraView.classList.remove('camera__view--rear');
        } else {
            cameraView.classList.remove('camera__view--front');
            cameraView.classList.add('camera__view--rear');
        }
        initializeCamera();
    };

    const triggerFlash = () => {
        useFlash = !useFlash;
        // change color of flash
        flash.style.fill = useFlash ? "#9FCCEB" : "#FFFFFF";
    };

    const setTimer = () => {
        useTimer = !useTimer;
        // change icon's path
        timer.src = useTimer ? "/icons/stopwatch-white.svg" : "/icons/stopwatchset-light.svg";
    };

    const takePicture = () => {
        if(useFlash || useTimer){
            if(useFrontCamera){
                frontFlash.classList.remove('display-none');
                fade(frontFlash);
            }
        }
    };

    const fade = (element)  =>{
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.classList.add('display-none');
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 100);
    };
</script>

<main class="camera">
    <!-- back button -->
    <a href={$url('../feed/index')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>

    <!-- camera options -->
    <div class="camera__options">
        <img on:click={flipCamera} class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
        <svg on:click={triggerFlash} class="camera__options--icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 192 192" style="enable-background:new 0 0 512 512" xml:space="preserve"><g>
            <path class="flash" xmlns="http://www.w3.org/2000/svg" d="m155.109 74.028a4 4 0 0 0 -3.48-2.028h-52.4l8.785-67.123a4.023 4.023 0 0 0 -7.373-2.614l-63.724 111.642a4 4 0 0 0 3.407 6.095h51.617l-6.962 67.224a4.024 4.024 0 0 0 7.411 2.461l62.671-111.63a4 4 0 0 0 .048-4.027z" fill="#ffffff" data-original="#000000" style=""/>
        </g></svg>
        <img on:click={setTimer} class="camera__options--icon timer" src="/icons/stopwatch-white.svg" alt="stopwatch"/>
    </div>

    <!-- show the camera output -->
    <video class="camera__view camera__view--front" bind:this={video} width={width} height={height} playsinline autoplay muted></video>

    <!-- hidden div to show the timer countdown when timer is checked -->
    <div class="timerCountdown"></div>

    <!-- hidden div to "fake"/evoke the flash when using the front camera -->
    <div class="frontFlash"></div>

    <!-- hidden canvas element where we paste the taken picture -->
    <canvas></canvas>

    <!-- button to take a picture -->
    <button on:click={takePicture} class="camera__trigger"><img class="camera__icon" src="/icons/camera-main.svg" alt="camera"/></button>
</main>

<style>
    .camera, .camera__view{
        position: fixed;
        object-fit: cover;
    }

    .camera__view--front{
        transform: scaleX(-1);
        filter: FlipH;
    }

    .camera__view--rear{
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
        width: 35px;
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

    .frontFlash{
        width: 100%;
        height: 100vh;
        position: fixed;
        background-color: white;
        z-index: 200;
    }
</style>



