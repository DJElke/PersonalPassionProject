<script>
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify';
    import { imageCapture, modelImage } from '../../store.js';

    let width = window.innerWidth;
    let height = window.innerHeight;

    let canvas, imageData, image, context;

    let useEraser = false;
    let touchDown = false;

    onMount(() => {
        //retrieve image data from store
        imageCapture.subscribe(value => {
            imageData = value;
        });

        canvas = document.querySelector('.editor__canvas');
        context = canvas.getContext('2d');

        image = new Image();
        image.src = imageData;
        image.alt = "u2net";
        image.addEventListener('load', () => {
            requestAnimationFrame(draw);
        });

        //using the model
        // const inputs = {
        //     "image": imageData,
        //     "threshold": 0.5
        // };

        // fetch('http://localhost:8000/query', {
        //         method: 'POST',
        //         headers: {
        //         Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(inputs)
        //     })
        // .then(response => response.json())
        // .then(outputs => {
        //     const { image } = outputs;
        //     modelImage.set(image);
        // });

        // modelImage.subscribe(value => {
        //     imageSrc = value;
        // })
    });

    const draw = () => {
        const ratio = image.width / image.height;
        let newWidth = canvas.width;
        let newHeight = newWidth / ratio;
        if (newHeight < canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * ratio;
        }
        const xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
        const yOffset = newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
        context.drawImage(image, xOffset, yOffset, newWidth, newHeight);
        requestAnimationFrame(draw);
    }

    const flipImage = () => {
        image.classList.add('flip');
        requestAnimationFrame(draw);
    }

    const enableErase = () => {
        useEraser = !useEraser;
        let eraser = document.querySelector('.eraser');
        eraser.src = useEraser ? "/icons/eraser-light.svg" : "/icons/eraser-white.svg";
    }

    const eraseStarted = (e) => {
        if(useEraser){
            canvas.isDrawing = true;
            touchDown = true;
        }
    }

    const eraseEnded = () => {
        if(useEraser){
            canvas.isDrawing = false;
            touchDown = false;
        }
    }

    const erase = (e) => {
        if(touchDown){
            let x,y,radius = "10px"; // Circle coordinates and radius.

            context.fillStyle="#ffffff";// Your eraser color (not transparent)
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x,y,radius,0,Math.PI*2);
            context.fill();
        }
    }

</script>

<main class="editor">
   <!-- back button -->
   <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>

    <!-- camera options -->
    <div class="camera__options">
        <img on:click={enableErase} class="camera__options--icon eraser" src="/icons/eraser-white.svg" alt="eraser"/>
        <img on:click={flipImage} class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
    </div>

    <!-- canvas -->
    <canvas on:touchstart={eraseStarted} on:touchend={eraseEnded} on:touchmove={erase} class="editor__canvas" width={width} height={height}></canvas>
</main>

<style>
    main{
        height: 100vh;
        width: 100vw;
        background-color: #5F8FC3;
    }

    .editor, .editor__canvas{
        position: fixed;
        width: 100%;
        height: 100%;
        object-fit: cover;
        touch-action: none;
    }

    .editor__image--flip{
        transform: scaleX(-1);
        filter: FlipH;
    }
</style>