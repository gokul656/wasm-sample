"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

declare global {
  interface Window {
    convertToGreyScale: (base64String: string) => string;
  }
}

export default function Home() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [wasmLoaded, setWasmLoaded] = useState(false);

  // Load WASM and wasm_exec.js on the client side
  useEffect(() => {
    const loadWasm = async () => {
      if (typeof window === "undefined") return;

      const go = new Go();
      const wasm = await WebAssembly.instantiateStreaming(fetch("/main.wasm"), go.importObject);
      go.run(wasm.instance);
      setWasmLoaded(true);
    };

    loadWasm();
  }, []);

  // Convert to Grayscale
  const convertToGrayscale = async () => {
    if (!wasmLoaded) {
      alert("WebAssembly module is not loaded yet. Please wait a moment and try again.");
      return;
    }

    if (!previewImage) {
      alert("Please upload or drop an image to convert.");
      return;
    }

    const base64String = previewImage.split(",")[1]; // Remove data:image/jpeg;base64,

    if (typeof window.convertToGreyScale !== "function") {
      alert("WASM function not found. Please ensure the WebAssembly module is loaded.");
      return;
    }

    const grayImageBase64 = window.convertToGreyScale(base64String);

    if (grayImageBase64.startsWith("Error:")) {
      alert("An error occurred while converting the image.");
      console.error(grayImageBase64);
      return;
    }

    // Set the output image
    setPreviewImage(`data:image/jpeg;base64,${grayImageBase64}`);
  };

  // Handle File Input or Drop
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={styles.main}>
      <input
        type="file"
        name="imageInput"
        id="imageInput"
        accept="image/jpeg"
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />
      <label
        htmlFor="imageInput"
        className={styles.dottedoutline}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <Image
            className={styles.logo}
            src={previewImage}
            alt="preview"
            width={180}
            height={180}
            priority
          />
        ) : (
          <>
          <Image
            src={"/upload.png"}
            alt="preview"
            width={180}
            height={180}
            priority
          />
            <h4 className={styles.dnd}>Drag & Drop Image</h4>
            <p className={styles.description}>Supported formats .jpg, .jpeg</p>
          </>
        )}
      </label>
      <button className={styles.button} onClick={convertToGrayscale}>
        Convert to Grayscale
      </button>
    </div>
  );
}
