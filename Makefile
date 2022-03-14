run:: build
	npm run start

build::
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle main.js --sourcemap --outdir=dist/ --platform=node --external:electron
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle preload.js --sourcemap --outdir=dist/ --platform=node --external:electron
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle renderer.js --sourcemap --outdir=dist/

