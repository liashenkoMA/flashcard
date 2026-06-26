import WordsRepeatPageComponent from "@/_components/WordsRepeatPageComponent/WordsRepeatPageComponents";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { updateWordWeight } from "@/_utils/api/client/wordApi";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

jest.mock("@/_utils/api/client/wordApi", () => ({
  updateWordWeight: jest.fn(),
}));

const mockWordsCards = [
  {
    _id: "1",
    word: "こんにちは",
    translate: "привет",
    category: "Приветствия",
    weight: 1,
  },
];

describe("WordsRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает Идет загрузка или карточки еще не созданы. при пустом массиве", async () => {
    render(<WordsRepeatPageComponent words={[]} />);

    expect(screen.getByText("Идет загрузка или карточки еще не созданы.")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    expect(await screen.findByText(/こんにちは/)).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateWordWeight c remember", async () => {
    (updateWordWeight as jest.Mock).mockResolvedValue({});

    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/こんにちは/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    expect(updateWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "remember",
      },
    );
  });

  it("Кнопка Не помню вызывает updateWordWeight c forgot", async () => {
    (updateWordWeight as jest.Mock).mockResolvedValue({});

    render(<WordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/こんにちは/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    expect(updateWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "forgot",
      },
    );
  });
});
