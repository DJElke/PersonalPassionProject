<!-- routify:options preload="proximity" -->
<script>
    import BottomNav from "./_components/BottomNav.svelte";
    import { url, isActive } from "@roxi/routify";
  
    const _urls = [
      ["./feed", "Feed", "/icons/home-white.svg"],
      ["./editor/editor", "Editor", "/icons/camera-white.svg"],
      ["./profile", "Profile", "/icons/user-white.svg"],
    ];
    $: urls = _urls.map(([path, name, icon]) => ({
      name,
      href: $url(path),
      icon,
      active: !!$isActive(path),
    }));
</script>

<style>
    :global(body) {
      padding: 0;
    }
    * :global(.inset) {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    main.inset {
      bottom: 64px;
      overflow-y: auto;
      overflow-x:hidden;
    }
  
    * :global(*) {
      text-align: center;
    }
  </style>

<div style="height: 100%">
    <main class="inset">    
        <slot  />    
    </main>
    <BottomNav {urls} height="64px" />
  </div>
