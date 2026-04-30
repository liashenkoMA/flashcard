import LoginForm from "@/_components/LoginForm/LoginForm";
import { LOGIN_FORM_INPUTS } from "@/_constants/loginForm.constant";
import { login } from "@/_utils/authApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/authApi", () => ({
  login: jest.fn(),
}));

const pushMock = jest.fn();

const setAuthStateMock = jest.fn();
const setUserNameMock = jest.fn();

jest.mock("@/_contexts/authContext/useAuthContext", () => ({
  useAuthContext: () => ({
    setAuthState: setAuthStateMock,
    setUserName: setUserNameMock,
  }),
}));

const setModalStateMock = jest.fn();

jest.mock("@/_contexts/authModalContext/useAuthModalContext", () => ({
  useAuthModalContext: () => ({
    setModalState: setModalStateMock,
  }),
}));

describe("Login Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("Рендер всех полей", () => {
    render(<LoginForm />);

    LOGIN_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);
      expect(field).toBeInTheDocument();
    });
  });

  it("Вводим данные, handleChange", () => {
    render(<LoginForm />);

    const input = screen.getByPlaceholderText("Введите пароль");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Не заполнены данные, кнопка submit заблокирована", () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /Войти/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });

  it("Ошибка выводится, passwordMismatch = true", () => {
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);
    const duplicateInput = screen.getByPlaceholderText(/Повторите пароль/i);

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(duplicateInput, { target: { value: "456" } });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Ошибка не выводится, passwordMismatch = false", () => {
    const { container } = render(<LoginForm />);

    expect(
      container.getElementsByClassName("loginform__errors")[0],
    ).toHaveTextContent("");
  });

  it("Вызывает login и перенаправляет после успешного входа", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ name: "Иван" });

    render(<LoginForm />);

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
      expect(login).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("Отображаем ошибку сервера, если login завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<LoginForm />);

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
    const { container } = render(<LoginForm />);
    expect(container).toMatchSnapshot();
  });
});
