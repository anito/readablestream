export interface Stream {
	current?: number;
	total?: number;
	percent?: number;
	chunks?: Uint8Array[];
	controller?: ReadableStreamDefaultController<any>;
	reader?: ReadableStreamDefaultReader<Uint8Array>;
}

export interface IndexedStream<IndexedStreamType = Record<string, any>> {
	id: string;
	stream: Stream;
}
