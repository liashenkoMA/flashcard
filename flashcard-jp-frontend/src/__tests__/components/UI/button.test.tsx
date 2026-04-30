import { fireEvent, render, screen } from "@testing-library/react";
import Button from "@/_components/UI/Button/Button";

describe("Button component", () => {
  it("Рендерит button, правильный текст", () => {
    render(<Button text="Зарегистрироваться" />);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" })
    ).toBeInTheDocument();
  });

  it("Срабатывает onClick, disabled = false", () => {
    const handleChange = jest.fn();
    render(<Button text="Зарегистрироваться" onClick={handleChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("Не срабатывает onClick, disabled = true", () => {
    const handleChange = jest.fn();
    render(
      <Button text="Зарегистрироваться" onClick={handleChange} disabled />
    );

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("Установили type", () => {
    render(<Button text="Зарегистрироваться" type={"submit"} />);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" })
    ).toHaveAttribute("type", "submit");
  });

  it("Snapshot", () => {
    const { container } = render(
      <Button text="Зарегистрироваться" type={"submit"} />
    );
    expect(container).toMatchSnapshot();
  });
});
