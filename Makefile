.PHONY: run build

run:
	go run main.go

build:
	echo "Building..."
	GOOS=js GOARCH=wasm go build -o web/main.wasm main.go
	cp "$$(go env GOROOT)/misc/wasm/wasm_exec.js" web/wasm_exec.js
