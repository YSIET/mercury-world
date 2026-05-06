/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Legacy PHP info pages
      { source: '/site/:slug.php', destination: '/site/:slug', permanent: true },
      { source: '/mercury/:slug.php', destination: '/mercury/:slug', permanent: true },
      { source: '/content/:slug.php', destination: '/content/:slug', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
    ];
  },
  async rewrites() {
    return {
      // Legacy GNUBOARD-style board URLs: /bbs/board.php?bo_table=notice -> /bbs/notice
      // We can't redirect with querystrings in Next config, so handle in middleware-style rewrite.
      beforeFiles: [
        {
          source: '/bbs/board.php',
          has: [{ type: 'query', key: 'bo_table', value: '(?<board>[^&]+)' }],
          destination: '/bbs/:board',
        },
        {
          source: '/bbs/board.php',
          has: [
            { type: 'query', key: 'bo_table', value: '(?<board>[^&]+)' },
            { type: 'query', key: 'wr_id', value: '(?<id>\\d+)' },
          ],
          destination: '/bbs/:board/:id',
        },
        {
          source: '/bbs/write.php',
          has: [{ type: 'query', key: 'bo_table', value: '(?<board>[^&]+)' }],
          destination: '/bbs/:board/write',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
