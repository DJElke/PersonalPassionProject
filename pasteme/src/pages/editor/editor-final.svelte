<script>
    import { pasteMeIMAGE } from '../../store.js';
    import { url } from '@roxi/routify'
    import { onMount } from 'svelte';

    let image

    onMount(() => {
        pasteMeIMAGE.subscribe(value => {
            image = value;
        });
    });

</script>

<main>
    <p>to save, keep pressing the image</p>
    <img src={image} alt ="image"/>
    <!-- continue to adding backgrounds -->
    <a href={$url('../feed/index')} class="button editor__button button--blue">back to feed</a>
</main>

<style>
    img{
        width: 100%;
        height: 90%;
    }

    p{
        background-color: #112140;
        color: white;
        height: 10%;
        width: 100%;
        margin: 0;
        padding: 1px;
        text-align: center;
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

