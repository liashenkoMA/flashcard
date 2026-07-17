import HanziTableRow from "@/_components/HanzitableRow/HanziTableRow";
import { IHanzi } from "@/_interface/Interface";
import { render, screen } from "@testing-library/react";

jest.mock("@/_components/UI/TableButton/TableButton", () => {
  return function MockTableButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>toggle</button>;
  };
});

const mockHanzi: IHanzi = {
  _id: "1",
  category: "HSK1",
  hanzi: "日",
  translate: "солнце",
  pinyin: "rì",
  weight: 1,
};

describe("HanziTableRow", () => {
  it("Рендерит карточку со всеми данными", () => {
    render(<HanziTableRow hanzi={mockHanzi} deleteHanzi={jest.fn()} />);

    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("солнце")).toBeInTheDocument();
    expect(screen.getByText("HSK1")).toBeInTheDocument();
    expect(screen.getByText("rì")).toBeInTheDocument();
  });
});
