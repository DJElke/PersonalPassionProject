<script>
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify';
    import { imageCapture, modelImage } from '../../store.js';

    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas, imageData, img;

    onMount(() => {
        //retrieve image data from store
        imageCapture.subscribe(value => {
            imageData = value;
        });

        canvas = document.querySelector('.editor__canvas');
        img = new Image();
        img.src = imageData;
        img.alt = "u2net";
        img.classList.add('editor__image');
        requestAnimationFrame(draw);

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
        canvas.getContext('2d').drawImage(img, 0,0);
        requestAnimationFrame(draw);
    }
</script>

<main class="editor">
   <!-- back button -->
   <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>

    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon" src="/icons/eraser-white.svg" alt="eraser"/>
        <img class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
    </div>

    <!-- canvas -->
    <canvas class="editor__canvas" width={width} height={height}></canvas>
</main>

<style>
    main{
        height: 100vh;
        width: auto;
        background-color: #5F8FC3;
    }

    .editor, .editor__canvas, .editor__image{
        position: fixed;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>