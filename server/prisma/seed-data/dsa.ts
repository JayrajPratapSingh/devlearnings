import { dsaCore } from './dsa-core';
import { dsaAdvanced } from './dsa-advanced';
import { dsaExtraArrays } from './dsa-extra-arrays';
import { dsaExtraStrings } from './dsa-extra-strings';
import { dsaExtraHashMap } from './dsa-extra-hashmap';
import { dsaExtraTwoPointer } from './dsa-extra-two-pointer';
import { dsaExtraSlidingWindow } from './dsa-extra-sliding-window';
import { dsaExtraStack } from './dsa-extra-stack';
import { dsaExtraQueue } from './dsa-extra-queue';
import { dsaExtraLinkedList } from './dsa-extra-linked-list';
import { dsaExtraBinarySearch } from './dsa-extra-binary-search';
import { dsaExtraSorting } from './dsa-extra-sorting';
import { dsaExtraRecursion } from './dsa-extra-recursion';
import { dsaExtraBacktracking } from './dsa-extra-backtracking';
import { dsaExtraTrees } from './dsa-extra-trees';
import { dsaExtraTrees2 } from './dsa-extra-trees2';
import { dsaExtraBst } from './dsa-extra-bst';
import { dsaExtraBst2 } from './dsa-extra-bst2';
import { dsaExtraHeap } from './dsa-extra-heap';
import { dsaExtraHeap2 } from './dsa-extra-heap2';
import { dsaExtraGraph } from './dsa-extra-graph';
import { dsaExtraGraph2 } from './dsa-extra-graph2';
import { dsaExtraDp } from './dsa-extra-dp';
import { dsaExtraDp2 } from './dsa-extra-dp2';
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
  ...dsaExtraLinkedList,
  ...dsaExtraBinarySearch,
  ...dsaExtraSorting,
  ...dsaExtraRecursion,
  ...dsaExtraBacktracking,
  ...dsaExtraTrees,
  ...dsaExtraTrees2,
  ...dsaExtraBst,
  ...dsaExtraBst2,
  ...dsaExtraHeap,
  ...dsaExtraHeap2,
  ...dsaExtraGraph,
  ...dsaExtraGraph2,
  ...dsaExtraDp,
  ...dsaExtraDp2,
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
