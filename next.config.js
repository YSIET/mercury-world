/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 원본 PHP URL을 깔끔한 라우트로 redirect (검색엔진 색인 보존)
  async redirects() {
    return [
      // 메인
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/main.php", destination: "/", permanent: true },

      // 수은세상소개
      { source: "/site/greeting.php", destination: "/site/greeting", permanent: true },

      // 수은백서
      { source: "/mercury/mercury.php", destination: "/mercury/mercury", permanent: true },
      { source: "/mercury/mercury_cycle.php", destination: "/mercury/mercury_cycle", permanent: true },
      { source: "/mercury/fish.php", destination: "/mercury/fish", permanent: true },
      { source: "/mercury/emergency.php", destination: "/mercury/emergency", permanent: true },
      { source: "/mercury/regulation.php", destination: "/mercury/regulation", permanent: true },

      // 수은소식
      { source: "/news/board.php", destination: "/news/board", permanent: true },
      { source: "/news/news.php", destination: "/news/news", permanent: true },
      { source: "/news/pds.php", destination: "/news/pds", permanent: true },

      // 수은상담소
      { source: "/community/freeboard.php", destination: "/community/freeboard", permanent: true },
      { source: "/community/request.php", destination: "/community/request", permanent: true },
      { source: "/community/kit.php", destination: "/community/kit", permanent: true },

      // 식품속수은
      { source: "/content/content.php", destination: "/content/content", permanent: true },
      { source: "/content/one.php", destination: "/content/one", permanent: true },

      // 사이트맵
      { source: "/sitemap/sitemap.php", destination: "/sitemap", permanent: true },
    ];
  },
  // 원본 이미지를 그대로 사용하므로 next/image 최적화 없이 통과
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
