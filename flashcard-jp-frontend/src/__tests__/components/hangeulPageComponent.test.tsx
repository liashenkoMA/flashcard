import HangeulPageComponent from "@/_components/HangeulPageComponent/HangeulPageComponent";
import {
  updateHangeul,
  updateHangeulWeight,
} from "@/_utils/api/client/hangeulApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { IHangeul } from "@/_interface/Interface";

jest.mock("@/_utils/api/client/hangeulApi", () => ({
  updateHangeul: jest.fn(),
  updateHangeulWeight: jest.fn(),
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

const mockCards: IHangeul[] = [
  {
    symbol: "ㄱ",
    romaji: "g/k",
    weight: 1,
    _id: "1",
    group: "basic-consonant",
  },
  {
    symbol: "ㄴ",
    romaji: "n",
    weight: 1,
    _id: "2",
    group: "basic-consonant",
  },
  {
    symbol: "ㅏ",
    romaji: "a",
    weight: 1,
    _id: "3",
    group: "basic-vowel",
  },
];

describe("HangeulPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (separateDuplicatesShuffleCards as jest.Mock).mockImplementation((cards) =>
      [...cards].reverse(),
    );
  });

  it("Показывает загрузку при пустом массиве", () => {
    render(
      <HangeulPageComponent hangeul={[]} searchParams={{ type: "learn" }} />,
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендерит первую карточку без перемешивания", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "learn" }}
      />,
    );

    expect(screen.getByText("ㄱ")).toBeInTheDocument();
  });

  it("В режиме repeat отображаются кнопки Помню и Не помню", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
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
    render(<HangeulPageComponent hangeul={mockCards} searchParams={{}} />);

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

  it("Кнопка Запомнил вызывает updateHangeul", async () => {
    (updateHangeul as jest.Mock).mockResolvedValue({});

    render(<HangeulPageComponent hangeul={mockCards} searchParams={{}} />);

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateHangeul).toHaveBeenCalledTimes(1);
      expect(updateHangeul).toHaveBeenCalledWith(mockCards[0]);
    });
  });

  it("Кнопка Помню вызывает updateHangeulWeight со статусом remember", async () => {
    (updateHangeulWeight as jest.Mock).mockResolvedValue({});

    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateHangeulWeight).toHaveBeenCalledTimes(1);
      expect(updateHangeulWeight).toHaveBeenCalledWith(mockCards[0], {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateHangeulWeight со статусом forgot", async () => {
    (updateHangeulWeight as jest.Mock).mockResolvedValue({});

    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateHangeulWeight).toHaveBeenCalledTimes(1);
      expect(updateHangeulWeight).toHaveBeenCalledWith(mockCards[0], {
        status: "forgot",
      });
    });
  });

  it("Отображает все группы в select", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(screen.getByRole("option", { name: "Все" })).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "basic-consonant" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "double-consonant" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "basic-vowel" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "compound-vowel" }),
    ).toBeInTheDocument();
  });

  it("Фильтрует карточки по выбранной группе", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "basic-vowel" },
    });

    expect(select).toHaveValue("basic-vowel");
    expect(screen.getByText("ㅏ")).toBeInTheDocument();
    expect(screen.queryByText("ㄱ")).not.toBeInTheDocument();
  });

  it("При выборе Все снова отображает все карточки", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, {
      target: { value: "basic-vowel" },
    });

    expect(screen.getByText("ㅏ")).toBeInTheDocument();

    fireEvent.change(select, {
      target: { value: "all" },
    });

    expect(select).toHaveValue("all");
    expect(screen.getByText("ㄱ")).toBeInTheDocument();
  });

  it("Показывает сообщение, если в выбранной группе нет карточек", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "double-consonant" },
    });

    expect(
      screen.getByText("В этой группе пока нет карточек"),
    ).toBeInTheDocument();
  });

  it("Кнопка Перемешать перемешивает текущие карточки", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(screen.getByText("ㄱ")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledTimes(1);
    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith(mockCards);
    // reverse() → первой становится ㅏ
    expect(screen.getByText("ㅏ")).toBeInTheDocument();
  });

  it("Перемешивает только карточки выбранной группы", () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "basic-consonant" },
    });

    expect(screen.getByText("ㄱ")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Перемешать" }));

    expect(separateDuplicatesShuffleCards).toHaveBeenCalledWith([
      mockCards[0],
      mockCards[1],
    ]);
    // [ㄱ, ㄴ] → reverse()
    expect(screen.getByText("ㄴ")).toBeInTheDocument();
  });
});
