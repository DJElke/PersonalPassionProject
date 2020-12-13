<script>
    import { redirect, url } from '@roxi/routify';
    import { isBackground, backgroundCapture } from '../../store.js';

    const openCamera = () => {
        isBackground.set(true);
        $redirect('./editor');
    }

    const chooseImage = (event) => {
        backgroundCapture.set(event.target.src);
        $redirect('./editor-step5');
    }
</script>

<main>
    <!-- navigation -->
    <div class="title__wrapper">
        <!-- back button -->
        <a href={$url('../editor/editor-step3')}><img class="backbtn" src="/icons/back-white.svg" alt="back"/></a>
        <p class="title"> Choose background </p>
        <!-- close button -->
        <a href={$url('../feed/index')}><img class="closebtn" src="/icons/close-white.svg" alt="close"/></a>
    </div>

    <!-- background content -->
    <div class="backgrounds__wrapper">
        <!-- in-app saved backgrounds -->
        <div class="backgrounds">
            <p class="text">Your backgrounds</p>
            <div class="backgrounds--row">
                <img on:click={chooseImage} alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
            </div>
        </div>
        <!-- suggested backgrounds (fixed) -->
        <div class="backgrounds">
            <p class="text">Suggested backgrounds</p>
            <div class="backgrounds--row">
                <img on:click={chooseImage} alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
                <img alt="background" class="background--item" src="/images/Odielv2.png">
            </div>
        </div>

        <!-- take picture or get from camera roll -->
        <div class="options__wrapper">
            <div class="option option--left">
                <img alt="camera" src="/icons/images-main.svg" class="option--icon"/>
                <br/>
                camera roll
            </div>
            <div on:click={openCamera} class="option option--right">
                <img alt="camera" src="/icons/camera-main.svg" class="option--icon"/>
                <br/>
                take picture
            </div>
        </div>
    </div>


</main>

<style>
    main{
        height: 100vh;
        width: 100vw;
        background-color: #5F8FC3;
        position: absolute;
    }

    .title__wrapper{
        position: relative;
        width: 100%;
        height: 15%;
        text-align: center;
    }

    .title{
        width: 100%;
        height: auto;
	    position: fixed;
        font-family: 'Libre Baskerville', serif;
        font-weight: 700;
        font-size: 18px;
        color: white;
        top: 3%;
    }

    .backgrounds__wrapper{
        width: 100%;
        height: 100%;
        background-color: white;
        position: relative;
        border-radius: 30px 30px 0px 0px;
    }

    .text{
        font-family: Source Sans Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        margin:0;
        padding-left: 5px;
        color: black;
    }

    .backgrounds{
        padding-top: 35px;
    }

    .backgrounds--row{
        width: 100%;
        height: auto;
        scroll-behavior: smooth;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .background--item{
        display: inline-block;
        border-radius: 25px;
        padding-left: 5px;
        padding-right: 5px;
        width: auto;
        height: 200px;
    }

    .options__wrapper{
        width: 100%;
        height: auto;
        background-color: #BDD5E7;
        border-radius: 30px 30px 0px 0px;
        position: fixed;
        bottom: 0;
        margin: 0;
    }

    .option{
        height: 80%;
        width: 100%;
        background-color: #FFFFFF;
        padding: 5px;
        border-radius: 25px;
        color: #5F8FC3;
        text-align: center;
        bottom: 0;
        margin: 15px 5px 15px 5px;
    }

    .option--left{
        float: left;
        align-items: center;
        height: 100%;
        width: 45%;
    }

    .option--right{
        height: 100%;
        width: 45%;
        overflow: hidden;
        align-items: center;
    }

    .option--icon{
        height: 35px;
        width: auto;
    }
</style>