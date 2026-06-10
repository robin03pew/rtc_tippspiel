import React, { useRef, useCallback } from 'react';
import { GROUPS, SEMI_FINAL_SCHEMA, RTC_LOGO } from './data/teams';
import { useTippState } from './hooks/useTippState';
import GroupCard from './components/GroupCard';
import MatchCard from './components/MatchCard';
import ShareButton from './components/ShareButton';
import ShareImage from './components/ShareImage';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const tipp = useTippState();
  const shareImageRef = useRef(null);
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);

  // Dialog-Inhalte
  const dialogContents = {
    teilnahme: {
      title: 'Teilnahmebedingungen',
      body: `
        <p><strong>1. Gegenstand</strong><br>Dieses Tippspiel ist eine rein private, kostenlose Unterhaltungsaktion im Rahmen des Region Tullnerfeld Cups. Es gibt keine Sach- oder Geldpreise zu gewinnen.</p>
        <p><strong>2. Teilnahmeberechtigung</strong><br>Teilnahmeberechtigt sind alle Personen. Die Teilnahme erfolgt ausschließlich über die Website durch das Generieren und Teilen des Tipp-Bildes.</p>
        <p><strong>3. Ablauf</strong><br>Jeder Teilnehmer tippt die Gruppensieger, die Halbfinal- und Finalergebnisse und kann das resultierende Bild auf Social Media teilen.</p>
        <p><strong>4. Rechtsweg</strong><br>Der Rechtsweg ist ausgeschlossen.</p>
      `,
    },
    datenschutz: {
      title: 'Datenschutzerklärung',
      body: `
        <p><strong>1. Grundsatz</strong><br>Der Schutz deiner Daten ist uns wichtig. Dieses Tippspiel kommt komplett ohne Backend, Datenbank oder Tracking-Cookies aus.</p>
        <p><strong>2. Lokale Speicherung (localStorage)</strong><br>Deine Tipps werden ausschließlich lokal in deinem Browser (im sogenannten localStorage) gespeichert, damit dein Fortschritt beim Neuladen der Seite nicht verloren geht. Es werden keine Daten an uns oder Dritte übertragen.</p>
        <p><strong>3. Bildgenerierung</strong><br>Das Share-Bild für Instagram wird komplett auf deinem Gerät (clientseitig) generiert. Auch hierbei findet kein Datenaustausch mit einem Server statt.</p>
        <p><strong>4. Hosting</strong><br>Die Website wird über GitHub Pages gehostet. Beim Aufruf der Seite können technisch bedingt Verbindungsdaten (z. B. IP-Adresse) durch den Hosting-Provider verarbeitet werden.</p>
      `,
    },
    impressum: {
      title: 'Impressum',
      body: `
        <p><strong>Informationspflicht laut §5 E-Commerce Gesetz, §14 Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz.</strong></p>
        <p>
          Organisationskomitee Region Tullnerfeld Cup<br>
          Musterstraße 1<br>
          3430 Tulln an der Donau<br>
          Österreich
        </p>
        <p><strong>ZVR-Zahl:</strong> 123456789 (Bitte eintragen)</p>
        <p><strong>E-Mail:</strong> info@dein-verein.at (Bitte eintragen)</p>
        <p><strong>Vereinszweck:</strong> Förderung des Fußballsports in der Region Tullnerfeld.</p>
        <p><em>Verantwortlich für den Inhalt:</em> Der Vereinsvorstand.</p>
      `,
    },
  };

  const openDialog = useCallback((type) => {
    if (dialogRef.current && dialogContents[type]) {
      dialogContentRef.current = dialogContents[type];
      // Force re-render by setting state... but we use ref, so let's use a workaround
      dialogRef.current.querySelector('.dialog-title').innerHTML = dialogContents[type].title;
      dialogRef.current.querySelector('.dialog-body').innerHTML = dialogContents[type].body;
      dialogRef.current.showModal();
    }
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Missing steps text
  const getMissingSteps = () => {
    const missing = [];
    const missingGroups = Object.entries(tipp.state.groupWinners)
      .filter(([, v]) => v === null)
      .map(([k]) => k);
    if (missingGroups.length > 0) {
      missing.push(`Gruppe${missingGroups.length > 1 ? 'n' : ''} ${missingGroups.join(', ')}: Aufsteiger wählen`);
    }
    if (tipp.allGroupsComplete && !tipp.allSemisComplete) {
      if (!tipp.semiWinners[1]) missing.push('Halbfinale 1: Ergebnis tippen');
      if (!tipp.semiWinners[2]) missing.push('Halbfinale 2: Ergebnis tippen');
    }
    if (tipp.allSemisComplete && !tipp.champion) {
      missing.push('Finale: Ergebnis tippen');
    }
    return missing.length > 0 ? `Noch offen: ${missing.join(' · ')}` : null;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header" id="header">
        <div className="app__header-logo">
          {/* LOGO AUSTAUSCHEN: RTC Tippspiel Logo */}
          <img src={RTC_LOGO} alt="Region Tullnerfeld Cup Tippspiel" />
        </div>
        <h1 className="app__title">Tippspiel</h1>
        <p className="app__subtitle">Region Tullnerfeld Cup</p>
      </header>

      {/* Intro */}
      <section className="app__intro" id="intro">
        <div className="app__intro-card">
          <h2 className="app__intro-heading">Wer holt den Cup? ⚽</h2>
          <p className="app__intro-text">
            12 Vereine, 4 Gruppen, ein Sieger – und du sagst vorher, wer's wird! 
            Wähle in jeder Gruppe deinen Favoriten, tippe die Halbfinal- und 
            Finalergebnisse und teile deinen Tipp auf Instagram.
          </p>
          <div className="app__intro-steps">
            <div className="app__intro-step">
              <span className="app__intro-step-num">1</span>
              <span>Gruppensieger wählen</span>
            </div>
            <div className="app__intro-step">
              <span className="app__intro-step-num">2</span>
              <span>Ergebnisse tippen</span>
            </div>
            <div className="app__intro-step">
              <span className="app__intro-step-num">3</span>
              <span>Tipp teilen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schritt 1: Gruppenphase */}
      <section className="app__section" id="groups-section">
        <h2 className="app__section-title">
          <span className="app__section-step">Schritt 1</span>
          Wähle die Gruppensieger
        </h2>
        <p className="app__section-desc">Klicke in jeder Gruppe auf das Team, das du als Aufsteiger siehst.</p>
        
        <div className="app__groups-grid">
          {Object.entries(GROUPS).map(([key, group]) => (
            <GroupCard
              key={key}
              group={group}
              selectedTeamId={tipp.state.groupWinners[key]}
              onSelectTeam={tipp.setGroupWinner}
            />
          ))}
        </div>

        {tipp.allGroupsComplete && (
          <div className="app__section-complete">
            ✅ Alle Gruppensieger gewählt! Weiter zum Halbfinale.
          </div>
        )}
      </section>

      {/* Schritt 2: Halbfinale */}
      <section className={`app__section ${!tipp.allGroupsComplete ? 'app__section--locked' : ''}`} id="semis-section">
        <h2 className="app__section-title">
          <span className="app__section-step">Schritt 2</span>
          Halbfinale
        </h2>
        <p className="app__section-desc">Tippe das exakte Ergebnis. Bei Unentschieden wählst du den Elfmeter-Sieger.</p>

        <div className="app__matches-grid">
          {SEMI_FINAL_SCHEMA.map(sf => (
            <MatchCard
              key={sf.id}
              label={sf.label}
              teamA={tipp.semiFinalists[sf.id]?.teamA}
              teamB={tipp.semiFinalists[sf.id]?.teamB}
              scoreA={tipp.state.semiFinals[sf.id].scoreA}
              scoreB={tipp.state.semiFinals[sf.id].scoreB}
              penaltyWinner={tipp.state.semiFinals[sf.id].penaltyWinner}
              onScoreChangeA={(v) => tipp.setSemiScore(sf.id, 'A', v)}
              onScoreChangeB={(v) => tipp.setSemiScore(sf.id, 'B', v)}
              onPenaltySelect={(teamId) => tipp.setSemiPenaltyWinner(sf.id, teamId)}
              disabled={!tipp.allGroupsComplete}
            />
          ))}
        </div>

        {tipp.allSemisComplete && (
          <div className="app__section-complete">
            ✅ Halbfinals getippt! Jetzt das Finale.
          </div>
        )}
      </section>

      {/* Schritt 3: Finale */}
      <section className={`app__section ${!tipp.allSemisComplete ? 'app__section--locked' : ''}`} id="final-section">
        <h2 className="app__section-title">
          <span className="app__section-step">Schritt 3</span>
          Das Finale 🏆
        </h2>
        <p className="app__section-desc">Wer holt den Cup? Tippe das Endergebnis!</p>

        <div className="app__matches-grid">
          <MatchCard
            label="Finale"
            teamA={tipp.finalists.teamA}
            teamB={tipp.finalists.teamB}
            scoreA={tipp.state.final.scoreA}
            scoreB={tipp.state.final.scoreB}
            penaltyWinner={tipp.state.final.penaltyWinner}
            onScoreChangeA={(v) => tipp.setFinalScore('A', v)}
            onScoreChangeB={(v) => tipp.setFinalScore('B', v)}
            onPenaltySelect={tipp.setFinalPenaltyWinner}
            disabled={!tipp.allSemisComplete}
          />
        </div>

        {tipp.champion && (
          <div className="app__section-complete app__section-complete--champion">
            🏆 Dein Tipp-Sieger: <strong>{tipp.champion.name}</strong>
          </div>
        )}
      </section>

      {/* Schritt 4: Share */}
      <section className="app__section" id="share-step-section">
        <h2 className="app__section-title">
          <span className="app__section-step">Schritt 4</span>
          Teile deinen Tipp!
        </h2>
        
        <ShareButton
          isComplete={tipp.isComplete}
          shareImageRef={shareImageRef}
          missingSteps={getMissingSteps()}
        />
      </section>

      {/* Hidden Share Image Template */}
      <ShareImage
        shareRef={shareImageRef}
        groupWinners={tipp.state.groupWinners}
        semiFinals={tipp.state.semiFinals}
        semiFinalists={tipp.semiFinalists}
        semiWinners={tipp.semiWinners}
        finalists={tipp.finalists}
        finalScore={tipp.state.final}
        champion={tipp.champion}
      />

      {/* Reset Button */}
      {tipp.isComplete && (
        <div className="app__reset">
          <button className="app__reset-btn" onClick={tipp.resetAll} id="reset-button">
            🔄 Neuen Tipp abgeben
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenDialog={openDialog} />

      {/* Dialog für Impressum/Datenschutz/Teilnahmebedingungen */}
      <dialog ref={dialogRef} id="legal-dialog">
        <h2 className="dialog-title">Titel</h2>
        <p className="dialog-body">Inhalt</p>
        <button className="dialog-close" onClick={closeDialog}>Schließen</button>
      </dialog>
    </div>
  );
}
