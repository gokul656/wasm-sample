// wasm_exec.d.ts
declare class Go {
    importObject: any;
    run(instance: WebAssembly.Instance): void;
}
