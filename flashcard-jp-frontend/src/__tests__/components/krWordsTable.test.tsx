import KrWordTable from "@/_components/KrWordTable/KrWordTable";
import { deleteKrWord } from "@/_utils/api/client/krWordsApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/krWordsApi", () => ({
  deleteKrWord: jest.fn(),
}));

describe("KrWordTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWords = [
    {
      _id: "1",
      word: "안녕",
      translate: "привет",
      category: "приветствие",
      weight: 3,
    },
  ];

  it("Рендерит список слов", () => {
    render(<KrWordTable words={mockWords} />);

    expect(screen.getByText("Таблица корейских слов")).toBeInTheDocument();
    expect(screen.getByText("안녕")).toBeInTheDocument();
  });

  it("Вызывает deleteWord при клике", async () => {
    (deleteKrWord as jest.Mock).mockResolvedValueOnce({
      data: "Слово удалено",
    });

    render(<KrWordTable words={mockWords} />);

    const deleteButton = screen.getByRole("button", {
      name: /удалить/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteKrWord).toHaveBeenCalledTimes(1);
    });
    expect(deleteKrWord).toHaveBeenCalledWith(mockWords[0]);
  });
});
