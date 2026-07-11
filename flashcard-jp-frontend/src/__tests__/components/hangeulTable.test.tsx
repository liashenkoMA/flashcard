import HangeulTable from "@/_components/HangeulTable/HangeulTable";
import { IHangeul } from "@/_interface/Interface";
import { updateHangeul } from "@/_utils/api/client/hangeulApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/hangeulApi", () => ({
  updateHangeul: jest.fn(),
}));

jest.mock("@/_components/HangeulTableRow/HangeulTableRow", () => {
  return function MockRow({
    hangeul,
    updateHangeul,
  }: {
    hangeul: IHangeul;
    updateHangeul: () => void;
  }) {
    return <div onClick={updateHangeul}>{hangeul.symbol}</div>;
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

const hangeulMock = [
  { symbol: "ㄱ", romaji: "a", learned: false, _id: "1", weight: 1 },
];

describe("HangeulTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит hangeul", () => {
    render(<HangeulTable hangeul={hangeulMock} />);

    expect(screen.getByText("Таблица hangeul")).toBeInTheDocument();

    expect(screen.getByText("ㄱ")).toBeInTheDocument();
  });

  it("Вызывает updateHangeul при клике", async () => {
    (updateHangeul as jest.Mock).mockResolvedValue({});

    render(<HangeulTable hangeul={hangeulMock} />);

    fireEvent.click(screen.getByText("ㄱ"));

    await waitFor(() => {
      expect(updateHangeul).toHaveBeenCalledTimes(1);
    });
  });

  it("Переключает learned состояние", async () => {
    (updateHangeul as jest.Mock).mockResolvedValue({});

    render(<HangeulTable hangeul={hangeulMock} />);

    fireEvent.click(screen.getByText("ㄱ"));

    await waitFor(() => {
      expect(updateHangeul).toHaveBeenCalled();
    });
  });
});
