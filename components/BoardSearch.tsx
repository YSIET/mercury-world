interface Props {
  basePath: string;
  defaultValue?: string;
}

export default function BoardSearch({ basePath, defaultValue }: Props) {
  return (
    <form className="board-search" method="get" action={basePath}>
      <label htmlFor="board-search-input" className="visually-hidden">
        검색어
      </label>
      <input
        id="board-search-input"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="제목 또는 내용 검색"
      />
      <button type="submit" className="btn btn--primary">
        검색
      </button>
    </form>
  );
}
