import React from 'react';
import { GROUPS, findTeamById, RTC_LOGO, SPONSOR_LOGO } from '../data/teams';
import './ShareImage.css';

/**
 * ShareImage – Verstecktes DOM-Element in voller 1080×1920-Größe
 * 
 * Wird von html2canvas erfasst, um die Instagram-Story-Grafik zu generieren.
 * Das Element wird via CSS herunterskaliert dargestellt, aber in voller Größe gerendert.
 * 
 * Layout (nach Mockup):
 * - "Dein Tipp:" Überschrift
 * - RTC Tippspiel Logo
 * - 4 Gruppen (A/B/C/D) mit je 3 Teams, Aufsteiger orange
 * - 2 Halbfinal-Ergebnisse
 * - Finale-Ergebnis
 * - "presented by" + Sponsor-Logo
 */

export default function ShareImage({
  shareRef,
  groupWinners,
  semiFinals,
  semiFinalists,
  semiWinners,
  finalists,
  finalScore,
  champion,
}) {
  const isDraw = (match) => match.scoreA === match.scoreB;

  return (
    <div className="share-image-wrapper">
      <div className="share-image" ref={shareRef}>
        {/* Überschrift */}
        <h1 className="share-image__title">MEIN TIPP</h1>

        {/* RTC Logo */}
        <div className="share-image__logo-header">
          <div className="share-image__rtc-logo">
            {/* LOGO AUSTAUSCHEN: RTC Tippspiel Logo */}
            <img src={RTC_LOGO} alt="Region Tullnerfeld Cup Tippspiel" />
          </div>
        </div>

        {/* Gruppen */}
        <div className="share-image__groups">
          {/* Gruppen-Buchstaben */}
          <div className="share-image__group-letters">
            {Object.keys(GROUPS).map(key => (
              <span key={key} className="share-image__group-letter">{key}</span>
            ))}
          </div>

          {/* Gruppen-Teams */}
          <div className="share-image__group-columns">
            {Object.entries(GROUPS).map(([key, group]) => (
              <div key={key} className="share-image__group-col">
                {group.teams.map(team => {
                  const isWinner = groupWinners[key] === team.id;
                  return (
                    <div
                      key={team.id}
                      className={`share-image__team-cell ${isWinner ? 'share-image__team-cell--winner' : ''}`}
                    >
                      <div className="share-image__team-logo">
                        <img src={team.logo} alt={team.name} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Halbfinale */}
        <div className="share-image__semis">
          {[1, 2].map(semiId => {
            const semi = semiFinals[semiId];
            const teamA = semiFinalists[semiId]?.teamA;
            const teamB = semiFinalists[semiId]?.teamB;
            const winner = semiWinners[semiId];
            const draw = isDraw(semi);

            if (!teamA || !teamB) return null;

            return (
              <div key={semiId} className="share-image__match">
                <div className={`share-image__match-team ${draw && winner?.id === teamA.id ? 'share-image__match-team--penalty-winner' : ''}`}>
                  <div className="share-image__match-logo">
                    <img src={teamA.logo} alt={teamA.name} />
                  </div>
                </div>
                <span className="share-image__match-score">
                  {semi.scoreA}:{semi.scoreB}
                </span>
                <div className={`share-image__match-team ${draw && winner?.id === teamB.id ? 'share-image__match-team--penalty-winner' : ''}`}>
                  <div className="share-image__match-logo">
                    <img src={teamB.logo} alt={teamB.name} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verbindungslinien (dekorativ) */}
        <div className="share-image__connector" />

        {/* Finale */}
        {finalists.teamA && finalists.teamB && (
          <div className="share-image__finale">
            <div className={`share-image__finale-team ${isDraw(finalScore) && champion?.id === finalists.teamA.id ? 'share-image__finale-team--penalty-winner' : ''}`}>
              <div className="share-image__finale-logo">
                <img src={finalists.teamA.logo} alt={finalists.teamA.name} />
              </div>
            </div>
            <span className="share-image__finale-score">
              {finalScore.scoreA}:{finalScore.scoreB}
            </span>
            <div className={`share-image__finale-team ${isDraw(finalScore) && champion?.id === finalists.teamB.id ? 'share-image__finale-team--penalty-winner' : ''}`}>
              <div className="share-image__finale-logo">
                <img src={finalists.teamB.logo} alt={finalists.teamB.name} />
              </div>
            </div>
          </div>
        )}

        {/* Sieger */}
        {champion && (
          <div className="share-image__champion">
            <h2 className="share-image__champion-title">SIEGER</h2>
            <div className="share-image__champion-logo">
              <img src={champion.logo} alt={champion.name} />
            </div>
          </div>
        )}

        {/* Sponsor */}
        <div className="share-image__sponsor">
          <span className="share-image__sponsor-label">presented by</span>
          <div className="share-image__sponsor-logo">
            {/* LOGO AUSTAUSCHEN: Hialsorb Cold Sponsor-Logo */}
            <img src={SPONSOR_LOGO} alt="Hialsorb Cold" />
          </div>
        </div>
      </div>
    </div>
  );
}
