<script>
    import { backgroundCapture } from '../../store.js';
    import { onMount } from 'svelte';

    let backgroundImage;

    onMount(() => {
        //retrieve image data from store
        backgroundCapture.subscribe(value => {
            backgroundImage = value;
         });
    });

</script>
<main>
    <img src={backgroundImage} alt="background" />
</main>