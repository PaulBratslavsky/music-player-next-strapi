export default {
  routes: [
    {
      method: 'GET',
      path: '/songs/:id/stream',
      handler: 'custom-song.stream',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/songs/generate-peaks',
      handler: 'custom-song.generatePeaks',
      config: {
        auth: false,
      },
    },
  ],
};
