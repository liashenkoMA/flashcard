import Navigation from "@/_components/Navigation/Navigation";
import { fireEvent, render, screen } from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/_store/modalSlice";
import authReducer from "@/_store/authSlice";
import { RootState } from "@/_store/store";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/api/client/userApi", () => ({
  getUser: jest.fn().mockRejectedValue(new Error("no user")),
}));

function renderWithStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: {
      modal: modalReducer,
      auth: authReducer,
    },
    preloadedState: preloadedState as RootState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <Navigation />
      </Provider>,
    ),
  };
}

describe("Navigation component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер меню", () => {
    renderWithStore({
      auth: { userName: "" },
    });

    expect(screen.getByText("Войти")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
  });

  it("Открытие и закрытие меню по клику", () => {
    renderWithStore({
      auth: { userName: "" },
    });

    const menuButton = screen.getByTestId("menu-toggle");

    expect(menuButton).toHaveClass("navigation__button_type_open");

    fireEvent.click(menuButton);

    expect(menuButton).toHaveClass("navigation__button_type_close");
  });

  it("Войти → меняет modal.mode = login", () => {
    const { store } = renderWithStore({
      auth: { userName: "" },
    });

    fireEvent.click(screen.getByText("Войти"));

    const state = store.getState();

    expect(state.modal.mode).toBe("login");
  });

  it("Зарегистрироваться → modal.mode = register", () => {
    const { store } = renderWithStore({
      auth: { userName: "" },
    });

    fireEvent.click(screen.getByText("Зарегистрироваться"));

    const state = store.getState();

    expect(state.modal.mode).toBe("register");
  });

  it("После клика меню закрывается", () => {
    renderWithStore({
      auth: { userName: "" },
    });

    const menuButton = screen.getByTestId("menu-toggle");

    fireEvent.click(menuButton);
    expect(menuButton).toHaveClass("navigation__button_type_close");

    fireEvent.click(screen.getByText("Войти"));

    expect(menuButton).toHaveClass("navigation__button_type_open");
  });

  it("Если пользователь есть — показывается личный кабинет", () => {
    renderWithStore({
      auth: { userName: "Иван" },
    });

    expect(screen.getByText("Личный кабинет")).toBeInTheDocument();
    expect(screen.getByText("Выйти")).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = renderWithStore({
      auth: { userName: "" },
    });

    expect(container).toMatchSnapshot();
  });
});
