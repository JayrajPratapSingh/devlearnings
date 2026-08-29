import type { LearningStatus } from '@prisma/client';
import { topicRepository } from '../repositories/topic.repository';
import { revisionService } from './revision.service';
import { NotFound } from '../utils/errors';

export const topicService = {
  async listCategories(userId: string) {
    const [categories, progress, topics] = await Promise.all([
      topicRepository.listCategories(),
      topicRepository.progressForUser(userId),
      topicRepository.listAll(),
    ]);

    const doneTopicIds = new Set(
      progress.filter((p) => p.status === 'KNOWN').map((p) => p.topicId),
    );

    return categories.map((category) => {
      const inCategory = topics.filter((t) => t.categoryId === category.id);
      const completed = inCategory.filter((t) => doneTopicIds.has(t.id)).length;
      return {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        group: category.group,
        order: category.order,
        totalTopics: inCategory.length,
        completedTopics: completed,
        percent: inCategory.length ? Math.round((completed / inCategory.length) * 100) : 0,
      };
    });
  },

  async listByCategory(userId: string, categorySlug: string) {
    const category = await topicRepository.findCategoryBySlug(categorySlug);
    if (!category) throw NotFound('Category');

    const topics = await topicRepository.listByCategory(categorySlug);
    const progress = await topicRepository.progressForUser(
      userId,
      topics.map((t) => t.id),
    );
    const byTopic = new Map(progress.map((p) => [p.topicId, p]));

    return {
      category: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
      topics: topics.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        summaryHi: t.summaryHi,
        difficulty: t.difficulty,
        hasSimple: Boolean(t.simple),
        order: t.order,
        tags: t.tags,
        status: byTopic.get(t.id)?.status ?? 'NEW',
        confidence: byTopic.get(t.id)?.confidence ?? 0,
      })),
    };
  },

  async getBySlug(userId: string, slug: string) {
    const topic = await topicRepository.findBySlug(slug);
    if (!topic) throw NotFound('Topic');

    await topicRepository.upsertProgress(userId, topic.id, { touchView: true });
    const [progress] = await topicRepository.progressForUser(userId, [topic.id]);

    return {
      ...topic,
      status: progress?.status ?? 'LEARNING',
      confidence: progress?.confidence ?? 0,
    };
  },

  async setStatus(userId: string, slug: string, status: LearningStatus, confidence?: number) {
    const topic = await topicRepository.findBySlug(slug);
    if (!topic) throw NotFound('Topic');

    await topicRepository.upsertProgress(userId, topic.id, {
      status,
      confidence,
      completedAt: status === 'KNOWN' ? new Date() : null,
    });

    // Anything not yet solid is queued into the spaced-revision system.
    if (status === 'NEEDS_REVISION' || (confidence !== undefined && confidence <= 2)) {
      await revisionService.schedule(userId, { topicId: topic.id, reason: 'Low confidence topic' });
    }
    if (status === 'KNOWN') {
      await revisionService.gradeTopic(userId, topic.id, 4);
    }

    return { slug, status, confidence: confidence ?? 0 };
  },

  /**
   * Titles for a known set of slugs.
   *
   * Interview tracks reference topics by slug, and deriving a label from the
   * slug produces things like "vs sql". This resolves the real titles in one
   * round trip rather than shipping a duplicate copy of them to the client,
   * where they would drift the first time a topic is renamed.
   */
  async titlesFor(slugs: string[]) {
    const topics = await topicRepository.findManyBySlugs(slugs);
    return topics.map((t) => ({ slug: t.slug, title: t.title }));
  },
};
