.PHONY: run build

run:
	make build
	cp bin/main.wasm web/public/main.wasm
	cp bin/wasm_exec.js web/public/wasm_exec.js
	echo "Running..."
	cd web && npm install && npm run dev

build:
	echo "Building..."
	GOOS=js GOARCH=wasm go build -o bin/main.wasm main.go
	cp "$$(go env GOROOT)/misc/wasm/wasm_exec.js" bin/wasm_exec.js
