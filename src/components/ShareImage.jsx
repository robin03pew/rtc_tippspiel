import React from 'react';
import { GROUPS, findTeamById, RTC_LOGO, SPONSOR_LOGO, CROWN_ICON } from '../data/teams';
import './ShareImage.css';

/**
 * ShareImage – Verstecktes DOM-Element in voller 1080×1920-Größe
 * 
 * Wird von html2canvas erfasst, um die Instagram-Story-Grafik zu generieren.
 * Das Element wird via CSS herunterskaliert dargestellt, aber in voller Größe gerendert.
 * 
 * Layout (nach Mockup – hialsorb_story):
 * - Fixed absolute positioning with 200px safe zones top and bottom
 * - Single full-screen SVG overlay for thick, clean bracket lines
 * - Unified white header container
 * - Group stage vertical pills
 * - Semifinals & Final
 * - Horizontal Sponsor footer with presented by + logo
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

  // Determine which finalist is the champion (for crown placement)
  const championSide = champion
    ? champion.id === finalists.teamA?.id
      ? 'A'
      : champion.id === finalists.teamB?.id
        ? 'B'
        : null
    : null;

  return (
    <div className="share-image-wrapper">
      <div className="share-image" ref={shareRef}>
        
        {/* ===== BRACKET CONNECTOR LINES (Full Screen Overlay) ===== */}
        <svg className="si-bracket-overlay" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
          {/* Groups A & B to Semi 1 */}
          <path d="M 180 960 L 180 1005 L 420 1005 L 420 960 M 300 1005 L 300 1050" />
          {/* Groups C & D to Semi 2 */}
          <path d="M 660 960 L 660 1005 L 900 1005 L 900 960 M 780 1005 L 780 1050" />
          {/* Semis to Final */}
          <path d="M 300 1180 L 300 1230 L 780 1230 L 780 1180 M 540 1230 L 540 1280" />
        </svg>

        {/* ===== CONTENT LAYERS ===== */}
        <div className="si-content">

          {/* HEADER: Y=200 */}
          <div className="si-header-wrap">
            <div className="si-header__logo">
              <img src={RTC_LOGO} alt="Region Tullnerfeld Cup Tippspiel" />
            </div>
            <h1 className="si-header__title">MEIN TIPP</h1>
          </div>

          {/* GROUPS: Y=460 */}
          <div className="si-groups-wrap">
            {Object.entries(GROUPS).map(([key, group]) => (
              <div key={key} className="si-groups__col">
                <div className="si-groups__letter">{key}</div>
                <div className="si-groups__pill">
                  {group.teams.map((team) => {
                    const isWinner = groupWinners[key] === team.id;
                    return (
                      <div
                        key={team.id}
                        className={`si-groups__team-slot ${isWinner ? 'si-groups__team-slot--winner' : ''}`}
                      >
                        <div className="si-groups__team-logo">
                          <img src={team.logo} alt={team.name} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* SEMIFINALS: Y=1050 */}
          <div className="si-semis-wrap">
            {[1, 2].map(semiId => {
              const semi = semiFinals[semiId];
              const teamA = semiFinalists[semiId]?.teamA;
              const teamB = semiFinalists[semiId]?.teamB;
              const winner = semiWinners[semiId];
              const draw = isDraw(semi);

              if (!teamA || !teamB) return null;

              return (
                <div key={semiId} className="si-semis__match">
                  <div className={`si-semis__team ${draw && winner?.id === teamA.id ? 'si-semis__team--penalty' : ''}`}>
                    <div className="si-semis__logo">
                      <img src={teamA.logo} alt={teamA.name} />
                    </div>
                  </div>
                  <span className="si-semis__score">
                    {semi.scoreA}:{semi.scoreB}
                  </span>
                  <div className={`si-semis__team ${draw && winner?.id === teamB.id ? 'si-semis__team--penalty' : ''}`}>
                    <div className="si-semis__logo">
                      <img src={teamB.logo} alt={teamB.name} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FINAL: Y=1280 */}
          {finalists.teamA && finalists.teamB && (
            <div className="si-final-wrap">
              <div className={`si-final__team ${isDraw(finalScore) && champion?.id === finalists.teamA.id ? 'si-final__team--penalty' : ''}`}>
                {championSide === 'A' && (
                  <img src={CROWN_ICON} alt="Crown" className="si-final__crown" />
                )}
                <div className="si-final__logo">
                  <img src={finalists.teamA.logo} alt={finalists.teamA.name} />
                </div>
              </div>
              
              <span className="si-final__score">
                {finalScore.scoreA}:{finalScore.scoreB}
              </span>
              
              <div className={`si-final__team ${isDraw(finalScore) && champion?.id === finalists.teamB.id ? 'si-final__team--penalty' : ''}`}>
                {championSide === 'B' && (
                  <img src={CROWN_ICON} alt="Crown" className="si-final__crown" />
                )}
                <div className="si-final__logo">
                  <img src={finalists.teamB.logo} alt={finalists.teamB.name} />
                </div>
              </div>
            </div>
          )}

          {/* FOOTER: Y=1560 */}
          <div className="si-footer-wrap">
            <span className="si-footer__label">presented by</span>
            <div className="si-footer__sponsor-logo">
              <img src={SPONSOR_LOGO} alt="Hialsorb Cold" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
