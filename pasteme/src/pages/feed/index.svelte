<script>
    let pastes = ["/images/pasteme1.png", "/images/pasteme2.png", "/images/pasteme3.png", "/images/pasteme4.png", "/images/pasteme5.png"]
</script>
  
  <main>
    <!-- FEED -->
    <div class="feed">
        <p class="feedTitle">PasteMe</p>
        <div class="grid">
            <li class="vertical"><img src="/images/pasteme1.png" alt="placeholder"/></li>
            <li><img src="/images/pasteme2.png" alt="placeholder"/></li>
            <li class="vertical"><img src="/images/pasteme3.png" alt="placeholder"/></li>
            <li><img src="/images/pasteme4.png" alt="placeholder"/></li>    
        </div>
    </div>
  </main>
  
  <style>
    main{
        height: 100%;
        width: auto;
    }
    /* FEED */
    .feed{
        z-index: -100;
        position: absolute;
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100%;
    }
  
    .feedTitle{
        color: #5F8FC3;
        font-family: 'Libre Baskerville', serif;
        font-weight: 700;
        font-size: 24px;
        text-align: center;
    }
  </style>