/** @format */

import { ITheme } from 'dddice-js';

/** Standard polyhedral set used for guest auto-pick and UI completeness checks. */
export const FULL_POLYHEDRAL_TYPES = ['d4', 'd6', 'd8', 'd10', 'd10x', 'd20'] as const;

export function getThemeDieTypes(theme: ITheme | undefined | null): Set<string> {
  if (!theme?.available_dice?.length) {
    return new Set();
  }
  return new Set(
    theme.available_dice.map((die: { type?: string } | string) =>
      typeof die === 'string' ? die : (die.type ?? String(die)),
    ),
  );
}

export function isFullPolyhedralTheme(theme: ITheme | undefined | null): boolean {
  const available = getThemeDieTypes(theme);
  return FULL_POLYHEDRAL_TYPES.every(type => available.has(type));
}

export function getMissingDieTypesForRoll(
  theme: ITheme | undefined | null,
  dice: Array<{ type?: string }> | undefined | null,
): string[] {
  // Stale/partial theme caches may omit available_dice; defer to the API in that case.
  if (!theme?.available_dice?.length) {
    return [];
  }
  const available = getThemeDieTypes(theme);
  const requested = new Set(
    (dice ?? [])
      .map(die => die.type)
      .filter((type): type is string => Boolean(type) && type !== 'mod'),
  );
  return [...requested].filter(type => !available.has(type)).sort();
}

export function formatMissingDieTypesError(
  theme: ITheme | undefined | null,
  missingTypes: string[],
): string {
  const themeName = theme?.name ? `"${theme.name}"` : 'the selected theme';
  const missing = missingTypes.join(', ');
  return `${missing} not available in ${themeName}. Switch to a theme that includes ${missing} in dddice settings.`;
}
