<script>
  import Section from './Section.svelte';
</script>

<Section>
  <div class="blurb">
    <div class="box header">
      <slot name="header" />
    </div>

    <div class="box one">
      <slot name="one" />
    </div>

    <div class="box two">
      <slot name="two" />
    </div>

    <div class="box three">
      <slot name="three" />
    </div>

    <div class="box fore">
      <slot name="fore"/>
    </div>
  </div>
</Section>

<style>
  .blurb {
    display: grid;
    grid-row-gap: 0em;
    grid-template-areas:
      'header'
      'one'
      'two'
      'three'
      'fore';
  }
  .one {
    grid-area: one;
  }
  .two {
    grid-area: two;
  }
  .three {
    grid-area: three;
  }
  .fore {
    grid-area: fore;
  }
  .box {
    padding: 1em;
    display: flex;
    flex-direction: column;
    border-bottom: none;
  }

  .box :global(a) {
    padding: 0;
    border: none;
  }

  .box:global(h2) {
    padding: 0;
    margin: 0 0 0.5em 0;
    font-size: var(--h2);
    color: white;
    text-align: left;
  }

  :global(p),
  :gloabl(a) {
    font-size: var(--h5);
  }
  @media (min-width: 991px) {
    .blurb {
      grid-column-gap: 1em;
      grid-row-gap: 1em;
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas:
        'header header'
        'one two'
        'three fore';
    }
    .blurb .box {
      padding: 2em;
    }
    .blurb .box :gloabl(.cta) {
      text-align: right;
    }
    
  }

  @media (min-width: 1200px) {
    .blurb {
      grid-column-gap: 1em;
      grid-row-gap: 5em;
      grid-template-columns: repeat(2, 1fr);
      grid-template-areas:
        'header header'
        'one two'
        'three fore';
    }
     .blurb .what {
        margin: 0;
      }

     .blurb .box :gloabl(.cta) {
        text-align: left;
      }
  }
</style>
