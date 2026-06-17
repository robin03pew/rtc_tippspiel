import React, { useState, useRef, useEffect } from 'react';
import { generateShareImage } from '../utils/generateImage';
import { canNativeShareFiles, downloadImage } from '../utils/share';
import './ShareButton.css';

export default function ShareButton({ isComplete, shareImageRef, missingSteps, tippState }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preparedBlob, setPreparedBlob] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const canShare = canNativeShareFiles();

  // Pre-generate the image when predictions change and are complete
  useEffect(() => {
    let timeoutId;

    if (isComplete && shareImageRef?.current) {
      setLoading(true);
      setError(null);
      // Debounce generation to avoid running expensive html2canvas on every keystroke
      timeoutId = setTimeout(async () => {
        try {
          console.log('[ShareButton] Pre-generating image blob...');
          const blob = await generateShareImage(shareImageRef.current);
          setPreparedBlob(blob);

          setGeneratedImageUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });

          console.log('[ShareButton] Blob prepared successfully.');
        } catch (err) {
          console.error('[ShareButton] Error pre-generating:', err);
          setError('Das Bild konnte nicht vorbereitet werden.');
        } finally {
          setLoading(false);
        }
      }, 700);
    } else {
      setPreparedBlob(null);
      if (generatedImageUrl) {
        URL.revokeObjectURL(generatedImageUrl);
        setGeneratedImageUrl(null);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isComplete, tippState, shareImageRef]); // Re-run if state changes

  const handleShare = () => {
    if (!preparedBlob) {
      console.error('[ShareButton] No prepared blob available at click time.');
      return;
    }

    try {
      const file = new File([preparedBlob], 'mein-tipp-rtc.png', { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'Mein Tipp – Region Tullnerfeld Cup',
        text: 'Das ist mein Tipp für den Region Tullnerfeld Cup! ⚽',
      };

      if (canShare && navigator.canShare && navigator.canShare(shareData)) {
        console.log('[ShareButton] canShare returned true, invoking synchronous navigator.share...');
        // CRITICAL: Call navigator.share SYNCHRONOUSLY without any preceding await.
        navigator.share(shareData).then(() => {
          console.log('[ShareButton] Share successful');
        }).catch(err => {
          if (err.name === 'AbortError') {
            console.log('[ShareButton] Share aborted by user (AbortError)');
            return;
          }
          console.error('[ShareButton] Share failed with real error:', err);
          // Fallback to download if the share dialog fails to open
          downloadImage(preparedBlob);
        });
      } else {
        console.log('[ShareButton] Native file sharing not supported for this payload, falling back to download');
        downloadImage(preparedBlob);
      }
    } catch (err) {
      console.error('[ShareButton] Synchronous error during share handling:', err);
      setError('Teilen fehlgeschlagen. Bild wird heruntergeladen.');
      downloadImage(preparedBlob);
    }
  };

  return (
    <div className="share-section" id="share-section">
      {!isComplete && missingSteps && (
        <p className="share-section__hint">
          ⚠️ {missingSteps}
        </p>
      )}

      <button
        className={`share-btn ${loading ? 'share-btn--loading' : ''}`}
        onClick={handleShare}
        disabled={!isComplete || loading || !preparedBlob}
        id="share-button"
        aria-label={canShare ? 'In Story teilen!' : 'Bild speichern'}
      >
        {loading ? (
          <>
            <span className="share-btn__spinner" />
            <span>Bild wird vorbereitet&hellip;</span>
          </>
        ) : (
          <>
            <svg className="share-btn__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {canShare ? (
                <>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </>
              ) : (
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </>
              )}
            </svg>
            <span>{canShare ? 'In Story teilen!' : 'Bild speichern'}</span>
          </>
        )}
      </button>

      {error && <p className="share-section__error">{error}</p>}

      {generatedImageUrl && (
        <div className="share-section__post-generate">
          <div className="sponsor-promo">
            <span className="sponsor-promo__label">advertised with</span>
            <div className="sponsor-promo__card">
              <img src={`${import.meta.env.BASE_URL}logos/hialsorb_product.webp`} alt="Hialsorb Cold Produkt" className="sponsor-promo__image" />
              <div className="sponsor-promo__content">
                <h3 className="sponsor-promo__title">Regeneration für deine Muskeln</h3>
                <a href="https://trbchemedica.us16.list-manage.com/subscribe?u=9063d0c7041a52e4d65e56c26&id=bc7a7bcd6c" target="_blank" rel="noopener noreferrer" className="sponsor-promo__btn">
                  100% gratis Produktmuster bestellen
                </a>
              </div>
            </div>
          </div>

          <div className="share-section__preview">
            <p className="share-section__preview-hint">Tipp: Halte das Bild gedrückt oder mache einen Rechtsklick, um es zu kopieren oder zu speichern.</p>
            <img src={generatedImageUrl} alt="Dein generierter Tipp" className="share-section__preview-image" />
          </div>
        </div>
      )}
    </div>
  );
}
