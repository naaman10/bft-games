import { Case } from './types';
import { findClue } from './cases';

export type AccusationResult =
  | { ok: true }
  | { ok: false; message: string };

export function evaluateAccusation(
  caseData: Case,
  suspectId: string,
  selectedClueIds: string[],
): AccusationResult {
  if (suspectId !== caseData.solution.suspectId) {
    const suspect = caseData.suspects.find((item) => item.id === suspectId);
    return {
      ok: false,
      message:
        suspect?.wrongAccusation ??
        'Those notes do not point to that person. Read them again.',
    };
  }

  const selected = new Set(selectedClueIds);

  for (const clueId of selected) {
    const clue = findClue(caseData, clueId);
    if (clue?.accusationRole === 'clears') {
      return {
        ok: false,
        message: `“${clue.finding}” That note shows where someone else was. It does not show that ${accusationClaim(caseData)}.`,
      };
    }
  }

  for (const clueId of caseData.solution.requiredClueIds) {
    if (selected.has(clueId)) continue;
    const clue = findClue(caseData, clueId);
    return {
      ok: false,
      message: clue
        ? `You still need this note: “${clue.finding}”`
        : 'Some of the notes that show what happened are still missing.',
    };
  }

  return { ok: true };
}

function accusationClaim(caseData: Case): string {
  if (caseData.accusationClaim) return caseData.accusationClaim;
  const name =
    caseData.suspects.find((item) => item.id === caseData.solution.suspectId)?.name ?? 'they';
  return `${name} took ${caseData.stolenItem}`;
}
