<svelte:options tag="lilith-carousel" />

<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import { get_current_component } from "svelte/internal";

  export let current_index: number = 0;
  export let width: string = "200px";
  export let height: string = "200px";
  export let stop_when_hover: boolean = false;

  const self_component = get_current_component() as HTMLElement;
  let content_element: Array<{ div: HTMLDivElement; source: HTMLElement }> = [];

  export function update_content() {
    content_element = [];
    const children = self_component.children;
    for (let i = 0; i < children.length; i++) {
      content_element.push({
        div: null as unknown as HTMLDivElement,
        source: children.item(i) as HTMLElement,
      });
    }
    content_element.forEach((el, i) => (el.source.slot = String(i)));

    clearInterval(timer);
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

  $: {
    const target = content_element[current_index];
    if (target && target.div) {
      content_element.forEach((el) => {
        if (el.div.style.zIndex > target.div.style.zIndex) {
          el.div.style.zIndex = String(Number(el.div.style.zIndex) - 1);
        }
        el.div.classList.remove("top");
      });
      target.div.style.zIndex = "3";
      target.div.classList.add("top");
    }
  }

  const dispatch = createEventDispatcher<{ change: unknown }>();
  let timer = 0;
  let canTrans = true;
  onMount(() => {
    update_content();
  });
  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<template>
  <div
    style={`width: ${width}; height: ${height}; position: relative;`}
    part="content"
    on:mouseenter={() => stop_when_hover && (canTrans = false)}
    on:mouseleave={() => stop_when_hover && (canTrans = true)}
  >
    {#each content_element as _, index}
      <div
        part={`wrapper wrapper-${index}`}
        class={["wrapper", index === current_index ? "top" : ""].join(" ")}
        bind:this={content_element[index].div}
      >
        <slot name={index} />
      </div>
    {/each}
  </div>
</template>

<style lang="scss">
  :root {
    --lilith-transition-density: 20px;
  }

  :host(::part(content)) {
    overflow: hidden;
  }

  .wrapper {
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
  .top {
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
