// CODELAB: Register service worker.
//service-worker.js must put in root directory
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('service-worker.js', { scope: '/' })
			.then((reg) => {
				console.log('Service worker registered.', reg);
			});
	});
}