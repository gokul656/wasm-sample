//go:build js && wasm
// +build js,wasm

package main

import (
	_ "embed"
	"encoding/base64"
	"log"
	"syscall/js"

	"github.com/gokul656/wasm-sample/internal"
)

//go:embed assets/sample.jpg
var targetBuffer []byte

func main() {
	js.Global().Set("convertToGreyScale", js.FuncOf(convertToGreyScale))
	select {}
}

func convertToGreyScale(this js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return "No image data provided"
	}

	imageData := args[0].String()

	// Convert the base64 string to a byte slice (image data)
	decodedImage, err := base64.StdEncoding.DecodeString(imageData)
	if err != nil {
		return "Failed to decode image: " + err.Error()
	}

	img := internal.NewImage(decodedImage)
	if err := img.ConvertToGrayScale(); err != nil {
		log.Fatalf("error: %v", err)
	}

	grayscaleData := img.ToBase64()
	if grayscaleData == "" {
		return "Error encoding grayscale image"
	}

	return grayscaleData
}

func TestImageConversion() {
	img := internal.NewImage(targetBuffer)
	if err := img.ConvertToGrayScale(); err != nil {
		log.Fatalf("error: %v", err)
	}

	if err := img.SaveToFile("sample_grey.jpg"); err != nil {
		log.Fatalf("error: %v", err)
	}
}
