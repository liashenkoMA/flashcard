import CnWordTableRow from "@/_components/CnWordsTableRow/CnWordsTableRow";
import { ICnWord } from "@/_interface/Interface";
import { render, screen } from "@testing-library/react";

jest.mock("@/_components/UI/TableButton/TableButton", () => {
  return function MockTableButton({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick}>toggle</button>;
  };
});

const mockWord: ICnWord = {
  _id: "1",
  category: "HSK1",
  word: "日",
  translate: "солнце",
  pinyin: "rì",
  weight: 1,
};

describe("CnWordsTableRow", () => {
  it("Рендерит карточку со всеми данными", () => {
    render(<CnWordTableRow word={mockWord} deleteWord={jest.fn()} />);

    expect(screen.getByText("日")).toBeInTheDocument();
    expect(screen.getByText("солнце")).toBeInTheDocument();
    expect(screen.getByText("HSK1")).toBeInTheDocument();
    expect(screen.getByText("rì")).toBeInTheDocument();
  });
});
