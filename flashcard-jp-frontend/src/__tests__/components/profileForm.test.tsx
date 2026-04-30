import ProfileForm from "@/_components/ProfileForm/ProfileForm";
import { PROFILE_FORM_INPUTS } from "@/_constants/profileForm.constant";
import { getUser, updateUser } from "@/_utils/userApi";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/userApi", () => ({
  getUser: jest.fn().mockResolvedValue({
    name: "Иван",
    email: "test@mail.ru",
  }),
  updateUser: jest.fn(),
}));

const pushMock = jest.fn();

describe("Profile Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it("Рендер всех полей", async () => {
    render(<ProfileForm />);

    for (const input of PROFILE_FORM_INPUTS) {
      const field = await screen.findByPlaceholderText(
        input.placeholder as string
      );
      expect(field).toBeInTheDocument();
    }
  });

  it("Заполняет форму данными, useEffect", async () => {
    render(<ProfileForm />);

    const inputName = await screen.findByPlaceholderText("Иван");
    const inputEmail = await screen.findByPlaceholderText("ivan@mail.ru");

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(inputName).toHaveValue("Иван");
    expect(inputEmail).toHaveValue("test@mail.ru");
  });

  it("Показывает текст Загрузка данных... до гидратации", () => {
    render(<ProfileForm />);
    const loadingText = screen.getByText("Загрузка данных...");
    expect(loadingText).toBeInTheDocument();
  });

  it("Вводим данные, handleChange", async () => {
    render(<ProfileForm />);

    const input = await screen.findByPlaceholderText("ivan@mail.ru");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Ошибка выводится, passwordMismatch = true", async () => {
    render(<ProfileForm />);

    const passwordInput = await screen.findByPlaceholderText("Введите пароль");
    const duplicateInput = await screen.findByPlaceholderText(
      "Повторите пароль"
    );

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(duplicateInput, { target: { value: "456" } });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Ошибка не выводится, passwordMismatch = false", async () => {
    render(<ProfileForm />);

    const passwordInput = await screen.findByPlaceholderText("Введите пароль");
    const duplicateInput = await screen.findByPlaceholderText(
      "Повторите пароль"
    );

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(duplicateInput, { target: { value: "123" } });

    const error = screen.queryByText("Пароли не совпадают.");
    expect(error).not.toBeInTheDocument();
  });

  it("Отображает ошибку сервера, если updateUser завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (updateUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<ProfileForm />);

    const currentPassword = await screen.findByPlaceholderText(
      "Подтвердите изменения"
    );
    fireEvent.change(currentPassword, { target: { value: "123" } });

    const submitBtn = await screen.findByText("Изменить профиль");
    fireEvent.click(submitBtn);

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Открывает и закрывает модальное окно удаления", async () => {
    render(<ProfileForm />);

    const deleteBtn = await screen.findByText("Удалить профиль");

    fireEvent.click(deleteBtn);

    const modal = screen.getByText("Вы уверены?");
    expect(modal).toBeInTheDocument();

    const closeDeleteModal = screen.getByText("Нет");
    fireEvent.click(closeDeleteModal);
    expect(modal).not.toBeInTheDocument();
  });

  it("Snapshot", async () => {
    const { container } = render(<ProfileForm />);
    await expect(container).toMatchSnapshot();
  });
});
