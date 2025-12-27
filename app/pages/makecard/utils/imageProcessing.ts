// see https://phg1024.github.io/image/processing/2014/01/04/ImageProcJS1.html

export const applyAutoLevels = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const totalPixels = data.length / 4;

  const threshold = totalPixels * 0.005;

  const luts = [new Uint8Array(256), new Uint8Array(256), new Uint8Array(256)];

  for (let c = 0; c < 3; c++) {
    const hist = new Int32Array(256);
    for (let i = c; i < data.length; i += 4) hist[data[i]]++;

    let min = 0, max = 255;
    for (let i = 0, count = 0; i < 256; i++) {
      count += hist[i];
      if (count >= threshold) { min = i; break; }
    }
    for (let i = 255, count = 0; i >= 0; i--) {
      count += hist[i];
      if (count >= threshold) { max = i; break; }
    }

    // Linear Transformation: p' = alpha * p + beta
    // Derived to map [min, max] to [0, 255]
    const alpha = 255 / (max - min || 1);
    const beta = -min * alpha;

    for (let i = 0; i < 256; i++) {
      luts[c][i] = Math.max(0, Math.min(255, alpha * i + beta));
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    data[i] = luts[0][data[i]];
    data[i + 1] = luts[1][data[i + 1]];
    data[i + 2] = luts[2][data[i + 2]];
  }

  ctx.putImageData(imageData, 0, 0);
  bitmap.close();
  return await canvas.convertToBlob({ type: 'image/png', quality: 0.9 });
};

export const applyAutoCurves = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const totalPixels = data.length / 4;

  // 1. Calculate Perceptual Brightness Histogram
  const hist = new Int32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    // Rec. 601 Luma formula
    const y = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    hist[y]++;
  }

  // 2. Compute CDF: p' = 255 * c(p)
  const cdf = new Int32Array(256);
  cdf[0] = hist[0];
  for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i];

  // 3. Create Equalization LUT
  const lut = new Uint8Array(256);
  const cdfMin = cdf.find(v => v > 0) || 0;
  for (let i = 0; i < 256; i++) {
    // The blog's formula: p' = ((cdf[p] - cdfMin) / (total - cdfMin)) * 255
    lut[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
  }

  // 4. Apply transformation while preserving color ratios
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const y = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const newY = lut[y];

    if (y > 0) {
      const ratio = newY / y;
      data[i] = Math.min(255, r * ratio);
      data[i + 1] = Math.min(255, g * ratio);
      data[i + 2] = Math.min(255, b * ratio);
    } else {
      data[i] = data[i+1] = data[i+2] = newY;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  bitmap.close();
  return await canvas.convertToBlob({ type: 'image/png', quality: 0.9 });
};
