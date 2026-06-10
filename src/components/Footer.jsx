import React from 'react';
import { useRef } from 'react';
import './Footer.css';

export default function Footer({ onOpenDialog }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer__content">
        <div className="footer__links">
          <button className="footer__link" onClick={() => onOpenDialog('teilnahme')} type="button">
            Teilnahmebedingungen
          </button>
          <span className="footer__divider">·</span>
          <button className="footer__link" onClick={() => onOpenDialog('datenschutz')} type="button">
            Datenschutz
          </button>
          <span className="footer__divider">·</span>
          <button className="footer__link" onClick={() => onOpenDialog('impressum')} type="button">
            Impressum
          </button>
        </div>

        <p className="footer__storage-hint">
          💾 Dein Tipp wird lokal in deinem Browser gespeichert (localStorage), 
          damit er beim Neuladen nicht verloren geht. Es werden keine Daten an Server übertragen.
        </p>

        <p className="footer__url">
          tippspiel.regiontullnerfeldcup.at
        </p>
      </div>
    </footer>
  );
}
