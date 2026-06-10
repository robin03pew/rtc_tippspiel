/**
 * Turnier-Daten: Region Tullnerfeld Cup
 * 
 * 4 Gruppen à 3 Teams.
 * Halbfinal-Schema: Aufsteiger A vs. Aufsteiger B, Aufsteiger C vs. Aufsteiger D.
 * 
 * LOGOS AUSTAUSCHEN:
 * Ersetze die `logo`-Werte durch die echten Pfade zu den PNG-Dateien.
 * Lege die Logos in /public/logos/ ab und referenziere sie als '/logos/teamname.png'.
 * Die Logo-Container verwenden object-fit: contain, unterschiedliche Seitenverhältnisse sind kein Problem.
 */

// Platzhalter-Logo für alle Vereine
// → Echte Logos hier als Import oder als Pfad in /public/logos/ ersetzen
const PLACEHOLDER_LOGO = 'https://dummyimage.com/300.png/09f/fff';

const base = import.meta.env.BASE_URL;

export const GROUPS = {
  A: {
    name: 'Gruppe A',
    letter: 'A',
    teams: [
      { id: 'wuermla', name: 'SV Würmla', shortName: 'Würmla', logo: `${base}teams/SV Wuermla.png` },
      { id: 'rust', name: 'SV hb24 Viktoria Rust', shortName: 'Rust', logo: `${base}teams/SV Rust.png` },
      { id: 'langenrohr', name: 'SV Langenrohr', shortName: 'Langenrohr', logo: `${base}teams/SV Langenrohr.png` },
    ],
  },
  B: {
    name: 'Gruppe B',
    letter: 'B',
    teams: [
      { id: 'tulln', name: 'FC Tulln', shortName: 'Tulln', logo: `${base}teams/FC Tulln.png` },
      { id: 'atzenbrugg', name: 'USV Atzenbrugg-Heiligeneich', shortName: 'Atzenbrugg', logo: `${base}teams/USV-Atzenbrugg-Heiligeneich_whitebg.png` },
      { id: 'standrae', name: 'USV St. Andrä Wördern', shortName: 'St. Andrä', logo: `${base}teams/SV_St_Andrae_Woerdern_Logo.png` },
    ],
  },
  C: {
    name: 'Gruppe C',
    letter: 'C',
    teams: [
      { id: 'muckendorf', name: 'USC Muckendorf/Zeiselmauer', shortName: 'Muckendorf', logo: `${base}teams/USC Muckendorf.png` },
      { id: 'sieghartskirchen', name: 'SV Sieghartskirchen', shortName: 'Sieghartsk.', logo: `${base}teams/SV Sieghartskirchen.png` },
      { id: 'zwentendorf', name: 'SV Zwentendorf', shortName: 'Zwentendorf', logo: `${base}teams/SV Zwentendorf.png` },
    ],
  },
  D: {
    name: 'Gruppe D',
    letter: 'D',
    teams: [
      { id: 'langenlebarn', name: 'SV "Donau" Langenlebarn', shortName: 'Langenlebarn', logo: `${base}teams/SV Langenlebarn.png` },
      { id: 'sitzenberg', name: 'SC Sitzenberg-Reidling', shortName: 'Sitzenberg', logo: `${base}teams/SC Sitzenberg Reidling.png` },
      { id: 'tulbing', name: 'SK Lugus Tulbing', shortName: 'Tulbing', logo: `${base}teams/SK Lugus Tulbing.png` },
    ],
  },
};

// Halbfinal-Zuordnung (fix)
export const SEMI_FINAL_SCHEMA = [
  { id: 1, groupA: 'A', groupB: 'B', label: 'Halbfinale 1' },
  { id: 2, groupA: 'C', groupB: 'D', label: 'Halbfinale 2' },
];

/**
 * Hilfsfunktion: Team-Objekt anhand der ID finden
 */
export function findTeamById(teamId) {
  for (const group of Object.values(GROUPS)) {
    const team = group.teams.find(t => t.id === teamId);
    if (team) return team;
  }
  return null;
}

/**
 * Platzhalter-Logo für RTC-Tippspiel-Logo oben
 * → Echtes Logo ersetzen: /public/logos/rtc-tippspiel.png
 */
export const RTC_LOGO = `${base}logos/logo_gr_new.png`;

/**
 * Platzhalter-Logo für Sponsor (Hialsorb Cold)
 * → Echtes Logo ersetzen: /public/logos/hialsorb-cold.png
 */
export const SPONSOR_LOGO = `${base}logos/05_Hialsorb-Boden.png`;
