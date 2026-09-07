import CnWordsRepeatPageComponent from "@_components/CnWordsRepeatPageComponent/CnWordsRepeanPageComponent";
import { updateCnWordWeight } from "@/_utils/api/client/cnWordsApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { ICnWord } from "@/_interface/Interface";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/cnWordsApi", () => ({
  updateCnWordWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockWordsCards: ICnWord[] = [
  {
    _id: "1",
    word: "你好",
    pinyin: "nǐ hǎo",
    translate: "привет",
    category: "Приветствия",
    weight: 3,
  },
  {
    _id: "2",
    word: "谢谢",
    pinyin: "xiè xie",
    translate: "спасибо",
    category: "Приветствия",
    weight: 2,
  },
  {
    _id: "3",
    word: "猫",
    pinyin: "māo",
    translate: "кот",
    category: "Животные",
    weight: 1,
  },
];

describe("CnWordsRepeatPageComponent", () => {
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
    render(<CnWordsRepeatPageComponent words={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("你好")).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateCnWordWeight со статусом remember", async () => {
    (updateCnWordWeight as jest.Mock).mockResolvedValue({});

    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateCnWordWeight).toHaveBeenCalledTimes(1);
      expect(updateCnWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateCnWordWeight со статусом forgot", async () => {
    (updateCnWordWeight as jest.Mock).mockResolvedValue({});

    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateCnWordWeight).toHaveBeenCalledTimes(1);
      expect(updateCnWordWeight).toHaveBeenCalledWith(mockWordsCards[0], {
        status: "forgot",
      });
    });
  });

  it("Отображает уникальные категории из массива слов", () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

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
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(select).toHaveValue("Животные");
    expect(screen.getByText("猫")).toBeInTheDocument();
    expect(screen.queryByText("你好")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Животные" },
    });

    expect(screen.getByText("猫")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("你好")).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    expect(screen.getByText("你好")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockWordsCards);
    // reverse() → первой становится 猫
    expect(screen.getByText("猫")).toBeInTheDocument();
  });

  it("Перемешивает только слова выбранной категории", () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "Приветствия" },
    });

    expect(screen.getByText("你好")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockWordsCards[0],
      mockWordsCards[1],
    ]);
    // [你好, 谢谢] → reverse()
    expect(screen.getByText("谢谢")).toBeInTheDocument();
  });
});
