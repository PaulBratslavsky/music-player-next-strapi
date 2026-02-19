import path from 'node:path';
import fs from 'node:fs';
import { generateMissingPeaks } from '../utils/generate-missing-peaks';

const MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.webm': 'audio/webm',
};

export default {
  async stream(ctx: any) {
    const { id } = ctx.params;

    const entry = await strapi.documents('api::song.song').findOne({
      documentId: id,
      populate: { audio: true },
    });

    if (!entry?.audio?.url) {
      ctx.status = 404;
      ctx.body = { error: 'Song or audio file not found' };
      return;
    }

    const uploadsDir = path.join(strapi.dirs.static.public, 'uploads');
    const fileName = path.basename(entry.audio.url);
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = { error: 'Audio file not found on disk' };
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const ext = path.extname(fileName).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const range = ctx.request.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = Number.parseInt(parts[0], 10);
      const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      ctx.status = 206;
      ctx.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      ctx.set('Accept-Ranges', 'bytes');
      ctx.set('Content-Length', String(chunkSize));
      ctx.set('Content-Type', contentType);
      ctx.body = fs.createReadStream(filePath, { start, end });
    } else {
      ctx.set('Content-Length', String(fileSize));
      ctx.set('Content-Type', contentType);
      ctx.set('Accept-Ranges', 'bytes');
      ctx.body = fs.createReadStream(filePath);
    }
  },

  async generatePeaks(ctx: any) {
    try {
      const force = ctx.query.force === 'true';
      const result = await generateMissingPeaks(force);
      ctx.body = {
        message: `Peak generation complete`,
        ...result,
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: `Peak generation failed: ${err}` };
    }
  },
};
