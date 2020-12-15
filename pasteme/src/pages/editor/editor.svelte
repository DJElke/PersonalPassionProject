<script>
    import { onMount } from 'svelte';
    import { redirect } from '@roxi/routify'
    import { url } from '@roxi/routify';
    import { useFrontCamera, imageCapture, 
        isBackground, backgroundCapture } from '../../store.js';

    let stream, cameraView, timer, frontCamera, background;
    let flashIcon, frontFlash, timerCountdown, countdown, cameraSensor;

    let useFlash = false;
    let useTimer = false;

    useFrontCamera.subscribe(value => {
        frontCamera = value;
    });

    isBackground.subscribe(value => {
        background = value;
    });

    // timer variables
    const TIME_LIMIT = 6;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;

    const constraints = {
        video: {
            width: {
                min: 640,
                ideal: 1920,
                max: 2560,
            },
            height: {
                min: 480,
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
        cameraView = document.querySelector('.camera__view');
        cameraSensor = document.querySelector('.camera__sensor');

        flashIcon = document.querySelector('.flash');
        frontFlash = document.querySelector('.frontFlash');

        timer = document.querySelector('.timer');
        timerCountdown = document.querySelector('.timerCountdown');

        //hide the frontFlash, timerCountdown div
        frontFlash.classList.add('display-none');
        timerCountdown.classList.add('display-none');

        initializeCamera();
    });

    const initializeCamera = async() => {
        constraints.video.facingMode = frontCamera ? "user" : "environment";
        try{
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraView.srcObject = stream;

            if (!cameraView.captureStream) {
                cameraView.captureStream = () => stream;
            }

            cameraView.play();
        } catch(e){
            alert('Could not access the camera');
        }
    };

    const flipCamera = () => {
        useFrontCamera.set(!frontCamera);
        if(frontCamera){
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
        flashIcon.style.fill = useFlash ? "#9FCCEB" : "#FFFFFF";
    };

    const setTimer = () => {
        useTimer = !useTimer;
        // change icon's src 
        timer.src = useTimer ? "/icons/stopwatchset-light.svg" : "/icons/stopwatch-white.svg";
    };

    const clearTimer = () => {
        clearInterval(timerInterval);
    };

    const takePicture = () => {
        if(useTimer){
            timerInterval = setInterval(() => {
                timerCountdown.classList.remove('display-none');
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
                countdown = timeLeft;
                if(timeLeft === 0){
                    timerCountdown.classList.add('display-none');
                    clearTimer();
                    toggleFlash(frontFlash);
                    takeSnapshot ();
                }
            }, 1000);
        } else {
            toggleFlash(frontFlash);
            takeSnapshot ();
        }
    };

    const toggleFlash = (frontFlash) => {
        if(useFlash){
            if(frontCamera){
                frontFlash.classList.remove('display-none');
                fade(frontFlash);
            }
            else{
                alert("We don't support flash");
            } 
        }
    };

    const fade = (element)  =>{
        let op = 1;  // initial opacity
        let timer = setInterval(() => {
            if (op <= 0.1){
                clearInterval(timer);
                element.classList.add('display-none');
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 70);
    };

    const takeSnapshot = () => {
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        cameraSensor.getContext('2d').drawImage(cameraView, 0, 0);

        if(!background){
            imageCapture.set(cameraSensor.toDataURL('image/png'));
            $redirect('./editor-step2');
        } else {
            backgroundCapture.set(cameraSensor.toDataURL('image/png'));
            $redirect('./editor-step5');
        }
        stopVideoStream();
    };
</script>

<main class="camera">
    <!-- back button -->
    <a href={$url('../feed/index')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>

    <!-- hidden canvas element where we take the picture -->
    <canvas class="camera__sensor"></canvas>

    <!-- camera options -->
    <div class="camera__options">
        <img on:click={flipCamera} class="camera__options--icon" src="/icons/switch-white.svg" alt="flip"/>
        <svg on:click={triggerFlash} class="camera__options--icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 192 192" style="enable-background:new 0 0 512 512" xml:space="preserve"><g>
            <path class="flash" xmlns="http://www.w3.org/2000/svg" d="m155.109 74.028a4 4 0 0 0 -3.48-2.028h-52.4l8.785-67.123a4.023 4.023 0 0 0 -7.373-2.614l-63.724 111.642a4 4 0 0 0 3.407 6.095h51.617l-6.962 67.224a4.024 4.024 0 0 0 7.411 2.461l62.671-111.63a4 4 0 0 0 .048-4.027z" fill="#ffffff" data-original="#000000" style=""/>
        </g></svg>
        <img on:click={setTimer} class="camera__options--icon timer" src="/icons/stopwatch-white.svg" alt="stopwatch"/>
    </div>

    <!-- show the camera output -->
    <video class="camera__view camera__view--front" playsinline autoplay muted></video>

    <!-- hidden div to show the timer countdown when timer is checked -->
    <div class="timerCountdown"><p class="countdown">{countdown}</p></div>

    <!-- hidden div to "fake"/evoke the flash when using the front camera -->
    <div class="frontFlash"></div>

    <!-- button to take a picture -->
    <button on:click={takePicture} class="camera__trigger"><img class="camera__icon" src="/icons/camera-main.svg" alt="camera"/></button>
</main>

<style>
    .camera, .camera__view, .camera__sensor{
        position: fixed;
        height: -webkit-fill-available;
        width: -webkit-fill-available;
        object-fit: cover;
    }

    .camera__view--front, .camera__sensor{
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
    .frontFlash{
        width: 100%;
        height: 100vh;
        position: fixed;
        background-color: white;
        z-index: 200;
    }

    .timerCountdown{
        width: 100%;
        height: 100vh;
        position: fixed;
        z-index: 200;
    }

    .countdown{
        position: fixed;
        top: 50%;
        left: 50%;
        margin: 0;
        transform: translate(-50%, -50%);
        font-family: 'Source Sans Pro', sans-serif;
        font-weight: 700;
        font-size: 100px;
        color:white;
    }
</style>



