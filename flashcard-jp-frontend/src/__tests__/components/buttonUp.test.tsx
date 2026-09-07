import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ButtonUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.scrollTo = jest.fn();
  });

  it("Изначально скрыта", () => {
    render(<ButtonUp />);

    expect(screen.getByRole("button")).toHaveClass(
      "buttonup__button_type_hide",
    );
  });

  it("Показывается после скролла", () => {
    render(<ButtonUp />);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 700,
    });

    fireEvent.scroll(window);

    expect(screen.getByRole("button")).not.toHaveClass(
      "buttonup__button_type_hide",
    );
  });

  it("Скрывает кнопку при скролле меньше 600px", () => {
    render(<ButtonUp />);

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

    expect(screen.getByRole("button")).toHaveClass(
      "buttonup__button_type_hide",
    );
  });

  it("При клике прокручивает страницу наверх", () => {
    render(<ButtonUp />);

    fireEvent.click(screen.getByRole("button"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
