import RegisterForm from "@/_components/RegisterForm/RegisterForm";
import { REGISTER_FORM_INPUTS } from "@/_constants/registerForm.constant";
import { createUser } from "@/_utils/client/userApi";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/_utils/userApi", () => ({
  createUser: jest.fn(),
}));

describe("Register Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<RegisterForm />);

    REGISTER_FORM_INPUTS.forEach((input) => {
      const field = screen.getByPlaceholderText(input.placeholder as string);
      expect(field).toBeInTheDocument();
    });
  });

  it("Вводим данные, handleChange", () => {
    render(<RegisterForm />);

    const input = screen.getByPlaceholderText("Введите пароль");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Не заполнены данные, кнопка submit заблокирована", () => {
    render(<RegisterForm />);

    const button = screen.getByRole("button", { name: /Зарегистрироваться/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
  });

  it("Ошибка выводится, passwordMismatch = true", () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);
    const duplicateInput = screen.getByPlaceholderText(/Повторите пароль/i);

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(duplicateInput, { target: { value: "456" } });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Ошибка не выводится, passwordMismatch = false", () => {
    const { container } = render(<RegisterForm />);

    expect(
      container.getElementsByClassName("registerform__errors")[0]
    ).toHaveTextContent("");
  });

  it("Отображаем ошибку сервера, если createUser завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (createUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Иван"), {
      target: { value: "Иван" },
    });
    fireEvent.change(screen.getByPlaceholderText("ivan@mail.ru"), {
      target: { value: "ivan@mail.ru" },
    });
    fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторите пароль"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Зарегистрироваться"));

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<RegisterForm />);
    expect(container).toMatchSnapshot();
  });
});
