import KrWordsRepeatPageComponent from "@/_components/KrWordsRepeatPageComponent/KrWordsRepeatPageComponent";
import { updateKrWordWeight } from "@/_utils/api/client/krWordsApi";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/krWordsApi", () => ({
  updateKrWordWeight: jest.fn(),
}));

const mockWordsCards = [
  {
    _id: "1",
    word: "안녕",
    translate: "привет",
    category: "приветствие",
    weight: 3,
  },
];

describe("KrWordsRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает Идет загрузка или карточки еще не созданы. при пустом массиве", async () => {
    render(<KrWordsRepeatPageComponent words={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    expect(await screen.findByText(/안녕/)).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateWordWeight c remember", async () => {
    (updateKrWordWeight as jest.Mock).mockResolvedValue({});

    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/안녕/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    expect(updateKrWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "remember",
      },
    );
  });

  it("Кнопка Не помню вызывает updateWordWeight c forgot", async () => {
    (updateKrWordWeight as jest.Mock).mockResolvedValue({});

    render(<KrWordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/안녕/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    expect(updateKrWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "forgot",
      },
    );
  });
});
