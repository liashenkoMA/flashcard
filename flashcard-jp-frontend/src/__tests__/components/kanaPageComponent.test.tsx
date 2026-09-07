import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";
import { IKana } from "@/_interface/Interface";
import {
  updateHiragana,
  updateHiraganaWeight,
  updateKatakana,
  updateKatakanaWeight,
} from "@/_utils/api/client/kanaApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/api/client/kanaApi", () => ({
  updateHiragana: jest.fn(),
  updateKatakana: jest.fn(),
  updateHiraganaWeight: jest.fn(),
  updateKatakanaWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const mockCards: IKana[] = [
  {
    symbol: "あ",
    romaji: "a",
    weight: 1,
    _id: "1",
    group: "a",
  },
  {
    symbol: "い",
    romaji: "i",
    weight: 1,
    _id: "2",
    group: "a",
  },
  {
    symbol: "か",
    romaji: "ka",
    weight: 1,
    _id: "3",
    group: "k",
  },
];

describe("KanaPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (separateDuplicatesShuffleCards as jest.Mock).mockImplementation((cards) =>
      [...cards].reverse(),
    );
  });

  it("Показывает загрузку при пустом массиве", () => {
    render(
      <KanaPageComponent
        kana={[]}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    expect(
      screen.getByText("Идет загрузка или каны еще не выучены."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "learn" }}
      />,
    );

    expect(screen.getByText("あ")).toBeInTheDocument();
  });

  it("В режиме repeat отображаются кнопки Помню и Не помню", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(screen.getByRole("button", { name: "Помню" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Не помню" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Назад" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Вперед" }),
    ).not.toBeInTheDocument();
  });

  it("В обычном режиме отображаются кнопки Назад, Вперед и Запомнил", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{}}
      />,
    );

    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalledTimes(1);
      expect(updateHiragana).toHaveBeenCalledWith(mockCards[0]);
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

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateKatakana).toHaveBeenCalledTimes(1);
      expect(updateKatakana).toHaveBeenCalledWith(mockCards[0]);
    });
  });

  it("Кнопка Помню вызывает updateHiraganaWeight со статусом remember", async () => {
    (updateHiraganaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateHiraganaWeight).toHaveBeenCalledTimes(1);
      expect(updateHiraganaWeight).toHaveBeenCalledWith(mockCards[0], {
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

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateHiraganaWeight).toHaveBeenCalledTimes(1);
      expect(updateHiraganaWeight).toHaveBeenCalledWith(mockCards[0], {
        status: "forgot",
      });
    });
  });

  it("Кнопка Помню вызывает updateKatakanaWeight со статусом remember", async () => {
    (updateKatakanaWeight as jest.Mock).mockResolvedValue({});

    render(
      <KanaPageComponent
        kana={mockCards}
        params="katakana"
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateKatakanaWeight).toHaveBeenCalledTimes(1);
      expect(updateKatakanaWeight).toHaveBeenCalledWith(mockCards[0], {
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

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateKatakanaWeight).toHaveBeenCalledTimes(1);
      expect(updateKatakanaWeight).toHaveBeenCalledWith(mockCards[0], {
        status: "forgot",
      });
    });
  });

  it("Фильтрует карточки по выбранной группе", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "k" },
    });

    expect(screen.getByRole("combobox")).toHaveValue("k");
    expect(screen.getByText("か")).toBeInTheDocument();
    expect(screen.queryByText("あ")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "k" },
    });

    expect(screen.getByText("か")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("あ")).toBeInTheDocument();
  });

  it("Показывает сообщение, если в выбранной группе нет карточек", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "w" },
    });

    expect(
      screen.getByText("В этой группе пока нет карточек"),
    ).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(screen.getByText("あ")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockCards);
    // mock возвращает reverse(), поэтому первой становится か
    expect(screen.getByText("か")).toBeInTheDocument();
  });

  it("Перемешивает только карточки выбранной группы", () => {
    render(
      <KanaPageComponent
        kana={mockCards}
        params="hiragana"
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "a" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockCards[0],
      mockCards[1],
    ]);
    // reverse: [い, あ]
    expect(screen.getByText("い")).toBeInTheDocument();
  });
});
