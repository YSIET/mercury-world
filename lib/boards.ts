export type BoardSlug =
  | 'notice'
  | 'news'
  | 'mercury'
  | 'qna'
  | 'request'
  | 'kit';

export interface BoardMeta {
  slug: BoardSlug;
  title: string;
  description: string;
  allowsUserWrite: boolean;
}

export const BOARDS: Record<BoardSlug, BoardMeta> = {
  notice: {
    slug: 'notice',
    title: '공지사항',
    description: '수은세상의 공지사항을 안내합니다.',
    allowsUserWrite: false,
  },
  news: {
    slug: 'news',
    title: '관련 뉴스',
    description: '수은 관련 언론 보도 및 뉴스 모음.',
    allowsUserWrite: false,
  },
  mercury: {
    slug: 'mercury',
    title: '수은 자료실',
    description: '수은 관련 자료, 보고서, 가이드라인.',
    allowsUserWrite: false,
  },
  qna: {
    slug: 'qna',
    title: 'Q&A',
    description: '수은과 관련해 궁금한 점을 질문해 주세요.',
    allowsUserWrite: true,
  },
  request: {
    slug: 'request',
    title: '자료 요청',
    description: '수은 자료 요청 및 문의를 남겨주세요.',
    allowsUserWrite: true,
  },
  kit: {
    slug: 'kit',
    title: '키트 신청',
    description: '수은 검사 키트 신청 게시판입니다.',
    allowsUserWrite: true,
  },
};

export const BOARD_SLUGS = Object.keys(BOARDS) as BoardSlug[];

export function isBoardSlug(value: string): value is BoardSlug {
  return value in BOARDS;
}

export function getBoard(slug: string): BoardMeta | null {
  if (!isBoardSlug(slug)) return null;
  return BOARDS[slug];
}
