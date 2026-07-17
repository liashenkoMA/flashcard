import KanjiTable from "@/_components/KanjiTable/KanjiTable";
import { IKanji } from "@/_interface/Interface";
import { deleteKanji } from "@/_utils/api/client/kanjiApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/kanjiApi", () => ({
  deleteKanji: jest.fn(),
}));

describe("KanjiTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockKanji: IKanji[] = [
    {
      _id: "1",
      kanji: "日",
      translate: "день, солнце",
      jpRead: "ひ、び、か",
      chinaRead: "ニチ、ジツ",
      learned: false,
      level: "N5",
      weight: 1,
    },
  ];

  it("Рендерит список кандзи", () => {
    render(<KanjiTable kanji={mockKanji} />);

    expect(screen.getByText("Таблица кандзи")).toBeInTheDocument();
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Вызывает deleteKanji при клике", async () => {
    (deleteKanji as jest.Mock).mockResolvedValueOnce({
      data: "Кандзи успешно удалён",
    });

    render(<KanjiTable kanji={mockKanji} />);

    const deleteButton = screen.getByRole("button", {
      name: /удалить/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteKanji).toHaveBeenCalledTimes(1);
    });
    expect(deleteKanji).toHaveBeenCalledWith(mockKanji[0]);
  });
});
