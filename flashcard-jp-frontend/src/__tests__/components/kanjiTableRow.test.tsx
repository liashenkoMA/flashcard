import KanjiTableRow from "@/_components/KanjiTableRow/KanjiTableRow";
import { render, screen } from "@testing-library/react";

jest.mock("@/_components/UI/TableButton/TableButton", () => {
  return function MockTableButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>toggle</button>;
  };
});

const mockKanji = {
  _id: "1",
  kanji: "日",
  translate: "день, солнце",
  jpRead: "ひ、び、か",
  chinaRead: "ニチ、ジツ",
  learned: false,
  weight: 1,
};

describe("KanjiTableRow", () => {
  it("Рендерит карточку со всеми данными", () => {
    render(<KanjiTableRow kanji={mockKanji} deleteKanji={jest.fn()} />);

    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("день, солнце")).toBeInTheDocument();
    expect(screen.getByText("ひ、び、か")).toBeInTheDocument();
    expect(screen.getByText("ニチ、ジツ")).toBeInTheDocument();
  });
});
