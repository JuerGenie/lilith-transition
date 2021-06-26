<svelte:options tag="lilith-app" />

<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import background_1 from "../assets/background-1.png";
  import background_2 from "../assets/background-2.jpg";
  import background_3 from "../assets/background-3.jpg";
  import type Carousel from "lilith-transition/dist/src/components/carousel";

  const to_my_homepage = () => {
    window.open("https://github.com/juergenie", "_blank");
  };
  const to_repository = () => {
    window.open("https://github.com/juergenie/lilith-transition", "_blank");
  };

  const offset = {
    x: 0,
    y: 0,
  };
  const handle_mouse_move = (evt: MouseEvent) => {
    const center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    offset.x = (evt.clientX - center.x) / center.x;
    offset.y = (evt.clientY - center.y) / center.y;
  };

  let carousel: HTMLElement;
  onMount(() => {
    (carousel as unknown as Carousel.Carousel).update_content();

    window.addEventListener("mousemove", handle_mouse_move);
  });
  onDestroy(() => {
    window.removeEventListener("mousemove", handle_mouse_move);
  });

  let style = {
    blur: 4,
    transition: {
      density: 80,
      length: 100,
      max_size: 80,
      style: "fade-in",
    },
  };

  let back_style: [string, string][];
  $: {
    back_style = [
      // ["--app-background-offset-x", `${offset.x}%`],
      // ["--app-background-offset-y", `${offset.y}%`],
      ["--app-style-blur", `${style.blur}px`],
      ["--lilith-transition-density", `${style.transition.density}px`],
      ["--lilith-transition-length", `${style.transition.length}%`],
      ["--lilith-transition-max-size", `${style.transition.max_size}px`],
      ["--lilith-transition-style", `${style.transition.style}`],
    ];
  }

  let attribute_association = true;
  $: {
    if (attribute_association) {
      style.transition.max_size = style.transition.density;
    }
  }

  const support = "paintWorklet" in CSS;
</script>

<svelte:head>
  <link rel="stylesheet" href="./style.css" />
</svelte:head>

<template>
  <header>
    <h1 class="page-btn" on:click={to_repository}>LILITH-TRANSITION</h1>
    <h5 style="line-height: 78px; margin-left: 1rem;">VERSION: 0.2.9</h5>
    <div class="space" />
    <h5 class="page-btn" on:click={to_my_homepage}>POWERED BY @JUERGENIE</h5>
  </header>

  <main>
    <h1>Hello, Lilith!</h1>
    {#if support}
      <h3>调整以下参数，查看背景动画的变化😀</h3>
      <hr />
      <div class="content">
        <label>
          <div class="title">BLUR 模糊: {style.blur}px</div>
          <span class="left">0px</span>
          <input
            class="range"
            bind:value={style.blur}
            type="range"
            max="10"
            min="0"
            step="1"
          />
          <span class="right">10px</span>
        </label>
        <label>
          <div class="title">DENSITY 密度: {style.transition.density}px</div>
          <span class="left">10px</span>
          <input
            class="range"
            bind:value={style.transition.density}
            type="range"
            max="100"
            min="10"
            step="1"
          />
          <span class="right">100px</span>
        </label>
        <label>
          <div class="title">LENGTH 渐变长度: {style.transition.length}%</div>
          <span class="left">20%</span>
          <input
            class="range"
            bind:value={style.transition.length}
            type="range"
            max="100"
            min="20"
            step="1"
          />
          <span class="right">100%</span>
        </label>
        <label>
          <div class="title">
            MAX-SIZE 图形最大尺寸: {style.transition.max_size}px
          </div>
          <span class="left">0px</span>
          <input
            class="range"
            bind:value={style.transition.max_size}
            type="range"
            max="100"
            min="0"
            step="1"
            disabled={attribute_association}
          />
          <span class="right">100px</span>
        </label>
        <label>
          <div class="title">
            将尺寸与密度关联
            <input
              class="title"
              type="checkbox"
              bind:checked={attribute_association}
            />
          </div>
        </label>
        <label>
          <div class="title">STYLE 风格: {style.transition.style}</div>
          <select class="range" bind:value={style.transition.style}>
            <option label="fade-in" value="fade-in" />
          </select>
        </label>
      </div>
    {:else}
      <h3>
        很抱歉，您当前的浏览器不支持 LILITH-TRANSITION
        所依赖的特性，请尝试更换更新的浏览器，或在
        <a target="_blank" href="https://ishoudinireadyyet.com"> 此页面 </a>
        查看浏览器支持情况。
      </h3>
      <h3>
        Sorry, your current browser does not support the features that
        LILITH-TRANSITION relies on. Please try a newer browser or check the
        browser support status on
        <a target="_blank" href="https://ishoudinireadyyet.com">this page</a>.
      </h3>
    {/if}
  </main>

  <div class="background-carousel">
    <lilith-carousel
      bind:this={carousel}
      width="100%"
      height="100%"
      style={back_style.map((style) => `${style[0]}: ${style[1]};`).join("")}
    >
      <div
        class="background"
        style={`background-image: url("${background_1}")`}
      />
      <div
        class="background"
        style={`background-image: url("${background_2}")`}
      />
      <div
        class="background"
        style={`background-image: url("${background_3}")`}
      />
    </lilith-carousel>
  </div>
</template>

<style lang="scss">
  :host {
    width: 100%;
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .space {
    flex: 1;
  }

  header {
    display: flex;
    justify-content: center;

    background: #fff8;
    backdrop-filter: blur(8px);

    position: fixed;
    z-index: 10;

    width: 100%;
    height: 64px;
    top: 0;
    left: 0;

    padding: 0 64px;

    h1,
    h5 {
      margin: 0;
      line-height: 64px;
    }

    .page-btn {
      cursor: pointer;
    }
  }

  main {
    position: absolute;
    top: 96px;
    left: calc((100% - min(80%, 1280px)) / 2);
    z-index: 5;

    overflow: auto;

    width: 80%;
    max-width: 1280px;
    height: calc(100% - 96px - 32px);
    padding: 32px;

    background: #fff8;
    backdrop-filter: blur(8px);

    border-radius: 8px;

    text-align: center;

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      label {
        display: grid;
        grid-template: 40px 30px / 40px 400px 40px;
        grid-template-areas:
          "title title title"
          "left range right";
        column-gap: 0.5rem;
        align-items: flex-end;
        margin-bottom: 1rem;

        .title {
          grid-area: title;

          font-size: 1.2rem;
          font-style: bold;
        }
        .left {
          grid-area: left;

          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .range {
          grid-area: range;
          width: 100%;
          margin: 0;
        }

        .right {
          grid-area: right;

          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }
  }

  hr {
    border-color: #3e3e3e;
  }

  .background-carousel {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
  }

  lilith-carousel {
    position: absolute;
    top: -5%;
    left: -5%;

    width: 110%;
    height: 110%;

    overflow: hidden;

    &::part(content) {
      overflow: hidden;
      // transform: matrix(1.2, 0.3, -0.3, 1.2, 0, 0);
      filter: blur(var(--app-style-blur, 2px));
      width: 100%;
      height: 100%;
      position: absolute;
      // left: calc(-10% - var(--app-background-offset-x, 0));
      // top: calc(-10% - var(--app-background-offset-y, 0));
      left: 0;
      top: 0;
    }

    // &::part(wrapper-1) {
    //   --lilith-transition-direction: vertical;
    // }

    .background {
      width: 100%;
      height: 100%;

      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;

      background-size: cover;
      background-position: 50% 50%;

      // transform: rotate(-13deg);
    }
  }
</style>
