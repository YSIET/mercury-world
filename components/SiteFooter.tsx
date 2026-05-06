export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__logo">Hg</span>
          <span>수은세상 (Mercury World)</span>
        </div>
        <address className="site-footer__meta">
          <span>※ 본 사이트는 수은 정보 제공을 위한 비영리 안내 페이지입니다.</span>
          <span>문의: <a href="/bbs/qna">Q&amp;A 게시판</a></span>
          <span className="site-footer__copy">
            © {new Date().getFullYear()} Mercury World. All rights reserved.
          </span>
        </address>
      </div>
    </footer>
  );
}
