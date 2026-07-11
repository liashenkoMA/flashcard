import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import {
  updateHiragana,
  updateHiraganaWeight,
  updateKatakana,
  updateKatakanaWeight,
} from "@/_utils/api/client/kanaApi";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/api/client/kanaApi", () => ({
  updateHiragana: jest.fn(),
  updateKatakana: jest.fn(),
  updateHiraganaWeight: jest.fn(),
  updateKatakanaWeight: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const mockCards = [
  { symbol: "あ", romaji: "a", weight: 1, _id: "1" },
  { symbol: "い", romaji: "i", weight: 1, _id: "1" },
  { symbol: "う", romaji: "u", weight: 1, _id: "1" },
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

    expect(screen.getByText("Идет загрузка или каны еще не выучены.")).toBeInTheDocument();
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

  it("В режиме repeat отображаются кнопки Помню и Не помню", async () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Помню" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Не помню" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Назад" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Вперед" }),
    ).not.toBeInTheDocument();
  });

  it("В обычном режиме отображаются кнопки Назад, Вперед и Запомнил", async () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{}}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Назад" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Вперед" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Запомнил" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Помню" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Не помню" }),
    ).not.toBeInTheDocument();
  });

  it("Кнопка Запомнил вызывает updateHiragana", async () => {
    (updateHiragana as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{}}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalledTimes(1);
    });
  });

  it("Кнопка Запомнил вызывает updateKatakana", async () => {
    (updateKatakana as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="katakana"
        searchParams={{}}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateKatakana).toHaveBeenCalledTimes(1);
    });
  });

  it("Кнопка Знаю вызывает updateHiraganaWeight", async () => {
    (updateHiraganaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateHiraganaWeight).toHaveBeenCalledTimes(1);
      expect(updateHiraganaWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateHiraganaWeight со статусом forgot", async () => {
    (updateHiraganaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateHiraganaWeight).toHaveBeenCalledTimes(1);
      expect(updateHiraganaWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "forgot",
      });
    });
  });

  it("Кнопка Помню вызывает updateKatakanaWeight", async () => {
    (updateKatakanaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="katakana"
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateKatakanaWeight).toHaveBeenCalledTimes(1);
      expect(updateKatakanaWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateKatakanaWeight со статусом forgot", async () => {
    (updateKatakanaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="katakana"
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/あ|い|う/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateKatakanaWeight).toHaveBeenCalledTimes(1);
      expect(updateKatakanaWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "forgot",
      });
    });
  });
});
