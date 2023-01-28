<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import { base } from '$lib/api';
  import { register } from '$lib/utils/reader';
  import Loader from './Loader.svelte';
  import Container from './Container.svelte';
  import Blurb from './Blurb.svelte';
  import IFrameViewer from './IFrameViewer.svelte';

  /**
   * 
   * Autostart
   * - if you want the stream to start automatically, put the start method in onMount:
   * 
   * const { start, store } = register({
   *   filename: 'sample.jpg',
   *   url: http://example.com
   * });
   * 
   * onMount(() => {
   *  myStreamPromise = start()
   * })
   * 
   * Manual start
   * - to control the start of the stream add a button with a clickHandler like so:
   * <button on:click={() => myStreamPromise = myStart().stream()}>start</button>
   */
  const autostart = false;
  const url = base;
  const { getProgress: getGlobalProgress }: any = getContext('progress');

  const progress = getGlobalProgress();

  $: progrssbarWidth = $progress;

  let imageStream: Promise<any>;
  let imageData: any;

  let textStream: Promise<any>;
  let textData: any;

  let zipStream: Promise<any>;
  let zipData: any;

  let pdfStream: Promise<any>;
  let pdfData: any;

  /**
   * Register external ressources
   *
   * register - takes an object with two keys:
   *  - filename (e.g. sample.zip) and
   *  - url: e.g. https://example.com
   * The 'register' method will return an object { start, store }
   * 'start': a function that returns a promise you can use for e.g. a loading spinner
   * 'store' - a svelte store you can subscribe to to receive the following props:
   * - percentage, current, total, chunks, controller (to controller.close() the pipe)
   */
  const { start: imageStart, store: imageStore } = register({
    filename: 'sample.jpg',
    url
  });
  const { start: textStart, store: textStore } = register({
    filename: 'sample.txt',
    url
  });
  const { start: zipStart, store: zipStore } = register({
    filename: 'sample.zip',
    url
  });
  const { start: pdfStart, store: pdfStore } = register({
    filename: 'sample.pdf',
    url
  });

  /**
   * Configure display information based on image|text|zip|pdf Data
   * dispatched by the Loader Components
   */
  $: imageButtonLabel = getLabel(imageData);
  $: textButtonLabel = getLabel(textData);
  $: zipButtonLabel = getLabel(zipData);
  $: pdfButtonLabel = getLabel(pdfData);

  $: imageProgress = getProgress(imageData);
  $: textProgress = getProgress(textData);
  $: zipProgress = getProgress(zipData);
  $: pdfProgress = getProgress(pdfData);

  onMount(() => {
    if (autostart) {
      imageStream = imageStart();
      textStream = textStart();
      zipStream = zipStart();
      pdfStream = pdfStart();
    }
  });

  function getProgress(
    data: { received: any; total: any; status: any } = {
      received: undefined,
      total: undefined,
      status: undefined
    }
  ) {
    const { received, total, status } = data;
    if (isNaN(received) || isNaN(total)) return '(click button to start)';
    const totals = getFilesize(total);
    const info = status ? ` (${status})` : '';
    return `${getFilesize(received).value} of ${totals.value} ${totals.unit}${info}`;
  }

  function getFilesize(filesize: number, opts: { decimals: 1 | 2 | 3 | 4 } = { decimals: 2 }) {
    let kilobyte;
    let megabyte;
    const byte = filesize;
    const kb = (kilobyte = byte / 1024) > 1 && kilobyte;
    const mb = (megabyte = kilobyte / 1024) > 1 && megabyte;
    const unit = mb ? 'MByte' : kb ? 'KByte' : 'Byte';
    const value = (mb || kb || byte).toFixed(opts.decimals);
    return { value, unit };
  }

  function getLabel({ status }: { status?: string } = { status: undefined }) {
    if (status === undefined || status === 'done' || status === 'closed') return 'Start';
    if (status === 'starting') return 'Starting';
    if (status === 'reading') return 'Cancel';
  }
</script>

  <Blurb>
    <header class="header" slot="header" style:--progressbar-w="{progrssbarWidth}%">
      <h2>Loading Ressources Example</h2>
      <h3>Uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream" target="_blank" re="noreferrer" alt="MDN ReadableStream">ReadableStream</a></h3>
      <i style="font-size: 0.8rem;">with DeveloperTools open or viewing in an Incognito tab you might be able to slow down loading progress</i>
    </header>
    
    <Container class="one" slot="one">
      <div class="read-box">
        {#if imageStream}
          {#await imageStream}
            <Loader store={imageStore} on:stream:status={(e) => (imageData = e.detail)} let:progress>
              <h5 class="inner">{(!isNaN(progress) && progress) || '0'}<small>%</small></h5>
            </Loader>
          {:then result}
            <IFrameViewer blob={result.blob} title="sample.jpg" />
          {/await}
        {/if}
      </div>
      <div class="controls">
        <button on:click={() => (imageStream = imageStart())} class="button"
          >{imageButtonLabel}</button
        >
        <div class="fileinfo">
          <span class="filesize">{imageProgress}</span>
          <span class="filename">sample.jpg</span>
        </div>
      </div>
    </Container>

    <Container class="two" slot="two">
      <div class="read-box" style="">
        {#if textStream}
          {#await textStream}
            <Loader store={textStore} on:stream:status={(e) => (textData = e.detail)} let:progress>
              <h5 class="inner">{(!isNaN(progress) && progress) || '0'}<small>%</small></h5>
            </Loader>
          {:then result}
            <IFrameViewer blob={result.blob} title="sample.txt" />
          {/await}
        {/if}
      </div>
      <div class="controls">
        <button on:click={() => (textStream = textStart())} class="button"
          >{textButtonLabel}</button
        >
        <div class="fileinfo">
          <span class="filesize">{textProgress}</span>
          <span class="filename">sample.txt</span>
        </div>
      </div>
    </Container>

    <Container class="three" slot="three">
      <div class="read-box" style="">
        {#if zipStream}
          {#await zipStream}
            <Loader store={zipStore} on:stream:status={(e) => (zipData = e.detail)} let:progress>
              <h5 class="inner">{(!isNaN(progress) && progress) || '0'}<small>%</small></h5>
            </Loader>
          {:then result}
            <IFrameViewer blob={result.blob} title="sample.zip" />
          {/await}
        {/if}
      </div>
      <div class="controls">
        <button on:click={() => (zipStream = zipStart())} class="button"
          >{zipButtonLabel}</button
        >
        <div class="fileinfo">
          <span class="filesize">{zipProgress}</span>
          <span class="filename">sample.zip</span>
        </div>
      </div>
    </Container>

    <Container class="fore" slot="fore">
      <div class="read-box" style="">
        {#if pdfStream}
          {#await pdfStream}
            <Loader store={pdfStore} on:stream:status={(e) => (pdfData = e.detail)} let:progress>
              <h5 class="inner">{(!isNaN(progress) && progress) || '0'}<small>%</small></h5>
            </Loader>
          {:then result}
            <IFrameViewer blob={result?.blob} title="sample.pdf" />
          {/await}
        {/if}
      </div>
      <div class="controls">
        <button on:click={() => (pdfStream = pdfStart())} class="button"
          >{pdfButtonLabel}</button
        >
        <div class="fileinfo">
          <span class="filesize">{pdfProgress}</span>
          <span class="filename">sample.pdf</span>
        </div>
      </div>
    </Container>
  </Blurb>

<style lang="scss">
  .outer {
    --height: 50px;
    position: relative;
  }
  .read-box {
    display: flex;
    width: 350px;
    min-width: 350px;
    height: 350px;
    min-height: 350px;
    text-align: justify;
    padding: 10px;
    background-color: #69696920;
    margin: 0 auto;
    position: relative;
    overflow: auto;
  }
  .controls {
    position: absolute;
    width: 100%;
    height: var(--height);
    left: 0;
    bottom: 0;
    background: var(--background-100);
  }
  .button,
  .button:focus {
    display: inline-block;
    font-size: 0.9rem;
    position: absolute;
    bottom: 10px;
    width: 100px;
    left: 50%;
    margin-left: -50px;
    outline: 1px solid #000 !important;
    border-radius: 0.15rem;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    text-transform: uppercase;
    padding: 5px 10px;
  }
  header{
    position: relative;
  }
	header::before,
  header::after {
    --progressbar-h: 3px;
  }
  header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--progressbar-w, 100%);
    height: var(--progressbar-h);
    background: var(--secondary);
    transition: all ease-out 1s;
    z-index: 1;
  }
  header::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--progressbar-w, 100vw);
    height: var(--progressbar-h);
    background: var(--color-theme-1);
    transition: all ease-out 1s;
    z-index: 2;
  }
  .fileinfo {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    font: var(--h6) var(--font-mono);
    position: absolute;
    bottom: -20px;
    right: 0;
    font-size: 0.7rem;
    font-family: var(--font-mono);
    opacity: 0.6;
    width: 100%;
  }
  :global(.loader) .inner {
    display: flex;
    align-items: center;
    small {
      font-size: 1.5rem;
    }
  }
</style>
