run:: build
	npm run start

build::
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle main.js --sourcemap --outdir=dist/ --platform=node --external:electron
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle preload.js --sourcemap --outdir=dist/ --platform=node --external:electron
	node_modules/esbuild/bin/esbuild --log-level=warning --bundle renderer.js --sourcemap --outdir=dist/ --inject:src/react-shim.js


watch:: 
	node_modules/esbuild/bin/esbuild --watch --bundle renderer.js --sourcemap --outdir=dist/ --inject:src/react-shim.js
