import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { updateHiragana, updateKatakana } from "@/_utils/client/kanaApi";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/client/kanaApi", () => ({
  updateHiragana: jest.fn(),
  updateKatakana: jest.fn(),
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
    render(
      <KanaPageComponent
        kana={[]}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    expect(await screen.findByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Вперед переключает карточку", async () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Вперед" }));

    expect(screen.getByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Назад переключает карточку", async () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(screen.getByText(/あ|い|う/)).toBeInTheDocument();
  });

  it("Кнопка Выучил вызывает updateHirakana", async () => {
    (updateHiragana as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: undefined }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Выучил" }));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalled();
    });
  });

  it("Кнопка Выучил вызывает updateKatakana", async () => {
    (updateKatakana as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="katakana"
        searchParams={{ type: undefined }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Выучил" }));

    await waitFor(() => {
      expect(updateKatakana).toHaveBeenCalled();
    });
  });
});
