<script>
    import { onMount } from 'svelte';
    import { redirect, url } from '@roxi/routify'
    import { modelImage, finalEditImage } from '../../store.js';

    let width = window.innerWidth;
    let height = window.innerHeight;

    let canvas, imageData, image, context, finalEdit;

    let useEraser = false;
    let flipHorizontal = false;

    onMount(() => {
        //retrieve image data from store
        modelImage.subscribe(value => {
            imageData = value;
        });

        canvas = document.querySelector('.editor__canvas');
        context = canvas.getContext('2d');

        image = new Image();
        image.src = imageData != null ? imageData : "/images/cat.png";
        image.alt = "u2net";
        
        image.addEventListener('load', () => {
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
        });

        context.fillCircle = (x,y,radius) => {
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.fill();
		}
    });

    const flipImage = () => {
        flipHorizontal = !flipHorizontal
        flipHorizontal ? canvas.classList.remove('editor__canvas--flip') : canvas.classList.add('editor__canvas--flip');
    }

    const enableErase = () => {
        useEraser = !useEraser;
        let eraser = document.querySelector('.eraser');
        eraser.src = useEraser ? "/icons/eraser-light.svg" : "/icons/eraser-white.svg";
    }

    const eraseStarted = (e) => {
        if(useEraser){
            canvas.isDrawing = true;
        }
    }

    const eraseEnded = () => {
        if(useEraser){
            canvas.isDrawing = false;
        }
    }

    const erase = (e) => {
        if(!canvas.isDrawing){
			return;
        }
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        let radius = 10;
        context.globalCompositeOperation = 'destination-out';
        context.fillCircle(x,y,radius);
    }

    const goToBackgrounds = () => {
        finalEdit = canvas.toDataURL('image/png');
        finalEditImage.set(finalEdit);
        $redirect('./editor-step4');
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

    <!-- continue to adding backgrounds -->
    <button on:click={goToBackgrounds} class="button editor__button button--blue">continue</button>
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

    .editor__canvas--flip{
        -moz-transform: scale(-1, 1);
        -webkit-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        transform: scaleX(-1);
        filter: FlipH;
    }

    canvas{
        background-color: transparent;
        background: transparent;
    }

    .editor__button{
        position: fixed;
        bottom: 2%;
        right: 5%;
        border: 1px solid #9FCCEB;
        box-sizing: border-box;
        box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 30px;
        padding: 5px 25px 5px 25px;
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 30px;
    }

    .button--blue{
        background-color: #9FCCEB;
        color: #FFFFFF;
    }
</style>