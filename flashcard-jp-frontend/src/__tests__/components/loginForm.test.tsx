import LoginForm from "@/_components/LoginForm/LoginForm";
import { LOGIN_FORM_INPUTS } from "@/_constants/loginForm.constant";
import { login } from "@/_utils/api/server/authApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/_store/modalSlice";
import authReducer from "@/_store/authSlice";
import { RootState } from "@/_store/store";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/server/authApi", () => ({
  login: jest.fn(),
}));

const pushMock = jest.fn();

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
        <LoginForm />
      </Provider>,
    ),
  };
}

describe("Login Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("Рендер всех полей", () => {
    renderWithStore();

    LOGIN_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);
      expect(field).toBeInTheDocument();
    });
  });

  it("Ввод данных работает", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText("Введите пароль");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Кнопка submit заблокирована при пустых данных", () => {
    renderWithStore();

    const button = screen.getByRole("button", { name: /Войти/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });

  it("Ошибка при несовпадении паролей", () => {
    renderWithStore();

    fireEvent.change(screen.getByPlaceholderText(/Введите пароль/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Повторите пароль/i), {
      target: { value: "456" },
    });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Нет ошибки если пароли совпадают", () => {
    const { container } = renderWithStore();

    expect(
      container.getElementsByClassName("loginform__errors")[0],
    ).toHaveTextContent("");
  });

  it("Успешный логин → обновление store + редирект", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ name: "Иван" });

    const { store } = renderWithStore();

    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "ivan@mail.ru" },
    });
    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });

    const state = store.getState();

    expect(state.auth.userName).toBe("Иван");
    expect(state.modal.mode).toBeNull();

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("Ошибка сервера отображается", async () => {
    const errorMessage = "Ошибка сервера";

    (login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderWithStore();

    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "ivan@mail.ru" },
    });
    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Войти"));

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("Snapshot", () => {
    const { container } = renderWithStore();
    expect(container).toMatchSnapshot();
  });
});
