import path from 'path';
import fs from 'fs';
import { computePeaksFromBuffer } from './peaks';

interface SongWithAudio {
  documentId: string;
  title?: string;
  peaks?: unknown;
  audio?: {
    url: string;
  } | null;
}

/**
 * Find all songs missing peaks and generate them.
 * Used by both the cron job and the webhook endpoint.
 */
export async function generateMissingPeaks(force = false) {
  const findOptions: any = {
    populate: { audio: true },
    status: 'published',
  };

  if (!force) {
    findOptions.filters = {
      $or: [{ peaks: { $null: true } }, { peaks: { $eq: null } }],
    };
  }

  const songs: SongWithAudio[] = await strapi.documents('api::song.song').findMany(findOptions) as SongWithAudio[];

  let generated = 0;

  for (const song of songs) {
    if (!song.audio?.url) continue;

    const uploadsDir = path.join(strapi.dirs.static.public, 'uploads');
    const fileName = path.basename(song.audio.url);
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      strapi.log.warn(`[peaks] Audio file not found for "${song.title}": ${filePath}`);
      continue;
    }

    try {
      const buffer = fs.readFileSync(filePath);
      const peaks = await computePeaksFromBuffer(buffer);

      await strapi.db.query('api::song.song').updateMany({
        where: { documentId: song.documentId },
        data: { peaks },
      });

      generated++;
      strapi.log.info(`[peaks] Generated peaks for "${song.title}"`);
    } catch (err) {
      strapi.log.error(`[peaks] Failed to generate peaks for "${song.title}": ${err}`);
    }
  }

  return { processed: songs.length, generated };
}
