import React, { useState, useRef } from 'react';
import { generateShareImage } from '../utils/generateImage';
import { canNativeShareFiles, shareImageFile, downloadImage } from '../utils/share';
import './ShareButton.css';

export default function ShareButton({ isComplete, shareImageRef, missingSteps }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const canShare = canNativeShareFiles();

  const handleShare = async () => {
    if (!shareImageRef?.current) return;

    setLoading(true);
    setError(null);

    try {
      const blob = await generateShareImage(shareImageRef.current);
      const url = URL.createObjectURL(blob);
      setGeneratedImageUrl(url);

      if (canShare) {
        try {
          await shareImageFile(blob);
        } catch (shareErr) {
          // User hat Share abgebrochen – kein Fehler
          if (shareErr.name !== 'AbortError') {
            // Fallback auf Download wenn Share fehlschlägt
            downloadImage(blob);
          }
        }
      } else {
        downloadImage(blob);
      }
    } catch (err) {
      console.error('Share-Image Fehler:', err);
      setError('Das Bild konnte nicht erstellt werden. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
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
        disabled={!isComplete || loading}
        id="share-button"
        aria-label={canShare ? 'Auf Instagram teilen' : 'Bild speichern'}
      >
        {loading ? (
          <>
            <span className="share-btn__spinner" />
            <span>Bild wird erstellt&hellip;</span>
          </>
        ) : (
          <>
            <svg className="share-btn__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {canShare ? (
                /* Share icon */
                <>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </>
              ) : (
                /* Download icon */
                <>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </>
              )}
            </svg>
            <span>{canShare ? 'Auf Instagram teilen' : 'Bild speichern'}</span>
          </>
        )}
      </button>

      {error && <p className="share-section__error">{error}</p>}

      {generatedImageUrl && (
        <div className="share-section__preview">
          <p className="share-section__preview-hint">Tipp: Halte das Bild gedrückt oder mache einen Rechtsklick, um es zu kopieren oder zu speichern.</p>
          <img src={generatedImageUrl} alt="Dein generierter Tipp" className="share-section__preview-image" />
        </div>
      )}
    </div>
  );
}
