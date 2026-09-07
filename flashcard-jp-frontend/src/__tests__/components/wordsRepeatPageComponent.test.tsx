import WordsRepeatPageComponent from "@/_components/WordsRepeatPageComponent/WordsRepeatPageComponents";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { updateWordWeight } from "@/_utils/api/client/wordApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { IWord } from "@/_interface/Interface";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/wordApi", () => ({
  updateWordWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockWordsCards: IWord[] = [
  {
    _id: "1",
    word: "こんにちは",
    translate: "привет",
    category: "Приветствия",
    weight: 1,
  },
  {
    _id: "2",
    word: "ありがとう",
    translate: "спасибо",
    category: "Приветствия",
    weight: 1,
  },
  {
    _id: "3",
    word: "猫",
    translate: "кот",
    category: "Животные",
    weight: 1,
  },
];

describe("WordsRepeatPageComponent", () => {
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
    render(<WordsRepeatPageComponent words={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateWordWeight со статусом remember", async () => {
    (updateWordWeight as jest.Mock).mockResolvedValue({});

    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateWordWeight).toHaveBeenCalledTimes(1);
      expect(updateWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateWordWeight со статусом forgot", async () => {
    (updateWordWeight as jest.Mock).mockResolvedValue({});

    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateWordWeight).toHaveBeenCalledTimes(1);
      expect(updateWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "forgot",
      });
    });
  });

  it("Отображает уникальные категории из массива слов", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(screen.getByRole("option", { name: "Все" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Приветствия" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Животные" }),
    ).toBeInTheDocument();
  });

  it("Фильтрует карточки по выбранной категории", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(select).toHaveValue("Животные");
    expect(screen.getByText("猫")).toBeInTheDocument();
    expect(screen.queryByText("こんにちは")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(screen.getByText("猫")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    // Снова первая карточка исходного массива
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("こんにちは")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockWordsCards);
    // Mock делает reverse(), поэтому первой становится 猫
    expect(screen.getByText("猫")).toBeInTheDocument();
  });

  it("Перемешивает только слова выбранной категории", () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Приветствия" },
    });

    expect(screen.getByText("こんにちは")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockWordsCards[0],
      mockWordsCards[1],
    ]);
    // [こんにちは, ありがとう] → reverse()
    expect(screen.getByText("ありがとう")).toBeInTheDocument();
  });
});
