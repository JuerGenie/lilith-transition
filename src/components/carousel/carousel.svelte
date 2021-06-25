<svelte:options tag="lilith-carousel" />

<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher } from "svelte";

  export let current_index: number = 0;
  export let width: string = "200px";
  export let height: string = "200px";

  let content_element: HTMLElement[];

  let slot: HTMLSlotElement;
  $: {
    if (slot) {
      content_element = slot.assignedElements() as HTMLElement[];
    }
  }

  // const dispatch = createEventDispatcher();
  $: {
    if (slot) {
      const target = content_element[current_index];
      if (target) {
        content_element.forEach((el) => {
          if (el.style.zIndex > target.style.zIndex) {
            el.style.zIndex = String(Number(el.style.zIndex) - 1);
          }
          el.classList.remove("top");
        });
        target.style.zIndex = "3";
        target.classList.add("top");
      }
    }
  }

  const dispatch = createEventDispatcher<{ change: unknown }>();
  let timer = 0;
  let canTrans = true;
  onMount(() => {
    if (content_element.length > 1) {
      timer = setInterval(() => {
        if (canTrans) {
          current_index += 1;
          if (current_index >= content_element.length) {
            current_index = 0;
          }
          dispatch("change", { current_index });
        }
      }, 4000) as unknown as number;
    }
  });
  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<svelte:head>
  <style>
    :root {
      --lilith-transition-density: 20px;
    }
    lilith-carousel::part(content) {
      overflow: hidden;
    }
    lilith-carousel > * {
      position: absolute;

      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;

      mask-image: paint(lilith-transition);
      -webkit-mask-image: paint(lilith-transition);

      --lilith-transition-position: 100%;
    }
    lilith-carousel > .top {
      animation: lilith-carousel-animation 2s linear;
    }
    @keyframes lilith-carousel-animation {
      0% {
        --lilith-transition-position: -100%;
      }
      100% {
        --lilith-transition-position: 100%;
      }
    }
  </style>
</svelte:head>

<template>
  <div
    style={`width: ${width}; height: ${height}; position: relative;`}
    part="content"
    on:mouseenter={() => (canTrans = false)}
    on:mouseleave={() => (canTrans = true)}
  >
    <slot bind:this={slot} />
  </div>
</template>

<style lang="scss">
  [part="content"] {
    transition: box-shadow 100ms;
    &:hover {
      box-shadow: 0 4px 16px 0 #000;
    }
  }
</style>
