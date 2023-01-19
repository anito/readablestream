export function addClass(node: HTMLDivElement, className: string) {
	const classNames = className.trim().replace(/(\s+)/g, ' ').split(' ');
	classNames.map((cn) => cn && node.classList.add(cn));
}
