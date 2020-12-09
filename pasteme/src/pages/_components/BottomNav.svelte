<script>
    import { url, isActive } from "@roxi/routify";
    export let urls, height;
    let linkElems = [];
    let overlay;
    let clientWidth
    $: urlsWithElem = linkElems.map((elem, i) => ({ ...urls[i], elem }));
    $: activeUrl = urlsWithElem.find(({active}) => active)
    $: if (overlay && clientWidth && activeUrl) copyDimensions(activeUrl.elem, overlay);
  
    function copyDimensions(source, target) {
      target.style.left = source.offsetLeft + "px";
      target.style.top = source.offsetTop + "px";
      target.style.width = source.clientWidth + "px";
      target.style.height = source.clientHeight + "px";
    }
  
    const saveElement = el => (linkElems = [...linkElems, el]);
  </script>
  
  <style>
    nav {
      width: 100%;
      height: 10%;
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      justify-content: center;
      align-items: center;
      background-color: #5F8FC3;
      justify-content: space-evenly;
    }
    a {
      padding: 0 16px;
      line-height: 100%;
      font-weight: 500;
      color: #aaa;
      text-transform: uppercase;
      text-decoration: none;
      width: 100%;
      text-align: center;
      position: relative;
      z-index: 10;
      transition: all 0.8s;
      /* transition-delay: 0.05s */
    }
  
    .wrapper{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .circle {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(100px - (80px/1));
      margin-bottom: 0;
      height: 80px;
      width: 80px;
      border-radius: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-color: #112140;
      z-index: 9;
      transition: height 0.3s;
    }
  
    .circleBackground{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(100px - (80px / 0.9));
      margin-bottom: 0;
      height: calc(80px + 20px);
      width: calc(80px + 20px);
      border-radius: calc(80px + 20px / 2);
      background-color:  #5F8FC3;
    }
  
    .navItem{
      padding-left: 10%;
      padding-right: 10%;
      width: 100%;
      text-align: center;
    }
  </style>
  
  <div class="wrapper">
    <nav bind:clientWidth>
      {#each urls as { name, path, active, href, icon }, i}
      {#if name == "Editor"}
      <div class="circle">
          <a
            {href}
            class:active
            use:saveElement>
              <img src={icon} alt="icon"/>
          </a>
      </div>
      <div class="circleBackground"></div>
      {:else}
      <div class="navItem">
        <a
          {href}
          class:active
          use:saveElement>
            <img src={icon} alt="icon"/>
        </a>
      </div>
      {/if}
      {/each}
    </nav>
  </div>
  
  