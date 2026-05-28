import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { updateHirakana } from "@/_utils/client/kanaApi";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/client/kanaApi", () => ({
  updateHirakana: jest.fn(),
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

  it("Показывает загрузку при пустом массиве", () => {
    render(<KanaPageComponent kana={[]} params="hiragana" />);
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<KanaPageComponent kana={mockCards} params="hiragana" />);

    expect(await screen.findByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Вперед переключает карточку", async () => {
    render(<KanaPageComponent kana={mockCards} params="hiragana" />);

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Вперед"));

    expect(screen.getByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Назад переключает карточку", async () => {
    render(<KanaPageComponent kana={mockCards} params="hiragana" />);

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Назад"));

    expect(screen.getByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Выучил вызывает updateHirakana", async () => {
    (updateHirakana as jest.Mock).mockResolvedValue({});

    render(<KanaPageComponent kana={mockCards} params="hiragana" />);

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByText("Выучил"));

    await waitFor(() => {
      expect(updateHirakana).toHaveBeenCalled();
    });
  });
});
