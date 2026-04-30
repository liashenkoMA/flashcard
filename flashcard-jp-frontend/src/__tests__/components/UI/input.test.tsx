import Input from "@/_components/UI/Input/Input";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Input component", () => {
  it("Рендерит input и заполняет value", () => {
    render(<Input value="test" onChange={() => {}} inputName="test" />);

    expect(screen.getByRole("textbox")).toHaveValue("test");
  });

  it("Срабатывает onChange", () => {
    const handleChange = jest.fn();

    render(<Input value="test" onChange={handleChange} inputName="test" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "New message" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("Правильный текст ошибки, errors передана", () => {
    render(
      <Input value="test" onChange={() => {}} errors="Error" inputName="test" />
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("Не отображает текст ошибки, errors не передана", () => {
    const { container } = render(
      <Input value="test" onChange={() => {}} errors="" inputName="test" />
    );

    expect(
      container.getElementsByClassName("input__error")[0]
    ).toHaveTextContent("");
  });

  it("Snapshot", () => {
    const { container } = render(
      <Input value="test" onChange={() => {}} errors="Error" inputName="test" />
    );
    expect(container).toMatchSnapshot();
  });
});
