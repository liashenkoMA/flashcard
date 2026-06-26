import { fireEvent, render, screen } from "@testing-library/react";
import TableButton from "@/_components/UI/TableButton/TableButton";

jest.mock("./TableButton.module.scss", () => ({
  tablebutton: "tablebutton",
  tablebutton__delete: "tablebutton__delete",
  tablebutton__learn: "tablebutton__learn",
}));

describe("TableButton component", () => {
  it("Рендерит текст 'Выучить' если learned = false", () => {
    render(<TableButton learned={false} onClick={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Выучить" })).toBeInTheDocument();
  });

  it("Вызывает onClick при клике", () => {
    const handleClick = jest.fn();

    render(<TableButton learned={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Выучить" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Имеет type=button", () => {
    render(<TableButton learned={false} onClick={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Выучить" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("Snapshot", () => {
    const { container } = render(
      <TableButton learned={false} onClick={jest.fn()} />,
    );

    expect(container).toMatchSnapshot();
  });
});
