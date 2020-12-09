<style>
    * :global(.grid){
        height: 100%;
        width: auto;
        margin: 1em auto;
        padding: 0.5rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: 10px;
        grid-auto-flow: dense;
        list-style: none;
        max-width: 800px;
    }

    * :global(.grid li.vertical){
        grid-row-end: span 2;
    }

    * :global(.grid li.landscape){
        grid-column-end: span 2;
    }

    * :global(.grid li img) {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 5%;
    }
</style>

<!-- routify:options index=0 -->
<main>
    <slot />
</main>