import { dsaCore } from './dsa-core';
import { dsaAdvanced } from './dsa-advanced';
import { dsaExtraArrays } from './dsa-extra-arrays';
import { dsaExtraStrings } from './dsa-extra-strings';
import { dsaExtraHashMap } from './dsa-extra-hashmap';
import { dsaExtraTwoPointer } from './dsa-extra-two-pointer';
import { dsaExtraSlidingWindow } from './dsa-extra-sliding-window';
import { dsaExtraStack } from './dsa-extra-stack';
import { dsaExtraQueue } from './dsa-extra-queue';
import type { SeedProblem } from './shared';

/** All seeded DSA problems, in the order they appear in the sidebar. */
export const dsaProblems: SeedProblem[] = [
  ...dsaCore,
  ...dsaAdvanced,
  ...dsaExtraArrays,
  ...dsaExtraStrings,
  ...dsaExtraHashMap,
  ...dsaExtraTwoPointer,
  ...dsaExtraSlidingWindow,
  ...dsaExtraStack,
  ...dsaExtraQueue,
];

/** Categories in the order the DSA page lists them. */
export const DSA_CATEGORIES = [
  'Arrays',
  'Strings',
  'HashMap',
  'Two Pointer',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Binary Search',
  'Sorting',
  'Recursion',
  'Backtracking',
  'Trees',
  'BST',
  'Heap',
  'Graph',
  'Dynamic Programming',
] as const;

export type { SeedProblem };
