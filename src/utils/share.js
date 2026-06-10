/**
 * Share-Utilities
 * 
 * - Web Share API (native Share-Sheet mit Datei)
 * - Fallback: Download als PNG
 */

/**
 * Prüft ob die Web Share API mit Dateien unterstützt wird
 */
export function canNativeShareFiles() {
  if (!navigator.share || !navigator.canShare) return false;

  try {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

/**
 * Teilt eine Bilddatei über die Web Share API (öffnet das native Share-Sheet)
 */
export async function shareImageFile(blob) {
  const file = new File([blob], 'mein-tipp-rtc.png', { type: 'image/png' });

  await navigator.share({
    files: [file],
    title: 'Mein Tipp – Region Tullnerfeld Cup',
    text: 'Das ist mein Tipp für den Region Tullnerfeld Cup! ⚽',
  });
}

/**
 * Fallback: Bild als Download anbieten
 */
export function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mein-tipp-rtc.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Kurze Verzögerung vor dem Revoke, damit der Download startet
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
