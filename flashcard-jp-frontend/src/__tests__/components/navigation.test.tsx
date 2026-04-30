import Navigation from "@/_components/Navigation/Navigation";
import { fireEvent, render, screen } from "@testing-library/react";

const setModalStateMock = jest.fn();
const setAuthStateMock = jest.fn();

jest.mock("@/_contexts/authModalContext/useAuthModalContext", () => ({
  useAuthModalContext: () => ({
    setModalState: setModalStateMock,
  }),
}));

jest.mock("@/_contexts/authContext/useAuthContext", () => ({
  useAuthContext: () => ({
    setAuthState: setAuthStateMock,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Navigation component", () => {
  beforeEach(() => {
    setModalStateMock.mockClear();

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it("Рендер меню", () => {
    render(<Navigation />);
    expect(screen.getByText("Войти")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
  });

  it("Открытие и закрытие меню по клику", () => {
    render(<Navigation />);

    const menuButton = screen.getByTestId("menu-toggle");

    expect(menuButton).toHaveClass("navigation__button_type_open");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveClass("navigation__button_type_close");
  });

  it("Войти передает в стейт mode: login", () => {
    render(<Navigation />);

    fireEvent.click(screen.getByText("Войти"));

    expect(setModalStateMock).toHaveBeenCalledTimes(1);
    expect(setModalStateMock).toHaveBeenCalledWith({ mode: "login" });
  });

  it("Зарегистрироваться передает в стейт mode: register", () => {
    render(<Navigation />);

    fireEvent.click(screen.getByText("Зарегистрироваться"));

    expect(setModalStateMock).toHaveBeenCalledTimes(1);
    expect(setModalStateMock).toHaveBeenCalledWith({ mode: "register" });
  });

  it("После нажатия на любую кнопку меню закрывается", () => {
    render(<Navigation />);

    const menuButton = screen.getByTestId("menu-toggle");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveClass("navigation__button_type_close");

    fireEvent.click(screen.getByText("Войти"));

    expect(menuButton).toHaveClass("navigation__button_type_open");
  });

  it("Snapshot", () => {
    const { container } = render(<Navigation />);
    expect(container).toMatchSnapshot();
  });
});
