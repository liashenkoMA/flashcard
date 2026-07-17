import CnWordsTable from "@/_components/CnWordTable/CnWordsTable";
import { ICnWord } from "@/_interface/Interface";
import { deleteCnWord } from "@/_utils/api/client/cnWordsApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/cnWordsApi", () => ({
  deleteCnWord: jest.fn(),
}));

describe("CnWordTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCnWord: ICnWord[] = [
    {
      _id: "1",
      category: "HSK1",
      word: "日",
      translate: "солнце",
      pinyin: "rì",
      weight: 1,
    },
  ];

  it("Рендерит список слов", () => {
    render(<CnWordsTable words={mockCnWord} />);

    expect(screen.getByText("Таблица слов")).toBeInTheDocument();
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Вызывает deleteCnWord при клике", async () => {
    (deleteCnWord as jest.Mock).mockResolvedValueOnce({
      data: "Слово успешно удалено",
    });

    render(<CnWordsTable words={mockCnWord} />);

    const deleteButton = screen.getByRole("button", {
      name: /удалить/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteCnWord).toHaveBeenCalledTimes(1);
    });
    expect(deleteCnWord).toHaveBeenCalledWith(mockCnWord[0]);
  });
});
