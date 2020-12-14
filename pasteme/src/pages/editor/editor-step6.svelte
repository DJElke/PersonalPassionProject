<script>
    import { backgroundCapture, finalEditImage } from '../../store.js';
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify'
    import Konva from 'konva';

    let width = window.innerWidth;
    let height = window.innerHeight;
    let editImage, backgroundImage;
    let container;

    onMount(() => {
        //get the data from the 2 pictures
        finalEditImage.subscribe(value => {
            editImage = value;
        });

        backgroundCapture.subscribe(value => {
            backgroundImage = value;
        });

        let stage = new Konva.Stage({
            container: container,
            width: width,
            height: height,
        });

        //add the background and make it only draggable on the x-axis
        const backgroundLayer = new Konva.Layer();
        stage.add(backgroundLayer);

        let bImg = new Image();
        bImg.addEventListener('load', () => {
            let background = new Konva.Image({
                image: bImg,
                width: bImg.width,
                height: height,
                draggable: true,
                dragBoundFunc: function (pos) {
                return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                },
            });
            backgroundLayer.add(background);
            backgroundLayer.batchDraw();
        });
        bImg.src = backgroundImage;
        bImg.classList.add('object-fit');
        bImg.alt = "background";

        //add the final edit image
        const editImageLayer = new Konva.Layer();
        stage.add(editImageLayer);

        let eImg = new Image();
        eImg.addEventListener('load', () => {
            let edit = new Konva.Image({
                x: 50,
                y: 50,
                image: eImg,
                width: eImg.width,
                height: eImg.heigth,
                draggable: true,
            });
            editImageLayer.add(edit);
            editImageLayer.batchDraw();
        });
        eImg.src = editImage;
        eImg.classList.add('object-fit');
        eImg.alt = "edit";
    });
</script>

<main>
     <!-- back button -->
    <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>
    
    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon eraser" src="/icons/eraser-white.svg" alt="eraser"/>
        <img class="camera__options--icon" src="/icons/flip-white.svg" alt="flip"/>
        <img class="camera__options--icon" src="/icons/settings-white.svg" alt="settings"/>
    </div>
   
    <!-- KonvaJS canvas for editor -->
    <div bind:this={container}></div>
</main>

<style>
    main{
        width: 100vw;
        height: 100vh;
    }

    .object-fit {
        object-fit: cover;
    }
</style>