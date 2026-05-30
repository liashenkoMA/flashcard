import { fireEvent, render, screen } from "@testing-library/react";
import Button from "@/_components/UI/Button/Button";

describe("Button component", () => {
  it("Рендерит button, правильный текст", () => {
    render(<Button>Зарегистрироваться</Button>);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" }),
    ).toBeInTheDocument();
  });

  it("Срабатывает onClick, disabled = false", () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Зарегистрироваться</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Зарегистрироваться" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("Не срабатывает onClick, disabled = true", () => {
    const handleClick = jest.fn();

    render(
      <Button onClick={handleClick} disabled>
        Зарегистрироваться
      </Button>,
    );

    const button = screen.getByRole("button", {
      name: "Зарегистрироваться",
    });

    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("Установили type", () => {
    render(<Button type="submit">Зарегистрироваться</Button>);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" }),
    ).toHaveAttribute("type", "submit");
  });

  it("Snapshot", () => {
    const { container } = render(
      <Button type="submit">Зарегистрироваться</Button>,
    );

    expect(container).toMatchSnapshot();
  });
});
