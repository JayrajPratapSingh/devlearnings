import type { BookmarkKind } from '@prisma/client';
import { prisma } from '../config/prisma';

export const bookmarkService = {
  list: (userId: string, kind?: BookmarkKind) =>
    prisma.bookmark.findMany({
      where: { userId, ...(kind ? { kind } : {}) },
      orderBy: { createdAt: 'desc' },
    }),

  /** Bookmarking is a toggle — calling it twice removes the bookmark. */
  async toggle(
    userId: string,
    input: { kind: BookmarkKind; refId: string; label: string; href: string },
  ) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_kind_refId: { userId, kind: input.kind, refId: input.refId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }

    await prisma.bookmark.create({ data: { userId, ...input } });
    return { bookmarked: true };
  },

  async isBookmarked(userId: string, kind: BookmarkKind, refId: string) {
    const found = await prisma.bookmark.findUnique({
      where: { userId_kind_refId: { userId, kind, refId } },
    });
    return { bookmarked: Boolean(found) };
  },
};
