<script>
    import { pasteMeIMAGE } from '../../store.js';
    import { onMount } from 'svelte';

    let image

    onMount(() => {
        pasteMeIMAGE.subscribe(value => {
            image = value;
        });
    });

    const saveImage = () => {
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        navigator.share({
            files: image,
            title: 'PasteMe',
            text: 'PasteMePicture.',
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => alert('Sharing failed', error));
        } else {
            alert(`Your system doesn't support sharing files.`);
        }
    }

</script>

<main>
    <img src={image} alt ="image"/>

    <div class="bottom__wrapper">
        <div class="bottom__buttonblock1">
            <!-- save image -->
            <a on:click={saveImage} class="button button--white">save</a>
        </div>
        <div class="bottom__buttonblock2">
            <!-- save local -->
            <a class="button button--blue">back to feed</a>
        </div>
    </div>
</main>

<style>
    img{
        width: 100%;
        height: 90%;
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

