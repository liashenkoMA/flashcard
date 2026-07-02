import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/_components/ProfileDropdown/ProfileDropdown";
import authReducer from "@/_store/authSlice";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/api/server/authApi", () => ({
  logout: jest.fn(),
}));

jest.mock("@/_components/UI/Button/Button", () => {
  return function MockButton({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) {
    return <button onClick={onClick}>{children}</button>;
  };
});

jest.mock("@/_components/UI/LinkButton/LinkButton", () => {
  return function MockLinkButton({
    text,
    href,
  }: {
    text: string;
    href: string;
  }) {
    return <a href={href}>{text}</a>;
  };
});

function renderWithStore() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <ProfileDropdown user="Иван" />
      </Provider>,
    ),
  };
}

describe("ProfileDropdown component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("Рендерит пользователя", () => {
    renderWithStore();

    expect(screen.getByText("Иван")).toBeInTheDocument();
  });

  it("Открывает меню по клику на профиль", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    expect(screen.getByText("Главная")).toBeInTheDocument();
    expect(screen.getByText("Выйти")).toBeInTheDocument();
  });

  it("Открывает раздел Учить и показывает ссылки", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    fireEvent.click(screen.getByText("Учить"));

    expect(screen.getByText("Изучить катакану")).toBeInTheDocument();
    expect(screen.getByText("Учим слова")).toBeInTheDocument();
  });

  it("Открывает раздел Добавить", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    fireEvent.click(screen.getByText("Добавить"));

    expect(screen.getByText("Добавить кандзи")).toBeInTheDocument();
    expect(screen.getByText("Добавить слово")).toBeInTheDocument();
  });

  it("Открывает раздел Библиотека", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    fireEvent.click(screen.getByText("Библиотека"));

    expect(screen.getByText("Таблица азбук")).toBeInTheDocument();
    expect(screen.getByText("Все слова")).toBeInTheDocument();
  });

  it("Закрывает меню по Escape", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByTestId("profile-menu")).toHaveAttribute(
      "data-open",
      "false",
    );
  });

  it("Закрывает меню по клику вне", () => {
    renderWithStore();

    fireEvent.click(screen.getByText("Иван"));

    fireEvent.mouseDown(document.body);

    expect(screen.getByTestId("profile-menu")).toHaveAttribute(
      "data-open",
      "false",
    );
  });

  it("Snapshot", () => {
    const { container } = renderWithStore();

    expect(container).toMatchSnapshot();
  });
});
