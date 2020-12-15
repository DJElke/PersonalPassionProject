<script>
    import { backgroundCapture, finalEditImage, pasteMeIMAGE } from '../../store.js';
    import { onMount } from 'svelte';
    import { redirect, url } from '@roxi/routify'
    import Konva from 'konva';

    Konva.hitOnDragEnabled = true;
    Konva.captureTouchEventsEnabled = true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stage, editImage, backgroundImage, container, activeShape, tr, settingsicon,
    settingsWrapper, slider, sliderValue, sliderWrapper, filter, button;
    let bLayer, eLayer;

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

        let bImg = new Image();
        bImg.addEventListener('load', () => {
            let background = new Konva.Image({
                image: bImg,
                draggable: true,
                dragBoundFunc: function (pos) {
                return {
                        x: pos.x ,
                        y: this.absolutePosition().y,
                    };
                },
                name: 'background',
            });
            const crop = getCrop(background.image(), {width: background.width(), height: background.height()}, 'center-top');
            background.setAttrs(crop);
            bLayer.add(background);
            bLayer.batchDraw();
        });
        bImg.src = backgroundImage;
        bImg.classList.add('object-fit');
        bImg.alt = "background";

        eLayer = new Konva.Layer();
        stage.add(eLayer);

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
            eLayer.add(edit);
            eLayer.batchDraw();
        });
        eImg.src = editImage;
        eImg.alt = "edit";
    

        stage.on('tap', (e) => {
            activeShape = e.target;
            activeShape.attrs.name === 'editImage' ? addTransformer(activeShape, eLayer) : removeTransformers(eLayer);
        })        
    });

    function getCrop(image, size, clipPosition = 'center-top') {
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
        let y = 0;
        // if (clipPosition === 'left-top') {
        //     x = 0;
        //     y = 0;
        // } else if (clipPosition === 'left-middle') {
        //     x = 0;
        //     y = (image.height - newHeight) / 2;
        // } else if (clipPosition === 'left-bottom') {
        //     x = 0;
        //     y = (image.height - newHeight);
        // } else if (clipPosition === 'center-top') {
        //     x = (image.width - newWidth) / 2;
        //     y = 0;
        // } else if (clipPosition === 'center-middle') {
        //     x = (image.width - newWidth) / 2;
        //     y = (image.height - newHeight) / 2;
        // } else if (clipPosition === 'center-bottom') {
        //     x = (image.width - newWidth) / 2;
        //     y = (image.height - newHeight);
        // } else if (clipPosition === 'right-top') {
        //     x = (image.width - newWidth);
        //     y = 0;
        // } else if (clipPosition === 'right-middle') {
        //     x = (image.width - newWidth);
        //     y = (image.height - newHeight) / 2;
        // } else if (clipPosition === 'right-bottom') {
        //     x = (image.width - newWidth);
        //     y = (image.height - newHeight);
        // } else if (clipPosition === 'scale') {
        //     x = 0;
        //     y = 0;
        //     newWidth = width;
        //     newHeight = height;
        // } else {
        //     console.error(
        //     new Error('Unknown clip position property - ' + clipPosition)
        //     );
        // }

        
        return {
            cropX: x,
            cropY: y,
            cropWidth: newWidth,
            cropHeight: newHeight
        }
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

    const finalizeEdit = () => {
        pasteMeIMAGE.set(stage.toDataURL());
        $redirect('./editor-final');
    };

</script>

<main>
     <!-- back button -->
    <a href={$url('../editor/editor-step2')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>
    
    <!-- camera options -->
    <div class="camera__options">
        <img class="camera__options--icon eraser" src="/icons/eraser-white.svg" alt="eraser"/>
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