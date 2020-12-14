<script>
    import { backgroundCapture, finalEditImage } from '../../store.js';
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify'
    import Konva from 'konva';

    Konva.hitOnDragEnabled = true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let editImage, backgroundImage,container;

    let lastDist = 0;
    let startScale = 1;
    let activeShape = null;

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
            draggable: false,
        });

        //add the background and make it only draggable on the x-axis
        const backgroundLayer = new Konva.Layer();
        stage.add(backgroundLayer);

        let bImg = new Image();
        bImg.addEventListener('load', () => {
            let background = new Konva.Image({
                image: bImg,
                height: height,
                draggable: true,
                dragBoundFunc: function (pos) {
                return {
                        x: pos.x,
                        y: this.absolutePosition().y,
                    };
                },
                name: 'background',
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
                name: 'editImage',
            });
            editImageLayer.add(edit);
            editImageLayer.batchDraw();
        });
        eImg.src = editImage;
        eImg.classList.add('object-fit');
        eImg.alt = "edit";

        stage.on('tap', (e) => {
            let shape = e.target;
            activeShape = activeShape && activeShape.getName() === shape.getName() ? null: shape;
        });

        stage.getContent().addEventListener('touchmove', (e) => {
            let touch1 = e.touches[0];
            let touch2 = e.touches[1];

            if (touch1 && touch2 && activeShape) {
                let dist = getDistance(
                {
                    x: touch1.clientX,
                    y: touch1.clientY,
                },
                {
                    x: touch2.clientX,
                    y: touch2.clientY,
                }
            );

            if (!lastDist) {
              lastDist = dist;
            }

            var scale = (activeShape.scaleX() * dist) / lastDist;

            activeShape.scaleX(scale);
            activeShape.scaleY(scale);
            activeShape.getName() === "background" ? backgroundLayer.draw() : editImageLayer.draw();
            lastDist = dist;
            }
        });

        stage.getContent().addEventListener('touchend', () => {
            lastDist = 0;
        }, false);
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