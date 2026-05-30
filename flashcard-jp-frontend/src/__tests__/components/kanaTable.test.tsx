import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import KanaTable from "@/_components/KanaTable/KanaTable";
import { updateHiragana, updateKatakana } from "@/_utils/client/kanaApi";
import { IKana } from "@/_interface/Interface";

jest.mock("@/_utils/client/kanaApi", () => ({
  updateHiragana: jest.fn(),
  updateKatakana: jest.fn(),
}));

jest.mock("@/_components/KanaTableRow/KanaTableRow", () => {
  return function MockRow({
    kana,
    updateKana,
  }: {
    kana: IKana;
    updateKana: () => void;
  }) {
    return <div onClick={updateKana}>{kana.symbol}</div>;
  };
});

jest.mock("@/_components/UI/Accordion/Accordion", () => {
  return function MockAccordion({
    children,
    header,
  }: {
    header: string;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <h3>{header}</h3>
        {children}
      </div>
    );
  };
});

const hiraganaMock = [{ symbol: "あ", romaji: "a", learned: false }];

const katakanaMock = [{ symbol: "ア", romaji: "a", learned: false }];

describe("KanaTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит оба списка hiragana и katakana", () => {
    render(<KanaTable hiragana={hiraganaMock} katakana={katakanaMock} />);

    expect(screen.getByText("Таблица хираганы")).toBeInTheDocument();
    expect(screen.getByText("Таблица катаканы")).toBeInTheDocument();

    expect(screen.getByText("あ")).toBeInTheDocument();
    expect(screen.getByText("ア")).toBeInTheDocument();
  });

  it("Вызывает updateHiragana при клике", async () => {
    (updateHiragana as jest.Mock).mockResolvedValue({});

    render(<KanaTable hiragana={hiraganaMock} katakana={katakanaMock} />);

    fireEvent.click(screen.getByText("あ"));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalledTimes(1);
    });
  });

  it("Вызывает updateKatakana при клике", async () => {
    (updateKatakana as jest.Mock).mockResolvedValue({});

    render(<KanaTable hiragana={hiraganaMock} katakana={katakanaMock} />);

    fireEvent.click(screen.getByText("ア"));

    await waitFor(() => {
      expect(updateKatakana).toHaveBeenCalledTimes(1);
    });
  });

  it("Переключает learned состояние hiragana", async () => {
    (updateHiragana as jest.Mock).mockResolvedValue({});

    render(<KanaTable hiragana={hiraganaMock} katakana={katakanaMock} />);

    fireEvent.click(screen.getByText("あ"));

    await waitFor(() => {
      expect(updateHiragana).toHaveBeenCalled();
    });
  });

  it("Переключает learned состояние katakana", async () => {
    (updateKatakana as jest.Mock).mockResolvedValue({});

    render(<KanaTable hiragana={hiraganaMock} katakana={katakanaMock} />);

    fireEvent.click(screen.getByText("ア"));

    await waitFor(() => {
      expect(updateKatakana).toHaveBeenCalled();
    });
  });
});
