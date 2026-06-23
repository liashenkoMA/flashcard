import { render, screen } from "@testing-library/react";
import KanaTableRow from "@/_components/KanaTableRow/KanaTableRow";

jest.mock("@/_components/UI/TableButton/TableButton", () => {
  return function MockTableButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>toggle</button>;
  };
});

const mockKana = {
  symbol: "あ",
  romaji: "a",
  learned: false,
  _id: "1",
  weight: 1,
};

describe("KanaTableRow", () => {
  it("Рендерит symbol и romaji", () => {
    render(<KanaTableRow kana={mockKana} updateKana={jest.fn()} />);

    expect(screen.getByText("あ")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
  });
});
