#!/usr/bin/env node
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const fs = require("fs");
const { number, select } = require('@inquirer/prompts');

const composeImage = async () => {
  try {
    console.log('Iniciando junção das imagens...');

    const tilesLength = 36;

    const tilesSize = 256;

    const imageSize = 256 * 36;

    const yOffset = imageSize - tilesSize;

    const outputFormat = await select({
      message: 'Selecione o formato do arquivo final:',
      default: 'jpeg',
      choices: [
        {
          name: 'jpeg',
          value: 'jpeg',
          description: 'Output mais rápido, arquivo mais leve, qualidade menor. (~30mb em 100% de qualidade)',
        },
        {
          name: 'png',
          value: 'png',
          description: 'Output mais demorado, arquivo condiderávelmente mais pesado, qualidade superior. (~130mb em 100% de qualidade)',
        }
      ],
    });

    const quality = await number({
      message: 'Qual é o percentual da qualidade desejada no resultado final?',
      default: 50,
      min: 10,
      max: 100,
      validate: (value) => {
        if (!value || typeof value !== "number") {
          return 'Informe um valor numérico válido entre 10 e 100.';
        }

        return true;
      }
    });

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

        fs.writeFile(`map-result-q${quality}.${outputFormat}`, base64Image, {encoding: 'base64'}, (err) => {
          console.log('Mapa criado com sucesso.');
        });
      } catch (fsError) {
        console.error('A criação do mapa falhou', fsError);
      }
    }

    mergeImages(tiles, {
      Canvas: Canvas,
      Image: Image,
      format: `image/${outputFormat}`,
      quality: quality / 100,
      height: imageSize,
      width: imageSize,
    }).then(writeMapFile);
  } catch (mergeError) {
    console.error('A junção das imagens falhou', mergeError);
  }
}

composeImage();