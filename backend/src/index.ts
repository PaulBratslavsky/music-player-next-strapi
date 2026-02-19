import type { Core } from '@strapi/strapi';
import path from 'path';
import fs from 'fs';
import { computePeaksFromBuffer } from './api/song/utils/peaks';
import { generateMissingPeaks } from './api/song/utils/generate-missing-peaks';


export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Document service middleware: generate peaks after song create/update
    strapi.documents.use(async (context, next) => {
      const result = await next();

      if (context.uid !== 'api::song.song') return result;
      if (!['create', 'update'].includes(context.action)) return result;

      // result could be a number (count), array, etc. — narrow to object with documentId
      if (!result || typeof result !== 'object' || Array.isArray(result)) return result;
      const doc = result as Record<string, any>;
      if (!doc.documentId) return result;

      // Check if peaks already exist
      if (doc.peaks && Array.isArray(doc.peaks) && doc.peaks.length > 0) {
        return result;
      }

      // Fetch the entry with audio populated
      const entry = await strapi.documents('api::song.song').findOne({
        documentId: doc.documentId,
        populate: { audio: true },
      });

      if (!entry?.audio?.url) return result;

      const uploadsDir = path.join(strapi.dirs.static.public, 'uploads');
      const fileName = path.basename(entry.audio.url);
      const filePath = path.join(uploadsDir, fileName);

      if (!fs.existsSync(filePath)) return result;

      try {
        const buffer = fs.readFileSync(filePath);
        const peaks = await computePeaksFromBuffer(buffer);

        await strapi.db.query('api::song.song').updateMany({
          where: { documentId: doc.documentId },
          data: { peaks },
        });

        strapi.log.info(`[peaks] Generated peaks for "${entry.title}"`);
      } catch (err) {
        strapi.log.error(`[peaks] Failed to generate peaks: ${err}`);
      }

      return result;
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Generate peaks for any existing songs that are missing them
    await generateMissingPeaks();

    // Only seed if no artists exist yet
    const artistCount = await strapi.documents('api::artist.artist').count({});
    if (artistCount > 0) return;

    console.log('🌱 Seeding database with sample data...');

    // Create artists
    const artist1 = await strapi.documents('api::artist.artist').create({
      data: {
        name: 'Neon Pulse',
        bio: 'Electronic music producer blending synthwave with modern beats.',
      },
      status: 'published',
    });

    const artist2 = await strapi.documents('api::artist.artist').create({
      data: {
        name: 'Echo Valley',
        bio: 'Indie rock band known for atmospheric soundscapes and dreamy vocals.',
      },
      status: 'published',
    });

    const artist3 = await strapi.documents('api::artist.artist').create({
      data: {
        name: 'Luna Wave',
        bio: 'Lo-fi hip hop artist creating chill beats for studying and relaxing.',
      },
      status: 'published',
    });

    // Create songs linked to artists
    const songs = [
      { title: 'Midnight Drive', artist: artist1.documentId },
      { title: 'Digital Sunrise', artist: artist1.documentId },
      { title: 'Mountain Echo', artist: artist2.documentId },
      { title: 'Fading Light', artist: artist2.documentId },
      { title: 'Rainy Afternoon', artist: artist3.documentId },
      { title: 'Moonlit Study', artist: artist3.documentId },
    ];

    for (const song of songs) {
      await strapi.documents('api::song.song').create({
        data: {
          title: song.title,
          artist: song.artist,
        },
        status: 'published',
      });
    }

    // Create home page single type
    const homePageCount = await strapi.documents('api::home-page.home-page').count({});
    if (homePageCount === 0) {
      await strapi.documents('api::home-page.home-page').create({
        data: {
          title: 'Music Buddy',
          description: 'Discover, share, and listen to your favorite music.',
          hero: {
            heading: 'Welcome to Music Buddy',
            text: 'Your personal music discovery platform',
          },
        },
        status: 'published',
      });
    }

    // Enable public API access
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const permissions = [
        { action: 'api::artist.artist.find' },
        { action: 'api::artist.artist.findOne' },
        { action: 'api::song.song.find' },
        { action: 'api::song.song.findOne' },
        { action: 'api::home-page.home-page.find' },
      ];

      for (const perm of permissions) {
        const existing = await strapi.query('plugin::users-permissions.permission').findOne({
          where: { action: perm.action, role: publicRole.id },
        });

        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: perm.action,
              role: publicRole.id,
            },
          });
        }
      }

      console.log('✅ Public API permissions enabled for artist, song, and home-page');
    }

    console.log('✅ Seed complete: 3 artists, 6 songs, 1 home page');
  },
};
