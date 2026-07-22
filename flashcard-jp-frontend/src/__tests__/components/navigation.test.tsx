import Navigation from "@/_components/Navigation/Navigation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/_store/modalSlice";
import authReducer from "@/_store/authSlice";
import { RootState } from "@/_store/store";
import { getUser } from "@/_utils/api/client/userApi";

const mockUser = {
  name: "Иван",
  email: "test@test.ru",
  subscription: {
    active: false,
    expiresAt: null,
  },
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/api/client/userApi", () => ({
  getUser: jest.fn().mockRejectedValue(new Error("no user")),
}));

jest.mock(
  "@/_components/ProfileDropdown/ProfileDropdown",
  () =>
    function ProfileDropdown() {
      return <div data-testid="profile-dropdown" />;
    },
);

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
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендерит кнопки входа и регистрации если пользователь не авторизован", () => {
    renderWithStore({
      auth: { user: null },
    });

    expect(screen.getByText("Войти")).toBeInTheDocument();
    expect(screen.getByText("Регистрация")).toBeInTheDocument();
  });

  it("Войти - меняет modal.mode = login", () => {
    const { store } = renderWithStore({
      auth: { user: null },
    });

    fireEvent.click(screen.getByText("Войти"));

    expect(store.getState().modal.mode).toBe("login");
  });

  it("Регистрация - меняет modal.mode = register", () => {
    const { store } = renderWithStore({
      auth: { user: null },
    });

    fireEvent.click(screen.getByText("Регистрация"));

    expect(store.getState().modal.mode).toBe("register");
  });

  it("Если пользователь есть — отображает ProfileDropdown", () => {
    renderWithStore({
      auth: { user: mockUser },
    });

    expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
  });

  it("Если пользователя нет — получает пользователя и сохраняет его", async () => {
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    const { store } = renderWithStore({
      auth: { user: null },
    });

    await waitFor(() => {
      expect(getUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(store.getState().auth.user).toEqual(mockUser);
    });
  });

  it("Snapshot", () => {
    const { container } = renderWithStore({
      auth: { user: null },
    });

    expect(container).toMatchSnapshot();
  });
});
