// FILE: frontend/src/game/levels.ts
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Level-based visual styling (hue, saturation, lightness, colors)
//   SCOPE: Computing HSL color values and text colors for game cell levels
//   DEPENDS: none
//   LINKS: M-LEVELS, V-M-LEVELS
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   LevelStyle - Interface for level color components (hue, saturation, lightness, label)
//   getLevelStyle - Returns LevelStyle for a given level number
//   getLevelColor - Returns HSL CSS string for a given level
//   getLevelTextColor - Returns contrasting text color (black or white) for a level
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: 0.1.0 - initial implementation with GRACE markup
// END_CHANGE_SUMMARY

export interface LevelStyle {
  hue: number
  saturation: number
  lightness: number
  label: string
}

const HUE_STEP = 37
const SATURATION_BASE = 60
const LIGHTNESS_BASE = 45

// START_METHOD_getLevelStyle
// START_CONTRACT: getLevelStyle
//   PURPOSE: Compute HSL style for a given level number
//   INPUTS: { level: number }
//   OUTPUTS: LevelStyle { hue, saturation, lightness, label }
//   SIDE_EFFECTS: None
//   LINKS: M-LEVELS
// END_CONTRACT: getLevelStyle
export function getLevelStyle(level: number): LevelStyle {
  const hue = (level * HUE_STEP) % 360
  const saturation = SATURATION_BASE + (level % 3) * 10
  const lightness = LIGHTNESS_BASE + (level % 5) * 5
  return { hue, saturation, lightness, label: '' + level }
}
// END_METHOD_getLevelStyle

// START_METHOD_getLevelColor
// START_CONTRACT: getLevelColor
//   PURPOSE: Get CSS HSL color string for a given level
//   INPUTS: { level: number }
//   OUTPUTS: string - CSS hsl() value
//   SIDE_EFFECTS: None
//   LINKS: M-LEVELS
// END_CONTRACT: getLevelColor
export function getLevelColor(level: number): string {
  const s = getLevelStyle(level)
  return 'hsl(' + s.hue + ', ' + s.saturation + '%, ' + s.lightness + '%)'
}
// END_METHOD_getLevelColor

// START_METHOD_getLevelTextColor
// START_CONTRACT: getLevelTextColor
//   PURPOSE: Get contrasting text color (black or white) based on level lightness
//   INPUTS: { level: number }
//   OUTPUTS: string - hex color #17212b or #ffffff
//   SIDE_EFFECTS: None
//   LINKS: M-LEVELS
// END_CONTRACT: getLevelTextColor
export function getLevelTextColor(level: number): string {
  const s = getLevelStyle(level)
  return s.lightness > 60 ? '#17212b' : '#ffffff'
}
// END_METHOD_getLevelTextColor