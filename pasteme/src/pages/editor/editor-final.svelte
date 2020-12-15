<script>
    import { pasteMeIMAGE } from '../../store.js';
    import { onMount } from 'svelte';

    let image

    onMount(() => {
        pasteMeIMAGE.subscribe(value => {
            image = value;
        });
    });

</script>

<main>
    <img src={image} alt ="image"/>
</main>
