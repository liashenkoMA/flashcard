import AuthModal from "@/_components/AuthModal/AuthModal";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/_store/modalSlice";
import authReducer from "@/_store/authSlice";
import { RootState } from "@/_store/store";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

function renderWithStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: {
      modal: modalReducer,
      auth: authReducer,
    },
    preloadedState: preloadedState as RootState,
  });

  return render(
    <Provider store={store}>
      <AuthModal />
    </Provider>,
  );
}

describe("AuthModal component", () => {
  it("Не отображается, если mode === null", () => {
    renderWithStore({
      modal: { mode: null },
    });

    expect(screen.queryByText("Вход")).not.toBeInTheDocument();
    expect(screen.queryByText("Регистрация")).not.toBeInTheDocument();
  });

  it("Отображается форма логина, mode = login", () => {
    renderWithStore({
      modal: { mode: "login" },
    });

    expect(screen.getByText("Вход")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });

  it("Отображается форма регистрации, mode = register", () => {
    renderWithStore({
      modal: { mode: "register" },
    });

    expect(screen.getByText("Регистрация")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
  });
});
