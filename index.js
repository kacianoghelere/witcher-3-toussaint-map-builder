#!/usr/bin/env node
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require("fs");

const composeImage = () => {
  const tilesLength = 36;

  const tilesSize = 256;

  const imageSize = 256 * 36;

  const yOffset = imageSize - tilesSize;

  const outputFormat = 'jpeg';

  const outputQuality = 0.85;

  let tiles = [];

  for (let file = (tilesLength-1); file >= 0; file--) {
    for (let dir = 0; dir < tilesLength; dir++) {
      tiles.push({
        src: `./assets/tiles/${dir}/${file}.png`,
        x: (dir * tilesSize),
        y: yOffset - (file * tilesSize)
      });
    }
  }

  const writeMapFile = (base64String) => {
    console.log('Junção das imagens finalizada.');

    try {
      console.log('Iniciando criação do mapa...');

      let base64Image = base64String.split(';base64,').pop();

      fs.writeFile(`map-result-q${outputQuality}.${outputFormat}`, base64Image, {encoding: 'base64'}, (err) => {
        console.log('Mapa criado com sucesso.');
      });
    } catch (fsError) {
      console.error('A criação do mapa falhou', fsError);
    }
  }

  try {
    console.log('Iniciando junção das imagens...');

    mergeImages(tiles, {
      Canvas: Canvas,
      Image: Image,
      format: `image/${outputFormat}`,
      quality: outputQuality,
      height: imageSize,
      width: imageSize,
    }).then(writeMapFile);
  } catch (mergeError) {
    console.error('A junção das imagens falhou', mergeError);
  }
}

composeImage();