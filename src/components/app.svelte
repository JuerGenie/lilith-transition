<svelte:options tag="lilith-app" />

<script>
  import background_1 from "../assets/background-1.png";
  import background_2 from "../assets/background-2.jpg";

  let name = "lilith";

  const to_my_homepage = () => {
    window.open("https://github.com/juergenie", "_blank");
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="./style.css" />
</svelte:head>

<template>
  <header>
    <h1>Hello, {name}!</h1>
    <div class="space" />
    <h5 class="my-home-page" on:click={to_my_homepage}>
      POWERED BY @JUERGENIE
    </h5>
  </header>

  <main>HELLO, LILITH!</main>

  <lilith-carousel width="100%" height="100%">
    <div
      class="background"
      style={`background-image: url("${background_1}")`}
    />
    <div
      class="background"
      style={`background-image: url("${background_2}")`}
    />
  </lilith-carousel>
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

    .my-home-page {
      cursor: pointer;
    }
  }

  main {
    position: absolute;
    top: 96px;
    left: calc((100% - min(100%, 1280px)) / 2);
    z-index: 5;

    overflow: auto;

    width: 100%;
    max-width: 1280px;
    height: calc(100% - 96px - 32px);
    padding: 32px;

    background: #fff8;
    backdrop-filter: blur(8px);

    border-radius: 8px;
  }

  lilith-carousel {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    &::part(content) {
      overflow: hidden;
      transform: matrix(1.2, 0.1, -0.1, 1.2, 0, 0);
    }

    .background {
      width: 120%;
      height: 120%;

      position: absolute;
      left: -10%;
      top: -10%;

      background-size: cover;
      background-position: 50% 50%;

      filter: blur(4px);

      transform: matric(calc(1 / 1.2), -0.1, 0.1, calc(1 / 1.2), 0, 0);
    }
  }
</style>
