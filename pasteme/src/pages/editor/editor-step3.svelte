<script>
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify';
    import { imageCapture, modelImage } from '../../store.js';

    let imageSrc, imageData;

    onMount(() => {
        //retrieve image data from store
        imageCapture.subscribe(value => {
            imageData = value;
        });

        const inputs = {
            "image": imageData,
            "threshold": 0.5
        };

        //using the model
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

        imageSrc = "/images/modelTest.png";
    });
</script>

<main>
   <!-- back button -->
   <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>

    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon" src="/icons/eraser-white.svg" alt="eraser"/>
        <img class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
    </div>

    <!-- image -->
    <img src={imageSrc} alt="u2net" class="image__editor"/>
</main>

<style>
    main{
        height: 100vh;
        width: auto;
        background-color: #5F8FC3;
    }

    .image__editor{
        position: fixed;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
</style>