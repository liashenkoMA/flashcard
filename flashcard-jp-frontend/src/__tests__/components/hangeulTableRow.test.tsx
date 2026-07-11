import HangeulTableRow from "@/_components/HangeulTableRow/HangeulTableRow";
import { render, screen } from "@testing-library/react";

jest.mock("@/_components/UI/TableButton/TableButton", () => {
  return function MockTableButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>toggle</button>;
  };
});

const mockHangeul = {
  symbol: "ㄱ",
  romaji: "a",
  learned: false,
  _id: "1",
  weight: 1,
};

describe("HangeulTableRow", () => {
  it("Рендерит symbol и romaji", () => {
    render(<HangeulTableRow hangeul={mockHangeul} updateHangeul={jest.fn()} />);

    expect(screen.getByText("ㄱ")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
  });
});
