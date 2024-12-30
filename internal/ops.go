package internal

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"os"

	"image/color"
	"image/jpeg"
)

type Image struct {
	image []byte
	name  string
	path  string
}

func NewImage(img []byte) *Image {
	return &Image{
		image: img,
		name:  "sample",
		path:  "assets/sample.jpg",
	}
}

func (i *Image) ConvertToGrayScale() error {
	if len(i.image) == 0 {
		return fmt.Errorf("image data is empty")
	}

	img, _, err := image.Decode(bytes.NewReader(i.image))
	if err != nil {
		return err
	}

	imgGray := image.NewGray(img.Bounds())
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			grayColor := color.GrayModel.Convert(img.At(x, y))
			imgGray.Set(x, y, grayColor)
		}
	}

	var buf bytes.Buffer
	if err := jpeg.Encode(&buf, imgGray, nil); err != nil {
		return fmt.Errorf("failed to encode grayscale image: %w", err)
	}
	i.image = buf.Bytes()

	return nil
}

func (i *Image) SaveToFile(filename string) error {
	return os.WriteFile(filename, i.image, 0644)
}

func (i *Image) ToBase64() string {
	return base64.StdEncoding.EncodeToString(i.image)
}
