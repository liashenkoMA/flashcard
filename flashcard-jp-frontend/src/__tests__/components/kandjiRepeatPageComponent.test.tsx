import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { updateKanjiWeight } from "@/_utils/api/client/kanjiApi";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/kanjiApi", () => ({
  updateKanjiWeight: jest.fn(),
}));

const mockKanjiCards = [
  {
    _id: "1",
    kanji: "日",
    translate: "день, солнце",
    jpRead: "ひ、び、か",
    chinaRead: "ニチ、ジツ",
    learned: false,
    weight: 1,
  },
  {
    _id: "2",
    kanji: "月",
    translate: "месяц, луна",
    jpRead: "つき",
    chinaRead: "ゲツ、ガツ",
    learned: true,
    weight: 1,
  },
];

describe("KandjiRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает загрузку при пустом массиве", async () => {
    render(<KandjiRepeatPageComponent kanji={[]} />);

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    expect(await screen.findByText(/日|月/)).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateKanjiWeight c remember", async () => {
    (updateKanjiWeight as jest.Mock).mockResolvedValue({});

    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    await screen.findByText(/日|月/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    expect(updateKanjiWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        kanji: mockKanjiCards[0].kanji,
      }),
      {
        status: "remember",
      },
    );
  });

  it("Кнопка Не помню вызывает updateKanjiWeight c forgot", async () => {
    (updateKanjiWeight as jest.Mock).mockResolvedValue({});

    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    await screen.findByText(/日|月/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    expect(updateKanjiWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        kanji: mockKanjiCards[0].kanji,
      }),
      {
        status: "forgot",
      },
    );
  });
});
