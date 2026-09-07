import ProfileForm from "@/_components/ProfileForm/ProfileForm";
import { PROFILE_FORM_INPUTS } from "@/_constants/profileForm.constant";
import { updateUser } from "@/_utils/api/client/userApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/_store/modalSlice";
import authReducer from "@/_store/authSlice";

const mockUser = {
  name: "Иван",
  email: "test@mail.ru",
  subscription: {
    active: false,
    expiresAt: null,
  },
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/api/client/userApi", () => ({
  updateUser: jest.fn(),
}));

const pushMock = jest.fn();

function renderWithStore() {
  const store = configureStore({
    reducer: {
      modal: modalReducer,
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: mockUser,
        usage: null,
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <ProfileForm />
      </Provider>,
    ),
  };
}

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
  });

  it("Рендер всех полей", () => {
    renderWithStore();

    for (const input of PROFILE_FORM_INPUTS) {
      const field = screen.getByPlaceholderText(input.placeholder as string);
      expect(field).toBeInTheDocument();
    }
  });

  it("Заполняет форму данными пользователя из Redux", () => {
    renderWithStore();

    const inputName = screen.getByPlaceholderText("Иван");
    const inputEmail = screen.getByPlaceholderText("ivan@mail.ru");

    expect(inputName).toHaveValue("Иван");
    expect(inputEmail).toHaveValue("test@mail.ru");
  });

  it("Вводим данные, handleChange", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText("ivan@mail.ru");

    fireEvent.change(input, {
      target: { value: "123" },
    });

    expect(input).toHaveValue("123");
  });

  it("Ошибка выводится, passwordMismatch = true", () => {
    renderWithStore();

    const passwordInput = screen.getByPlaceholderText("Введите новый пароль");
    const duplicateInput = screen.getByPlaceholderText(
      "Повторите новый пароль",
    );

    fireEvent.change(passwordInput, {
      target: { value: "123" },
    });

    fireEvent.change(duplicateInput, {
      target: { value: "456" },
    });

    expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
  });

  it("Ошибка не выводится, passwordMismatch = false", () => {
    renderWithStore();

    const passwordInput = screen.getByPlaceholderText("Введите новый пароль");
    const duplicateInput = screen.getByPlaceholderText(
      "Повторите новый пароль",
    );

    fireEvent.change(passwordInput, {
      target: { value: "123" },
    });

    fireEvent.change(duplicateInput, {
      target: { value: "123" },
    });

    const error = screen.queryByText("Пароли не совпадают.");

    expect(error).not.toBeInTheDocument();
  });

  it("Обновляет пользователя и сохраняет новые данные в Redux", async () => {
    (updateUser as jest.Mock).mockResolvedValueOnce({
      name: "Новое имя",
      email: "new@test.ru",
    });

    const { store } = renderWithStore();

    const nameInput = screen.getByPlaceholderText("Иван");
    const emailInput = screen.getByPlaceholderText("ivan@mail.ru");
    const currentPassword = screen.getByPlaceholderText(
      "Подтвердите изменения",
    );

    fireEvent.change(nameInput, {
      target: { value: "Новое имя" },
    });

    fireEvent.change(emailInput, {
      target: { value: "new@test.ru" },
    });

    fireEvent.change(currentPassword, {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Изменить профиль"));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(store.getState().auth.user).toEqual({
        name: "Новое имя",
        email: "new@test.ru",
        subscription: {
          active: false,
          expiresAt: null,
        },
      });
    });
  });

  it("Отображает ошибку сервера, если updateUser завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (updateUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderWithStore();

    const currentPassword = screen.getByPlaceholderText(
      "Подтвердите изменения",
    );

    fireEvent.change(currentPassword, {
      target: { value: "123" },
    });

    const submitBtn = screen.getByText("Изменить профиль");

    fireEvent.click(submitBtn);

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Открывает и закрывает модальное окно удаления", () => {
    renderWithStore();

    const deleteBtn = screen.getByText("Удалить профиль");

    fireEvent.click(deleteBtn);

    const modal = screen.getByText("Вы уверены?");

    expect(modal).toBeInTheDocument();

    const closeDeleteModal = screen.getByText("Нет");

    fireEvent.click(closeDeleteModal);

    expect(modal).not.toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = renderWithStore();

    expect(container).toMatchSnapshot();
  });
});
