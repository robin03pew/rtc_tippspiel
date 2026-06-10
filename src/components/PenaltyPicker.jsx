import React from 'react';
import './PenaltyPicker.css';

export default function PenaltyPicker({ teamA, teamB, selectedTeamId, onSelect }) {
  if (!teamA || !teamB) return null;

  return (
    <div className="penalty-picker" role="group" aria-label="Elfmeterschießen-Auswahl">
      <p className="penalty-picker__label">⚽ Wer gewinnt das Elfmeterschießen?</p>
      <div className="penalty-picker__options">
        <button
          className={`penalty-picker__btn ${selectedTeamId === teamA.id ? 'penalty-picker__btn--selected' : ''}`}
          onClick={() => onSelect(teamA.id)}
          aria-pressed={selectedTeamId === teamA.id}
          type="button"
          id={`penalty-${teamA.id}`}
        >
          <div className="logo-container logo-container--sm">
            <img src={teamA.logo} alt={teamA.name} />
          </div>
          <span>{teamA.shortName}</span>
        </button>
        <button
          className={`penalty-picker__btn ${selectedTeamId === teamB.id ? 'penalty-picker__btn--selected' : ''}`}
          onClick={() => onSelect(teamB.id)}
          aria-pressed={selectedTeamId === teamB.id}
          type="button"
          id={`penalty-${teamB.id}`}
        >
          <div className="logo-container logo-container--sm">
            <img src={teamB.logo} alt={teamB.name} />
          </div>
          <span>{teamB.shortName}</span>
        </button>
      </div>
    </div>
  );
}
