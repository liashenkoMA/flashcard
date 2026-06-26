import WordTable from "@/_components/WordsTable/WordsTable";
import { deleteWord } from "@/_utils/api/client/wordApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/wordApi", () => ({
  deleteWord: jest.fn(),
}));

describe("WordTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockWords = [
    {
      _id: "1",
      word: "こんにちは",
      translate: "привет",
      category: "greeting",
      weight: 1,
    },
  ];

  it("Рендерит список слов", () => {
    render(<WordTable words={mockWords} />);

    expect(screen.getByText("Таблица слов")).toBeInTheDocument();
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("Вызывает deleteWord при клике", async () => {
    (deleteWord as jest.Mock).mockResolvedValueOnce({
      data: "Слово удалено",
    });

    render(<WordTable words={mockWords} />);

    const deleteButton = screen.getByRole("button", {
      name: /удалить/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteWord).toHaveBeenCalledTimes(1);
    });
    expect(deleteWord).toHaveBeenCalledWith(mockWords[0]);
  });
});
