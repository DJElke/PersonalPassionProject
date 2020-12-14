<script>
    import { backgroundCapture, finalEditImage } from '../../store.js';
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify'
    import Konva from 'konva';

    Konva.hitOnDragEnabled = true;
    Konva.captureTouchEventsEnabled = true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stage, editImage, backgroundImage, container, activeShape, tr;
    let bLayer, eLayer;

    onMount(() => {
        //get the data from the 2 pictures
        finalEditImage.subscribe(value => {
            editImage = value;
        });

        backgroundCapture.subscribe(value => {
            backgroundImage = value;
        });

        stage = new Konva.Stage({
            container: container,
            width: width,
            height: height,
            x: width / 2,
            y: height / 2,
            offset: {
                x: width / 2,
                y: height / 2,
            },
            draggable: true,
        });

        
        bLayer = new Konva.Layer();
        stage.add(bLayer);

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
            bLayer.add(background);
            bLayer.batchDraw();
        });
        bImg.src = backgroundImage;
        bImg.alt = "background";

        eLayer = new Konva.Layer();
        stage.add(eLayer);

        let eImg = new Image();
        eImg.addEventListener('load', () => {
            let edit = new Konva.Image({
                image: eImg,
                width: 300,
                height: 600,
                draggable: true,
                name: 'editImage',
            });
            eLayer.add(edit);
            eLayer.batchDraw();
        });
        eImg.src = editImage;
        eImg.alt = "edit";

        stage.on('tap', (e) => {
            activeShape = e.target;
            console.log(activeShape);
            activeShape.attrs.name === 'editImage' ? addTransformer(activeShape, eLayer) : removeTransformers(activeShape);
        })
    });

    const addTransformer = (konvaNode, layer) => {
        tr = new Konva.Transformer({
            nodes: [konvaNode],
            keepRatio: true,
            borderDash: [4, 3],
            anchorCornerRadius: 5,
            anchorStrokeWidth: 15,
            borderStrokeWidth: 1,
            padding:16,
            opacity:1,
            enabledAnchors: ['top-left', 'bottom-right'],
            anchorFill: '#112140',
            anchorStroke: '#112140',
            borderStroke: '#112140',
            rotationSnaps:[0, 90, 180, 270],
        });
        layer.add(tr);
    };

    const removeTransformers = (konvaNode) => {
        let transformers = stage.find('Transformer');
        transformers.forEach(transform => {
            transform.attrs.opacity = 0,
            transform.detach();
        });
    }


</script>

<main>
     <!-- back button -->
    <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>
    
    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon eraser" src="/icons/eraser-white.svg" alt="eraser"/>
        <img class="camera__options--icon" src="/icons/settings-white.svg" alt="settings"/>
    </div>
   
    <!-- KonvaJS canvas for editor -->
    <div bind:this={container}></div>
</main>

<style>
    main{
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .object-fit {
        object-fit: cover;
    }
</style>