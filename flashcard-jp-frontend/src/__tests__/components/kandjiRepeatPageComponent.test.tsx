import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const mockKanjiCards = [
  {
    _id: "1",
    kanji: "日",
    translate: "день, солнце",
    jpRead: "ひ、び、か",
    chinaRead: "ニチ、ジツ",
    learn: false,
  },
  {
    _id: "2",
    kanji: "月",
    translate: "месяц, луна",
    jpRead: "つき",
    chinaRead: "ゲツ、ガツ",
    learn: true,
  },
];

describe("KandjiRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Показывает загрузку при пустом массиве", async () => {
    render(<KandjiRepeatPageComponent kanji={[]} />);

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    expect(await screen.findByText(/日|月/)).toBeInTheDocument();
  });

  it("Кнопка Вперед переключает карточку", async () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    await screen.findByText(/日|月/);

    fireEvent.click(screen.getByRole("button", { name: "Вперед" }));

    expect(screen.getByText(/日|月/)).toBeInTheDocument();
  });

  it("Кнопка Назад переключает карточку", async () => {
    render(<KandjiRepeatPageComponent kanji={mockKanjiCards} />);

    await screen.findByText(/日|月/);

    fireEvent.click(screen.getByRole("button", { name: "Назад" }));

    expect(screen.getByText(/日|月/)).toBeInTheDocument();
  });
});
