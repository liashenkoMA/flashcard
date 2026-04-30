import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { getHiragana, updateHiragana } from "@/_utils/kanaApi";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/kanaApi", () => ({
  getHiragana: jest.fn(),
  updateHiragana: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const mockCards = [
  { symbol: "あ", romaji: "a" },
  { symbol: "い", romaji: "i" },
  { symbol: "う", romaji: "u" },
];

describe("KanaPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Показывает Loading", () => {
    (getHiragana as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<KanaPageComponent />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Рендер карточки после загрузки", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockCards);

    render(<KanaPageComponent />);

    const card = await screen.findByText(/あ|い|う/);

    expect(card).toBeInTheDocument();
  });

  it("Кнопка Вперед переключает карточку", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockCards);

    render(<KanaPageComponent />);

    const firstCard = await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Вперед"));

    const secondCard = screen.getByText(/あ|い|う/);

    expect(secondCard).toBeInTheDocument();
    expect(secondCard).not.toBe(firstCard);
  });

  it("Кнопка Назад переключает карточку", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockCards);

    render(<KanaPageComponent />);

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Назад"));

    expect(screen.getByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Выучил вызывает updateHiragana", async () => {
    (getHiragana as jest.Mock).mockResolvedValue(mockCards);
    (updateHiragana as jest.Mock).mockResolvedValue({});

    render(<KanaPageComponent />);

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Выучил"));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalledTimes(1);
    });
  });

});
