<script>
    import { backgroundCapture, finalEditImage, pasteMeIMAGE } from '../../store.js';
    import { onMount } from 'svelte';
    import { redirect, url } from '@roxi/routify'
    import Konva from 'konva';

    Konva.hitOnDragEnabled = true;
    Konva.captureTouchEventsEnabled = true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stage, editImage, backgroundImage, container, activeShape, eCanvas, tr, settingsicon,
    settingsWrapper, slider, sliderValue, sliderWrapper, filter, button;
    let bLayer, eLayer;

    let useEraser = false;
    let useSettings = false;
    let firstClickSettings = true;
    let rangeMin, rangeMax, rangeStep, rangeValue = 0;

    let brightness = 0;
    let exposure = 0;
    let contrast = 20;
    let newB, newE, newC;

    onMount(() => {
        settingsicon = document.querySelector('.settings');
        settingsWrapper = document.querySelector('.options__wrapper');
        settingsWrapper.classList.add('display-none');
        sliderWrapper = document.querySelector('.slider__wrapper');
        slider = document.querySelector('.slider');
        button = document.querySelector('.button');

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
            draggable: false,
        });

        bLayer = new Konva.Layer();
        stage.add(bLayer);
        eLayer = new Konva.Layer();
        stage.add(eLayer);

        Konva.Image.fromURL(
            backgroundImage,
            (img) => {
            img.setAttrs({
                width: stage.width(),
                height: stage.height(),
                name: 'image',
                dragBoundFunc: function (pos) {
                    return {
                            x: pos.x ,
                            y: this.absolutePosition().y,
                        };
                    },
                draggable: false,
            });
            bLayer.add(img);
            // apply default left-top crop
            applyCrop('center-middle');
            bLayer.draw();

            img.on('transform', () => {
                // reset scale on transform
                img.setAttrs({
                scaleX: 1,
                scaleY: 1,
                width: img.width() * img.scaleX(),
                height: img.height() * img.scaleY(),
                });
                applyCrop(img.getAttr('lastCropUsed'));
            });
            }
        );

        let canvas = document.createElement('canvas');
        canvas.width = eLayer.width();
        canvas.height = eLayer.height();
        let context = canvas.getContext('2d');

        let eImg = new Image();
        eImg.addEventListener('load', () => {
            let edit = new Konva.Image({
                image: eImg,
                width: eImg.width,
                height: eImg.height,
                draggable: true,
                name: 'editImage',
            });
            edit.cache();
            edit.filters([Konva.Filters.Brighten, Konva.Filters.Enhance, Konva.Filters.Contrast]);
            context.drawImage(edit.image(), 0,0);
            eLayer.draw();
        });
        eImg.src = editImage;
        eImg.alt = "edit";

        eCanvas = new Konva.Image({
            image: canvas,
            width: eLayer.width(),
            height: eLayer.height(),
            draggable: true,
            name: 'editImage',
        });
        eLayer.add(eCanvas);
        stage.draw();

        //Now we need to get access to context element
        context.strokeStyle = "#0099ee";
        context.lineJoin = "round";
        context.lineWidth = 20;
    
        let isPaint = false;
        let lastPointerPosition;
        let mode = 'eraser';

        stage.on('touchstart mousedown', function() {
            if(!useEraser){
                return;
            }
            isPaint = true;
            lastPointerPosition = stage.getPointerPosition();
        });

        stage.on('touchend mouseup', function() {
            if(!useEraser){
                return;
            }
            isPaint = false;
        });

        // and core function - drawing
        stage.on('touchmove mousemove', function() {
            if(!useEraser){
                return
            }
            if (!isPaint) {
                return;
            }

            if (mode === 'brush') {
                context.globalCompositeOperation = 'source-over';
            }
            if (mode === 'eraser') {
                context.globalCompositeOperation = 'destination-out';
            }
            context.shadowBlur = 15;
            context.shadowColor = '#000000'; // inset border color
            context.shadowOffsetX = -1;
            context.shadowOffsetY = -1;
            context.beginPath();

            var localPos = {
                x: lastPointerPosition.x - eCanvas.x(),
                y: lastPointerPosition.y - eCanvas.y()
            };
            context.moveTo(localPos.x, localPos.y);
            var pos = stage.getPointerPosition();
            localPos = {
                x: pos.x - eCanvas.x(),
                y: pos.y - eCanvas.y()
            };
            context.lineTo(localPos.x, localPos.y);
            context.closePath();
            context.stroke();

            lastPointerPosition = pos;
            eLayer.draw();
            });

        stage.on('tap', (e) => {
            activeShape = e.target;
            activeShape.attrs.name === 'editImage' ? addTransformer(activeShape, eLayer) : removeTransformers(eLayer);
        });        
    });

    // function to calculate crop values from source image, its visible size and a crop strategy
    const getCrop = (image, size, clipPosition = 'center-middle') => {
        const width = size.width;
        const height = size.height;
        const aspectRatio = width / height;

        let newWidth;
        let newHeight;

        const imageRatio = image.width / image.height;

        if (aspectRatio >= imageRatio) {
          newWidth = image.width;
          newHeight = image.width / aspectRatio;
        } else {
          newWidth = image.height * aspectRatio;
          newHeight = image.height;
        }

        let x = (image.width - newWidth) / 2;
        let y = (image.height - newHeight) / 2;

        return {
          cropX: x,
          cropY: y,
          cropWidth: newWidth,
          cropHeight: newHeight,
        };
    }

    // function to apply crop
    const applyCrop = (pos) => {
        const img = bLayer.findOne('.image');
        img.setAttr('lastCropUsed', pos);
        const crop = getCrop(
          img.image(),
          { width: img.width(), height: img.height() },
          pos
        );
        img.setAttrs(crop);
        bLayer.draw();
      }

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

    const removeTransformers = (layer) => {
        let transformers = layer.find('Transformer');
        transformers.forEach(transform => {
            transform.attrs.opacity = 0,
            transform.detach();
        });
    }

    const showSettings = () => {
        useSettings = !useSettings;
        if(!firstClickSettings){
            useSettings ? settingsWrapper.classList.remove('display-none') : settingsWrapper.classList.add('display-none');
            useSettings ? button.classList.add('display-none') : button.classList.remove('display-none');
            settingsicon.src = useSettings ? "/icons/settings-light.svg" : "/icons/settings-white.svg";
        }else{
            settingsicon.src = "/icons/settings-light.svg" ;
            useSettings ? settingsWrapper.classList.remove('display-none') : settingsWrapper.classList.add('display-none');
            useSettings ? button.classList.add('display-none') : button.classList.remove('display-none');
        }
        firstClickSettings = false;
    };

    const setBrightnessSlider = () => {
        sliderWrapper.classList.remove('display-none');
        settingsWrapper.classList.add('display-none');
        rangeMin = -1;
        rangeMax = 1;
        rangeStep = 0.05;
        rangeValue = 0;
        filter = 'brightness';
    }

    const setContrastSlider = () => {
        sliderWrapper.classList.remove('display-none');
        settingsWrapper.classList.add('display-none');
        minRange = -100;
        maxRange = 100;
        rangeStep = 1;
        rangeValue = 0;
        filter = 'contrast';
    }

    const setExposureSlider = () => {
        sliderWrapper.classList.remove('display-none');
        settingsWrapper.classList.add('display-none');
        minRange = -1;
        maxRange = 1;
        rangeStep = 0.01;
        rangeValue = 20;
        filter = 'exposure'
    }

    const updateSliderValueAndFilter = () => {
        sliderValue = parseFloat(slider.value);
        if(activeShape != null){
            if(filter === 'brightness'){
                newB = sliderValue;
                activeShape.brightness(sliderValue);
            }
            if(filter === 'contrast'){
                newC = sliderValue;
                activeShape.contrast(sliderValue);
            }
            if(filter === 'exposure'){
                newE = sliderValue;
                activeShape.enhance(sliderValue);
            }
            eLayer.batchDraw();
        }
    }

    const addFilter = () => {
        sliderWrapper.classList.add('display-none');
        settingsWrapper.classList.remove('display-none');
        if(activeShape != null){
            if(filter === 'brightness'){
                brightness = newB;
                rangeValue = brightness;
                activeShape.brightness(brightness);
            }
            if(filter === 'contrast'){
                contrast = newC;
                rangeValue = contrast;
                activeShape.contrast(contrast);
            }
            if(filter === 'exposure'){
                exposure = newE;
                rangeValue = exposure;
                activeShape.enhance(exposure);
            }
            eLayer.batchDraw();
        }

    }

    const removeFilter = () => {
        sliderWrapper.classList.add('display-none');
        settingsWrapper.classList.remove('display-none');
        if(activeShape != null){
            if(filter === 'brightness'){
                brightness = 0;
                rangeValue = brightness;
                activeShape.brightness(brightness);
            }
            if(filter === 'contrast'){
                contrast = 0;
                rangeValue = contrast;
                activeShape.contrast(contrast);
            }
            if(filter === 'exposure'){
                exposure = 20;
                rangeValue = exposure;
                activeShape.enhance(exposure);
            }
            eLayer.batchDraw();
        }
    }

    const enableEraser = () => {
        useEraser = !useEraser;
        console.log(useEraser);
        if(activeShape != null){
            useEraser ? eCanvas.draggable(false) : eCanvas.draggable(true);
        }
    };

    const finalizeEdit = () => {
        let transformers = stage.find('Transformer');
            transformers.forEach(transform => {
            transform.destroy();
        });
        pasteMeIMAGE.set(stage.toDataURL());
        $redirect('./editor-final');
    };

</script>

<main>
     <!-- back button -->
    <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>
    
    <!-- camera options -->
    <div class="camera__options">
        <img on:click={enableEraser} class="camera__options--icon eraser" src="/icons/eraser-white.svg" alt="eraser"/>
        <img on:click={showSettings} class="camera__options--icon settings" src="/icons/settings-white.svg" alt="settings"/>
    </div>
   
    <!-- KonvaJS canvas for editor -->
    <div bind:this={container}></div>

    <!-- lighting options -->
    <div class="options__wrapper">
            <div on:click={setBrightnessSlider} class="option">
                <img class="option--icon" src="/icons/brightness-white.svg" alt="eraser"/>
                <br/>
                brightness
            </div>
            <div on:click={setExposureSlider} class="option">
                <img class="option--icon" src="/icons/exposure-white.svg" alt="settings"/>
                <br/>
                exposure
            </div>
            <div on:click={setContrastSlider} class="option">
                <img class="option--icon" src="/icons/contrast-white.svg" alt="settings"/>
                <br/>
                contrast
            </div>
    </div>

    <!-- slider wrapper -->
    <div class="slider__wrapper display-none">
        <img on:click={removeFilter} class="slider--item slider--icon" src="/icons/close-white.svg" alt="close"/>
        <input on:input={updateSliderValueAndFilter} class="slider--item slider" type="range" min={rangeMin} max={rangeMax} step={rangeStep} value={rangeValue}/>
        <img on:click={addFilter} class="slider--item slider--icon slider--iconcheck" src="/icons/checkmark-white.svg" alt="check"/>
    </div>

    <!-- continue to adding backgrounds -->
    <button on:click={finalizeEdit} class="button editor__button button--blue">continue</button>
</main>

<style>
    main{
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .object-fit {
        position: fixed;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .options__wrapper{
        width: 100%;
        height: auto;
        background-color: #112140;
        color: white;
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 15px;
        line-height: 18px;
        border-radius: 30px 30px 0px 0px;
        position: fixed;
        bottom: 0;
        margin: 0;
        scroll-behavior: smooth;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        text-align: center;
    }

    .slider__wrapper{
        width: 100%;
        height: auto;
        background-color: #112140;
        color: white;
        position: fixed;
        bottom: 0;
        margin: 0;
        border-radius: 30px 30px 0px 0px;
    }

    @keyframes fadeIn{
       to{
           opacity: 1;
       }
    }
  
    .fade-in{
        opacity: 0;
        animation: fadeIn 3s ease-in forwards;
    }

    .option {
        display: inline-block;
        align-items: center;
        height: 100%;
        padding: 20px;
    }

    .option--icon{
        width: 40px;
        height: 40px;
    }

    .slider--icon{
        width: 20px;
        height: 20px;
    }

    .slider--iconcheck{
        width: 25px;
        height: 30px;
    }

    input[type="range"]{
        width: 65%;
        height: auto;
    }

    input[type=range]{
        -webkit-appearance: none;
    }

    input[type=range]::-webkit-slider-runnable-track {
        height: .35em;
        background: white;
        border: none;
        border-radius: 25%;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        height: 1.1em;
        width: 1.1em;
        border-radius: 50%;
        background: #BDD5E7;
        margin-top: -4px;
    }

    input[type=range]:focus {
        outline: none;
    }

    .slider--item{
        padding: 15px;
        display: inline-block;
        align-items: center;
        height: 100%;
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