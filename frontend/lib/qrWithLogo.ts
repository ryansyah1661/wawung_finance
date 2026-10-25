import QRCode from 'qrcode';

export interface QrWithLogoOptions {
  size?: number;
  logoUrl?: string;
  margin?: number;
  badgeStyle?: 'black' | 'maroon' | 'white';
  badgeSizePercent?: number; // default 0.23 (23% of QR size)
  iconScaleInBadge?: number; // default 0.74 (74% of badge diameter)
}

/**
 * Generates a high-resolution QR code Data URL (PNG) with a circular branded logo badge
 * in the center, formatted exactly like WhatsApp's official QR code (black circular badge with
 * crisp white separation halo).
 */
export async function generateQrWithLogo(
  data: string,
  options: QrWithLogoOptions = {}
): Promise<string> {
  const size = options.size || 600;
  const logoUrl = options.logoUrl || '/kawung-icon.png';
  const margin = options.margin ?? 2;
  const badgeStyle = options.badgeStyle || 'black';
  const badgeRatio = options.badgeSizePercent || 0.23;
  const iconScale = options.iconScaleInBadge || 0.74;

  if (typeof window === 'undefined') {
    return '';
  }

  // 1. Create Canvas
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 2. Render QR code with Error Correction Level 'H' (30% recovery capability)
  await QRCode.toCanvas(canvas, data, {
    width: size,
    margin,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  // 3. Load and render center logo badge (WhatsApp style - Solid Black Badge)
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const drawAndResolve = (loadedImg?: HTMLImageElement) => {
      const cx = size / 2;
      const cy = size / 2;
      const badgeDiameter = Math.round(size * badgeRatio);
      const badgeRadius = Math.round(badgeDiameter / 2);
      const haloWidth = Math.max(3, Math.round(size * 0.009)); // Clean white separation border
      const haloRadius = badgeRadius + haloWidth;

      ctx.save();

      // Step A: Draw white separation halo circle (clears QR dots around badge)
      ctx.beginPath();
      ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Step B: Draw circular badge background (Black to blend seamlessly with QR code)
      let badgeBg = '#000000';
      if (badgeStyle === 'maroon') badgeBg = '#70080b';
      if (badgeStyle === 'white') badgeBg = '#ffffff';

      ctx.beginPath();
      ctx.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
      ctx.fillStyle = badgeBg;
      ctx.fill();

      if (badgeStyle === 'white') {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Step C: Draw Kawung logo icon inside the circular badge
      if (loadedImg && loadedImg.width > 0) {
        const iconSize = Math.round(badgeDiameter * iconScale);
        const iconX = Math.round(cx - iconSize / 2);
        const iconY = Math.round(cy - iconSize / 2);

        if (badgeStyle === 'black' || badgeStyle === 'maroon') {
          // Render logo in crisp white (like WhatsApp white phone icon)
          const offCanvas = document.createElement('canvas');
          offCanvas.width = iconSize;
          offCanvas.height = iconSize;
          const offCtx = offCanvas.getContext('2d');

          if (offCtx) {
            offCtx.drawImage(loadedImg, 0, 0, iconSize, iconSize);
            offCtx.globalCompositeOperation = 'source-in';
            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, iconSize, iconSize);

            ctx.drawImage(offCanvas, iconX, iconY, iconSize, iconSize);
          } else {
            ctx.drawImage(loadedImg, iconX, iconY, iconSize, iconSize);
          }
        } else {
          // White badge: draw original maroon logo
          ctx.drawImage(loadedImg, iconX, iconY, iconSize, iconSize);
        }
      }

      ctx.restore();
      resolve(canvas.toDataURL('image/png'));
    };

    img.onload = () => drawAndResolve(img);
    img.onerror = () => {
      console.warn('Failed to load logo for QR code, generating without logo');
      drawAndResolve();
    };
    img.src = logoUrl;
  });
}
