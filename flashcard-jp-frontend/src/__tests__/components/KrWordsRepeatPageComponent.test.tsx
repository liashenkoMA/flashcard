import KrWordsRepeatPageComponent from "@/_components/KrWordsRepeatPageComponent/KrWordsRepeatPageComponent";
import { IWord } from "@/_interface/Interface";
import { updateKrWordWeight } from "@/_utils/api/client/krWordsApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/krWordsApi", () => ({
  updateKrWordWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockWordsCards: IWord[] = [
  {
    _id: "1",
    word: "안녕",
    translate: "привет",
    category: "Приветствия",
    weight: 3,
  },
  {
    _id: "2",
    word: "감사합니다",
    translate: "спасибо",
    category: "Приветствия",
    weight: 2,
  },
  {
    _id: "3",
    word: "고양이",
    translate: "кот",
    category: "Животные",
    weight: 1,
  },
];

describe("KrWordsRepeatPageComponent", () => {
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
    render(<KrWordsRepeatPageComponent words={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("안녕")).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateKrWordWeight со статусом remember", async () => {
    (updateKrWordWeight as jest.Mock).mockResolvedValue({});

    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateKrWordWeight).toHaveBeenCalledTimes(1);
      expect(updateKrWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateKrWordWeight со статусом forgot", async () => {
    (updateKrWordWeight as jest.Mock).mockResolvedValue({});

    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateKrWordWeight).toHaveBeenCalledTimes(1);
      expect(updateKrWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "forgot",
      });
    });
  });

  it("Отображает уникальные категории из массива слов", () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

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
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(select).toHaveValue("Животные");
    expect(screen.getByText("고양이")).toBeInTheDocument();
    expect(screen.queryByText("안녕")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(screen.getByText("고양이")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("안녕")).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("안녕")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockWordsCards);
    // reverse() → первой становится 고양이
    expect(screen.getByText("고양이")).toBeInTheDocument();
  });

  it("Перемешивает только слова выбранной категории", () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Приветствия" },
    });

    expect(screen.getByText("안녕")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockWordsCards[0],
      mockWordsCards[1],
    ]);
    // [안녕, 감사합니다] → reverse()
    expect(screen.getByText("감사합니다")).toBeInTheDocument();
  });
});
