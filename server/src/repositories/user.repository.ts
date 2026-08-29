import { prisma } from '../config/prisma';

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findByPhone: (phone: string) => prisma.user.findUnique({ where: { phone } }),

  setPhone: (id: string, phone: string | null) =>
    prisma.user.update({ where: { id }, data: { phone, phoneVerified: false } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  create: (data: { email: string; name: string; passwordHash: string; avatarColor: string }) =>
    prisma.user.create({ data }),

  updateStreak: (id: string, currentStreak: number, longestStreak: number, lastActiveDay: Date) =>
    prisma.user.update({
      where: { id },
      data: { currentStreak, longestStreak, lastActiveDay },
    }),

  updateProfile: (id: string, data: { name?: string; avatarColor?: string }) =>
    prisma.user.update({ where: { id }, data }),

  /** Cascades to every related row — see onDelete: Cascade in schema.prisma. */
  deleteById: (id: string) => prisma.user.delete({ where: { id } }),

  saveRefreshToken: (userId: string, token: string, expiresAt: Date) =>
    prisma.refreshToken.create({ data: { userId, token, expiresAt } }),

  findRefreshToken: (token: string) =>
    prisma.refreshToken.findUnique({ where: { token }, include: { user: true } }),

  revokeRefreshToken: (token: string) =>
    prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } }),

  revokeAllForUser: (userId: string) =>
    prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true } }),
};
