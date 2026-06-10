import React from 'react';
import './GroupCard.css';

export default function GroupCard({ group, selectedTeamId, onSelectTeam }) {
  return (
    <div className="group-card" id={`group-${group.letter}`}>
      <h3 className="group-card__letter">{group.letter}</h3>
      <div className="group-card__teams">
        {group.teams.map((team) => {
          const isSelected = selectedTeamId === team.id;
          return (
            <button
              key={team.id}
              className={`group-card__team ${isSelected ? 'group-card__team--selected' : ''}`}
              onClick={() => onSelectTeam(group.letter, team.id)}
              aria-pressed={isSelected}
              aria-label={`${team.name} als Aufsteiger wählen`}
              id={`team-${team.id}`}
            >
              <div className="logo-container">
                {/* LOGO AUSTAUSCHEN: src durch echten Pfad ersetzen */}
                <img src={team.logo} alt={`Logo ${team.name}`} loading="lazy" />
              </div>
              <span className="group-card__team-name">{team.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
