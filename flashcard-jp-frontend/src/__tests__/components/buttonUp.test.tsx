import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ButtonUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: jest.fn(),
    });
  });

  it("Рендерит кнопку", () => {
    render(<ButtonUp />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("По умолчанию кнопка скрыта", () => {
    const { container } = render(<ButtonUp />);

    const button = container.querySelector("button");

    expect(button?.className).toContain("buttonup__button_type_hide");
  });

  it("Показывает кнопку при скролле больше 600px", () => {
    const { container } = render(<ButtonUp />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 700,
    });

    fireEvent.scroll(window);

    const button = container.querySelector("button");

    expect(button?.className).not.toContain("buttonup__button_type_hide");
  });

  it("Скрывает кнопку при скролле меньше 600px", () => {
    const { container } = render(<ButtonUp />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 700,
    });

    fireEvent.scroll(window);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 100,
    });

    fireEvent.scroll(window);

    const button = container.querySelector("button");

    expect(button?.className).toContain("buttonup__button_type_hide");
  });

  it("Вызывает scrollTo при клике", () => {
    render(<ButtonUp />);

    fireEvent.click(screen.getByRole("button"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
