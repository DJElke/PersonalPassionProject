<script>
    import { redirect} from "@roxi/routify";
    import { onMount } from "svelte";
  
    onMount(() => {
        setTimeout(() => {
            $redirect('./feed/index');
    }, 2000);
    });
</script>

<main>
    <!-- SPLASHSCREEN -->
    <div class="splashscreen">
        <div class="splashContainer">
            <svg width="121" height="160" viewBox="0 0 121 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="splashImg" d="M61.605 152V80M61.605 80V8C79.2268 8.61697 112.4 9.92493 112.992 44.2776C113.583 78.6303 81.9379 80 61.605 80ZM61.605 80H8" stroke="#9FCCEB" stroke-width="15" stroke-linecap="square"/>
            </svg>            
            <p class="splashTitle fade-in">PasteME</p>
        </div>
    </div>
</main>

<style>
    /* SPLASHSCREEN */
    .splashscreen{
        background-color: #112140;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100%;
        position: fixed;
        z-index: 200;
    }
  
    .splashImg{
        stroke-dasharray: 1000;
        stroke-dashoffset: 0;
        animation: dash 10s linear alternate infinite;
    }
  
    @keyframes dash {
        from {
            stroke-dashoffset: 900;
        }
        to {
            stroke-dashoffset: 0;
        }
    }
  
    .splashContainer{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
  
    .splashTitle{
        color: #9FCCEB;
        font-family: 'Source Sans Pro', sans-serif;
        font-weight: 200;
        margin-top: 0.5rem;
        padding: 0;
        text-align: center;
        font-size: 36px;
    }
  
    @keyframes fadeIn{
       to{
           opacity: 1;
       }
    }
  
    .fade-in{
        opacity: 0;
        animation: fadeIn 1s ease-in forwards;
    }
</style>