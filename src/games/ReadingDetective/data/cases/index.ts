import { Case, Clue } from '../types';
import { emptyVault } from './empty-vault';
import { lostBackpack } from './lost-backpack';
import { missingChild } from './missing-child';

export const CASES: Case[] = [emptyVault, missingChild, lostBackpack];

export function getCase(caseId?: string): Case {
  return CASES.find((item) => item.id === caseId) ?? CASES[0];
}

export function findScene(caseData: Case, sceneId: string) {
  return caseData.scenes.find((scene) => scene.id === sceneId);
}

export function findClue(caseData: Case, clueId: string): Clue | undefined {
  for (const scene of caseData.scenes) {
    const clue = scene.clues.find((item) => item.id === clueId);
    if (clue) return clue;
  }
  return undefined;
}

export function firstScene(caseData: Case) {
  return caseData.scenes.find((scene) => !scene.optional) ?? caseData.scenes[0];
}

export function findingsFor(caseData: Case, solvedIds: Iterable<string>) {
  const solved = new Set(solvedIds);
  return caseData.scenes.flatMap((scene) =>
    scene.clues
      .filter((clue) => solved.has(clue.id))
      .map((clue) => ({ scene, clue })),
  );
}
