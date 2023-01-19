<script lang="ts">
	import './styles.css';
  import { derived } from 'svelte/store';
  import { setContext } from 'svelte';
	import streams from '$lib/stores/streamStore';
	
  setContext('progress', {
    getProgress: () =>
      derived(streams, ($streams, set) => {
        set(
          $streams.reduce<number>((map, el) => {
            const { total, received } = el.stream;
            const percent =
              received !== undefined && total !== undefined && (received * 100) / total;
            return percent ? map + percent : map;
          }, 0)
        );
      })
  });
</script>

<div class="app">

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
