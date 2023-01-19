import type { IndexedStream } from '$lib/types';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, update, set } = writable([] as IndexedStream[], () => {});

	let findIndexById = (id: string, items: IndexedStream[]) => {
		return items.findIndex((itm) => itm.id == id);
	};

	return {
		subscribe,
		update: (item: IndexedStream) =>
			update((items) => {
				const index = findIndexById(item.id, items);
				if (index != -1)
					return [
						...items.slice(0, index),
						{ ...items[index], ...item },
						...items.slice(index + 1)
					];
				return [...items, item];
			}),
		del: (id: string) => update((items) => items.filter((item: IndexedStream) => item.id !== id)),
	};
}

export default createStore();
