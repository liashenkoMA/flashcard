import HanziRepeatPageComponent from "@/_components/HanziRepeatPageComponent/HanziRepeatPageComponent";
import { IHanzi } from "@/_interface/Interface";
import { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { updateHanziWeight } from "@/_utils/api/client/hanziApi";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/hanziApi", () => ({
  updateHanziWeight: jest.fn(),
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
];

describe("HanziRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает Идет загрузка или карточки еще не созданы. при пустом массиве", async () => {
    render(<HanziRepeatPageComponent hanzi={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    expect(await screen.findByText(/日/)).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateHanziWeight c remember", async () => {
    (updateHanziWeight as jest.Mock).mockResolvedValue({});

    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    await screen.findByText(/日/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    expect(updateHanziWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        hanzi: mockHanziCards[0].hanzi,
      }),
      {
        status: "remember",
      },
    );
  });

  it("Кнопка Не помню вызывает updateHanziWeight c forgot", async () => {
    (updateHanziWeight as jest.Mock).mockResolvedValue({});

    render(<HanziRepeatPageComponent hanzi={mockHanziCards} />);

    await screen.findByText(/日/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    expect(updateHanziWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        hanzi: mockHanziCards[0].hanzi,
      }),
      {
        status: "forgot",
      },
    );
  });
});
