import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { updateKanjiWeight } from "@/_utils/api/client/kanjiApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { IKanji } from "@/_interface/Interface";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/kanjiApi", () => ({
  updateKanjiWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockKanjiCards: IKanji[] = [
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
  {
    _id: "2",
    kanji: "月",
    translate: "луна, месяц",
    jpRead: "つき",
    chinaRead: "ゲツ、ガツ",
    learned: false,
    level: "N5",
    weight: 1,
  },
  {
    _id: "3",
    kanji: "水",
    translate: "вода",
    jpRead: "みず",
    chinaRead: "スイ",
    learned: false,
    level: "N4",
    weight: 1,
  },
];

describe("KandjiRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (separateDuplicatesShuffleCards as jest.Mock).mockImplementation((cards) =>
      [...cards].reverse(),
    );

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает загрузку при пустом массиве", () => {
    render(<KandjiRepeatPageComponent kanji={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateKanjiWeight со статусом remember", async () => {
    (updateKanjiWeight as jest.Mock).mockResolvedValue({});

    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateKanjiWeight).toHaveBeenCalledTimes(1);
      expect(updateKanjiWeight).toHaveBeenCalledWith(mockKanjiCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateKanjiWeight со статусом forgot", async () => {
    (updateKanjiWeight as jest.Mock).mockResolvedValue({});

    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateKanjiWeight).toHaveBeenCalledTimes(1);
      expect(updateKanjiWeight).toHaveBeenCalledWith(mockKanjiCards[0], {
        status: "forgot",
      });
    });
  });

  it("Фильтрует карточки по выбранному уровню", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "N4" },
    });

    expect(select).toHaveValue("N4");
    expect(screen.getByText("水")).toBeInTheDocument();
    expect(screen.queryByText("日")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "N4" },
    });

    expect(screen.getByText("水")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Показывает сообщение, если карточек выбранного уровня нет", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "N1" },
    });

    expect(
      screen.getByText("Таких кандзи пока не добавлено"),
    ).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    expect(screen.getByText("日")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockKanjiCards);
    // Mock делает reverse(), поэтому первой становится 水
    expect(screen.getByText("水")).toBeInTheDocument();
  });

  it("Перемешивает только карточки выбранного уровня", () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "N5" },
    });

    expect(screen.getByText("日")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockKanjiCards[0],
      mockKanjiCards[1],
    ]);
    // N5: [日, 月] → reverse → [月, 日]
    expect(screen.getByText("月")).toBeInTheDocument();
  });
});
