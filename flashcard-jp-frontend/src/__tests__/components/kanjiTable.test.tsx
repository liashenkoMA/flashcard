import KanjiTable from "@/_components/KanjiTable/KanjiTable";
import { render, screen } from "@testing-library/react";

describe("KanjiTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockKanji = [
    {
      _id: "1",
      kanji: "日",
      translate: "день, солнце",
      jpRead: "ひ、び、か",
      chinaRead: "ニチ、ジツ",
      learned: false,
    },
  ];

  it("Рендерит список кандзи", () => {
    render(<KanjiTable kanji={mockKanji} />);

    expect(screen.getByText("Таблица кандзи")).toBeInTheDocument();

    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Вызывает deleteKanji при клике", () => {});
});
