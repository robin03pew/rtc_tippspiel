/**
 * Share-Image Generierung mit html2canvas
 * 
 * Rendert ein DOM-Element als PNG in 1080×1920 (Instagram Story).
 * Scale: 2 für Retina-Schärfe.
 * 
 * Falls html2canvas nicht scharf genug ist:
 * → html-to-image mit pixelRatio: 2 verwenden (siehe auskommentierte Alternative unten)
 */

import html2canvas from 'html2canvas';

export async function generateShareImage(element) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#212b70',
    width: 1080,
    height: 1920,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Bild konnte nicht generiert werden'));
      },
      'image/png'
    );
  });
}

/*
 * ALTERNATIVE: html-to-image (falls html2canvas zu unscharf)
 * 
 * import { toPng } from 'html-to-image';
 * 
 * export async function generateShareImage(element) {
 *   const dataUrl = await toPng(element, {
 *     width: 1080,
 *     height: 1920,
 *     pixelRatio: 2,
 *     backgroundColor: '#212b70',
 *   });
 *   const res = await fetch(dataUrl);
 *   return res.blob();
 * }
 */
