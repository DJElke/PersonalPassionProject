<script>
    import { useFrontCamera, imageCapture, modelImage } from '../../store.js';
    import { redirect, url } from '@roxi/routify';
    import { onMount } from 'svelte';

    let imageData, frontCamera;

    onMount(() => {
        //retrieve image data from store
        imageCapture.subscribe(value => {
            imageData = value;
         });

        //retrieve camera data from store
        useFrontCamera.subscribe(value => {
            frontCamera = value;
        });
    });

    const renderImage = () => {
        //using the model
        const inputs = {
            "image": imageData,
            "threshold": 0.5
        };

        fetch("https://u-2-net-dd85c5bc.hosted-models.runwayml.cloud/v1/query", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer Tr+RNPgXRZti1qmvIVYTjA==",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs)
        })
        .then(response => response.json())
        .then(outputs => {
            const { image } = outputs;
            modelImage.set(image);
            $redirect('./editor-step3');
        });
    }
</script>

<main>
    <div class="container">
        <!-- taken image -->
        {#if frontCamera}
            <img src={imageData} alt ="snapshot" class="image__canvas image__canvas--front">
        {:else}
            <img src={imageData} alt ="snapshot" class="image__canvas">
        {/if}

        <!-- bottom navigation -->
        <div class="bottom__wrapper">
            <div class="bottom__buttonblock1">
                <!-- go back -->
                <a href={$url('../editor/editor')} class="button button--white">try again</a>
            </div>
            <div class="bottom__buttonblock2">
                <!-- continue editing -->
                <a on:click={renderImage} class="button button--blue">continue</a>
            </div>
        </div>
    </div>
</main>

<style>
    .container {
        display: block;
    }
    .image__canvas{
        position: fixed;
        width: 100%;
        height: 90%;
        object-fit: cover;
    }

    .image__canvas--front{
        transform: scaleX(-1);
        filter: FlipH;
    }

    .bottom__wrapper{
        position: fixed;
        bottom:0;
        width: 100%;
        height: 10%;
        background-color: white;
        overflow: hidden;
        text-align: center;
    }

    .bottom__buttonblock1{
        height: 100%;
        width: 50%;
        float: left;
        display: flex;
        align-items: center;
    }

    .bottom__buttonblock2{
        height: 100%;
        width: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .button{
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
        margin-left: auto;
        margin-right: auto;
    }

    .button--white{
        background-color: #FFFFFF;
        color: #9FCCEB;
    }

    .button--blue{
        background-color: #9FCCEB;
        color: #FFFFFF;
    }
</style>