run:: build
	npm run start

build::
	node_modules/esbuild/bin/esbuild --bundle main.js --sourcemap --outdir=dist/ --platform=node --external:electron

