<script lang="ts">
  export { className as class };

  let className = '';
</script>

<div class="outer {className}">
  <slot />
</div>

<style>
  .outer {
    --height: 50px;
    position: relative;
  }
</style>
