interface RankableSection {
  professor: {
    rmpRating: number | null;
    rmpDifficulty: number | null;
    wouldTakeAgain: number | null;
  } | null;
}

export function computeRankScore(section: RankableSection): number {
  const p = section.professor;
  const rating = p?.rmpRating ?? 3;
  const wta = p?.wouldTakeAgain ?? 70;
  const difficulty = p?.rmpDifficulty ?? 3;
  return rating * 0.6 + (wta / 100) * 5 * 0.3 - (difficulty / 5) * 0.1;
}

export function rankSections<T extends RankableSection>(sections: T[]): T[] {
  return [...sections].sort(
    (a, b) => computeRankScore(b) - computeRankScore(a)
  );
}
