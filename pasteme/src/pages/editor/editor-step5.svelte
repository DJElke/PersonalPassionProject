<script>
    import { backgroundCapture } from '../../store.js';
    import { onMount } from 'svelte';
    import { url } from '@roxi/routify';

    let backgroundImage;

    onMount(() => {
        //retrieve image data from store
        backgroundCapture.subscribe(value => {
            backgroundImage = value;
         });
    });

</script>

<main>
    <!-- navigation -->
    <div class="title__wrapper">
        <!-- close button -->
        <a href={$url('../editor/editor-step4')}><img class="closebtn closebtn--left" src="/icons/close-white.svg" alt="close"/></a>
        <p class="title"> Choose this picture
            <br/> as background? </p>
        <!-- checkmark -->
        <a href={$url('../editor/editor-step6')}><img class="checkbtn" src="/icons/checkmark-white.svg" alt="check"/></a>  
    </div>

    <!-- show background -->
    <img src={backgroundImage} alt="background" />
</main>

<style>
    main{
        height: 100vh;
        width: 100vw;
        background-color: #5F8FC3;
        position: absolute;
    }

    img{
        position: relative;
        width: 100%;
        height: 85%;
        object-fit: cover;
        bottom: 0;
        border-radius: 30px 30px 0px 0px;
        transform: scaleX(-1);
        filter: FlipH;
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

    .checkbtn{
        right: 5%;
        top: 5%;
        height: 20px;
        width: 20px;
        z-index: 9;
        display: flex;
        position: fixed;
    }

    .closebtn{
        left: 5%;
        top: 5%;
        height: 20px;
        width: 20px;
        z-index: 9;
        display: flex;
        position: fixed;
    }
</style>