import CnWordsRepeatPageComponent from "@_components/CnWordsRepeatPageComponent/CnWordsRepeanPageComponent";
import { updateCnWordWeight } from "@/_utils/api/client/cnWordsApi";
import { fireEvent, render, screen } from "@testing-library/react";
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

const mockWordsCards: ICnWord[] = [
  {
    _id: "1",
    word: "你好",
    pinyin: "nǐ hǎo",
    translate: "привет",
    category: "приветствие",
    weight: 3,
  },
];

describe("CnWordsRepeatPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Показывает Идет загрузка или карточки еще не созданы. при пустом массиве", async () => {
    render(<CnWordsRepeatPageComponent words={[]} />);

    expect(
      screen.getByText("Идет загрузка или карточки еще не созданы."),
    ).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    expect(await screen.findByText(/你好/)).toBeInTheDocument();
  });

  it("Кнопка Помню вызывает updateWordWeight c remember", async () => {
    (updateCnWordWeight as jest.Mock).mockResolvedValue({});

    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/你好/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    expect(updateCnWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "remember",
      },
    );
  });

  it("Кнопка Не помню вызывает updateWordWeight c forgot", async () => {
    (updateCnWordWeight as jest.Mock).mockResolvedValue({});

    render(<CnWordsRepeatPageComponent words={mockWordsCards} />);

    await screen.findByText(/你好/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    expect(updateCnWordWeight).toHaveBeenCalledWith(
      expect.objectContaining({
        word: mockWordsCards[0].word,
      }),
      {
        status: "forgot",
      },
    );
  });
});
