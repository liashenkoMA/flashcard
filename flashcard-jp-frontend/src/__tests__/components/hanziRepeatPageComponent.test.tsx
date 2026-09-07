import HanziRepeatPageComponent from "@/_components/HanziRepeatPageComponent/HanziRepeatPageComponent";
import { IHanzi } from "@/_interface/Interface";
import { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { updateHanziWeight } from "@/_utils/api/client/hanziApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/hanziApi", () => ({
  updateHanziWeight: jest.fn(),
}));

jest.mock("@/_utils/separateDuplicates", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockHanziCards: IHanzi[] = [
  {
    _id: "1",
    category: "HSK1",
    hanzi: "日",
    translate: "солнце",
    pinyin: "rì",
    weight: 1,
  },
  {
    _id: "2",
    category: "HSK1",
    hanzi: "月",
    translate: "луна",
    pinyin: "yuè",
    weight: 1,
  },
  {
    _id: "3",
    category: "HSK2",
    hanzi: "水",
    translate: "вода",
    pinyin: "shuǐ",
    weight: 1,
  },
];

describe("HanziRepeatPageComponent", () => {
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
    render(<HanziRepeatPageComponent hanzi={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateHanziWeight со статусом remember", async () => {
    (updateHanziWeight as jest.Mock).mockResolvedValue({});

    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateHanziWeight).toHaveBeenCalledTimes(1);
      expect(updateHanziWeight).toHaveBeenCalledWith(mockHanziCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateHanziWeight со статусом forgot", async () => {
    (updateHanziWeight as jest.Mock).mockResolvedValue({});

    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateHanziWeight).toHaveBeenCalledTimes(1);
      expect(updateHanziWeight).toHaveBeenCalledWith(mockHanziCards[0], {
        status: "forgot",
      });
    });
  });

  it("Отображает уникальные категории из массива ханзи", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(screen.getByRole("option", { name: "Все" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "HSK1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "HSK2" })).toBeInTheDocument();
  });

  it("Фильтрует карточки по выбранной категории", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "HSK2" },
    });

    expect(select).toHaveValue("HSK2");
    expect(screen.getByText("水")).toBeInTheDocument();
    expect(screen.queryByText("日")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "HSK2" },
    });

    expect(screen.getByText("水")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    expect(screen.getByText("日")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockHanziCards);
    // mock делает reverse(), поэтому первой становится 水
    expect(screen.getByText("水")).toBeInTheDocument();
  });

  it("Перемешивает только ханзи выбранной категории", () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "HSK1" },
    });

    expect(screen.getByText("日")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockHanziCards[0],
      mockHanziCards[1],
    ]);
    // [日, 月] → reverse()
    expect(screen.getByText("月")).toBeInTheDocument();
  });
});
