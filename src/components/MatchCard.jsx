import React from 'react';
import ScoreControl from './ScoreControl';
import PenaltyPicker from './PenaltyPicker';
import './MatchCard.css';

export default function MatchCard({
  label,
  teamA,
  teamB,
  scoreA,
  scoreB,
  penaltyWinner,
  onScoreChangeA,
  onScoreChangeB,
  onPenaltySelect,
  disabled = false,
}) {
  const isDraw = scoreA === scoreB;
  const needsPenalty = isDraw && teamA && teamB;

  return (
    <div className={`match-card ${disabled ? 'match-card--disabled' : ''}`} id={`match-${label?.replace(/\s/g, '-')?.toLowerCase()}`}>
      <h3 className="match-card__label">{label}</h3>
      
      {(!teamA || !teamB) ? (
        <div className="match-card__placeholder">
          <p>Warte auf die vorherigen Tipps&hellip;</p>
        </div>
      ) : (
        <>
          <div className="match-card__body">
            {/* Team A */}
            <div className="match-card__team">
              <div className="logo-container">
                <img src={teamA.logo} alt={teamA.name} />
              </div>
              <span className="match-card__team-name">{teamA.shortName}</span>
            </div>

            {/* Scores */}
            <div className="match-card__scores">
              <ScoreControl
                value={scoreA}
                onChange={onScoreChangeA}
                disabled={disabled}
                label={`Tore ${teamA.shortName}`}
              />
              <span className="match-card__colon">:</span>
              <ScoreControl
                value={scoreB}
                onChange={onScoreChangeB}
                disabled={disabled}
                label={`Tore ${teamB.shortName}`}
              />
            </div>

            {/* Team B */}
            <div className="match-card__team">
              <div className="logo-container">
                <img src={teamB.logo} alt={teamB.name} />
              </div>
              <span className="match-card__team-name">{teamB.shortName}</span>
            </div>
          </div>

          {/* Penalty picker on draw */}
          {needsPenalty && (
            <PenaltyPicker
              teamA={teamA}
              teamB={teamB}
              selectedTeamId={penaltyWinner}
              onSelect={onPenaltySelect}
            />
          )}
        </>
      )}
    </div>
  );
}
