<script>
    import { onMount } from 'svelte';

    const width = window.innerWidth;
    const height = window.innerHeight;

    let video, stream, cameraView;
    let useFrontCamera = true;

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
        console.log(constraints.video.facingMode);
    };

    const changeFacingMode = () => {
        if(useFrontCamera){
            constraints.video.facingMode = "user";
        }
        else{
            constraints.video.facingMode = "environment";
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
</script>

<main class="camera">
    <!-- back button -->
    <img class="backbtn" src="/icons/back-white.svg" alt="back"/>

    <!-- camera options -->
    <div class="camera__options">
        <img on:click={flipCamera} class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
        <img class="camera__options--icon" src="/icons/flash-white.svg" alt="flash"/>
        <img class="camera__options--icon" src="/icons/stopwatch-white.svg" alt="stopwatch"/>
    </div>

    <!-- show the camera output -->
    <video class="camera__view camera__view--front" bind:this={video} width={width} height={height} playsinline autoplay muted></video>

    <!-- button to take a picture -->
    <button class="camera__trigger"><img class="camera__icon" src="/icons/camera-main.svg" alt="camera"/></button>
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
        filter: FlipV;
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
</style>



