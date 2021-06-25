<svelte:options tag="lilith-app" />

<script>
  let name = "world";

  const to_my_homepage = () => {
    window.location.href = "https://github.com/juergenie";
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="./style.css" />
</svelte:head>

<template>
  <header>
    <h1>Hello, {name}!</h1>
    <div class="space" />
    <h4 on:click={to_my_homepage}>POWERED BY @JUERGENIE</h4>
  </header>
</template>

<style lang="scss">
  .space {
    flex: 1;
  }

  header {
    display: flex;

    backdrop-filter: blur(4px);
  }
</style>
