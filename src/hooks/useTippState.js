import { useState, useEffect, useCallback, useMemo } from 'react';
import { GROUPS, SEMI_FINAL_SCHEMA, findTeamById } from '../data/teams';

const STORAGE_KEY = 'rtc-tippspiel-state';

const initialState = {
  // Gruppenphase: gewählter Aufsteiger-Team-ID pro Gruppe
  groupWinners: { A: null, B: null, C: null, D: null },

  // Halbfinale: Scores + optionaler Elfmeter-Sieger
  semiFinals: {
    1: { scoreA: 0, scoreB: 0, penaltyWinner: null },
    2: { scoreA: 0, scoreB: 0, penaltyWinner: null },
  },

  // Finale: Score + optionaler Elfmeter-Sieger
  final: { scoreA: 0, scoreB: 0, penaltyWinner: null },
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge mit initialState, um fehlende Felder abzufangen
      return {
        groupWinners: { ...initialState.groupWinners, ...parsed.groupWinners },
        semiFinals: {
          1: { ...initialState.semiFinals[1], ...parsed.semiFinals?.[1] },
          2: { ...initialState.semiFinals[2], ...parsed.semiFinals?.[2] },
        },
        final: { ...initialState.final, ...parsed.final },
      };
    }
  } catch (e) {
    console.warn('Tipp-State konnte nicht geladen werden:', e);
  }
  return initialState;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Tipp-State konnte nicht gespeichert werden:', e);
  }
}

export function useTippState() {
  const [state, setState] = useState(loadState);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // --- Gruppenphase ---
  const setGroupWinner = useCallback((group, teamId) => {
    setState(prev => {
      const newGroupWinners = { ...prev.groupWinners, [group]: teamId };
      
      // Wenn sich ein Gruppensieger ändert, Halbfinal/Finale-Scores zurücksetzen
      // für betroffene Matches
      const newSemiFinals = { ...prev.semiFinals };
      const newFinal = { ...prev.final };
      
      // Prüfen welches Halbfinale betroffen ist
      for (const sf of SEMI_FINAL_SCHEMA) {
        if (sf.groupA === group || sf.groupB === group) {
          newSemiFinals[sf.id] = { scoreA: 0, scoreB: 0, penaltyWinner: null };
        }
      }
      
      // Finale auch zurücksetzen
      return {
        groupWinners: newGroupWinners,
        semiFinals: newSemiFinals,
        final: { scoreA: 0, scoreB: 0, penaltyWinner: null },
      };
    });
  }, []);

  // --- Halbfinale ---
  const setSemiScore = useCallback((semiId, team, value) => {
    setState(prev => {
      const semi = { ...prev.semiFinals[semiId] };
      if (team === 'A') semi.scoreA = value;
      else semi.scoreB = value;
      
      // Wenn kein Unentschieden mehr, Elfmeter-Auswahl löschen
      if (semi.scoreA !== semi.scoreB) {
        semi.penaltyWinner = null;
      }
      
      return {
        ...prev,
        semiFinals: { ...prev.semiFinals, [semiId]: semi },
        // Finale zurücksetzen wenn Halbfinal-Ergebnis sich ändert
        final: { scoreA: 0, scoreB: 0, penaltyWinner: null },
      };
    });
  }, []);

  const setSemiPenaltyWinner = useCallback((semiId, teamId) => {
    setState(prev => ({
      ...prev,
      semiFinals: {
        ...prev.semiFinals,
        [semiId]: { ...prev.semiFinals[semiId], penaltyWinner: teamId },
      },
      // Finale zurücksetzen
      final: { scoreA: 0, scoreB: 0, penaltyWinner: null },
    }));
  }, []);

  // --- Finale ---
  const setFinalScore = useCallback((team, value) => {
    setState(prev => {
      const final = { ...prev.final };
      if (team === 'A') final.scoreA = value;
      else final.scoreB = value;
      
      if (final.scoreA !== final.scoreB) {
        final.penaltyWinner = null;
      }
      
      return { ...prev, final };
    });
  }, []);

  const setFinalPenaltyWinner = useCallback((teamId) => {
    setState(prev => ({
      ...prev,
      final: { ...prev.final, penaltyWinner: teamId },
    }));
  }, []);

  // --- Abgeleitete Werte ---
  
  // Alle 4 Gruppensieger gewählt?
  const allGroupsComplete = useMemo(() => {
    return Object.values(state.groupWinners).every(w => w !== null);
  }, [state.groupWinners]);

  // Halbfinal-Teams
  const semiFinalists = useMemo(() => {
    if (!allGroupsComplete) return { 1: { teamA: null, teamB: null }, 2: { teamA: null, teamB: null } };
    
    return {
      1: {
        teamA: findTeamById(state.groupWinners[SEMI_FINAL_SCHEMA[0].groupA]),
        teamB: findTeamById(state.groupWinners[SEMI_FINAL_SCHEMA[0].groupB]),
      },
      2: {
        teamA: findTeamById(state.groupWinners[SEMI_FINAL_SCHEMA[1].groupA]),
        teamB: findTeamById(state.groupWinners[SEMI_FINAL_SCHEMA[1].groupB]),
      },
    };
  }, [state.groupWinners, allGroupsComplete]);

  // Gewinner jedes Halbfinales
  const getMatchWinner = useCallback((match, teamAObj, teamBObj) => {
    if (!teamAObj || !teamBObj) return null;
    if (match.scoreA > match.scoreB) return teamAObj;
    if (match.scoreB > match.scoreA) return teamBObj;
    // Unentschieden → Elfmeter-Sieger
    if (match.penaltyWinner) return findTeamById(match.penaltyWinner);
    return null;
  }, []);

  const semiWinners = useMemo(() => {
    return {
      1: getMatchWinner(state.semiFinals[1], semiFinalists[1]?.teamA, semiFinalists[1]?.teamB),
      2: getMatchWinner(state.semiFinals[2], semiFinalists[2]?.teamA, semiFinalists[2]?.teamB),
    };
  }, [state.semiFinals, semiFinalists, getMatchWinner]);

  // Beide Halbfinals entschieden?
  const allSemisComplete = useMemo(() => {
    return semiWinners[1] !== null && semiWinners[2] !== null;
  }, [semiWinners]);

  // Finalist-Teams
  const finalists = useMemo(() => {
    if (!allSemisComplete) return { teamA: null, teamB: null };
    return { teamA: semiWinners[1], teamB: semiWinners[2] };
  }, [semiWinners, allSemisComplete]);

  // Turnier-Sieger
  const champion = useMemo(() => {
    if (!finalists.teamA || !finalists.teamB) return null;
    return getMatchWinner(state.final, finalists.teamA, finalists.teamB);
  }, [state.final, finalists, getMatchWinner]);

  // Alles komplett?
  const isComplete = useMemo(() => {
    return allGroupsComplete && allSemisComplete && champion !== null;
  }, [allGroupsComplete, allSemisComplete, champion]);

  // Reset-Funktion
  const resetAll = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    // Actions
    setGroupWinner,
    setSemiScore,
    setSemiPenaltyWinner,
    setFinalScore,
    setFinalPenaltyWinner,
    resetAll,
    // Computed
    allGroupsComplete,
    semiFinalists,
    semiWinners,
    allSemisComplete,
    finalists,
    champion,
    isComplete,
  };
}
