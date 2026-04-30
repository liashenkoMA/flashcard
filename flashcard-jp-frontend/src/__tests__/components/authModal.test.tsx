import AuthModal from "@/_components/AuthModal/AuthModal";
import { useAuthModalContext } from "@/_contexts/authModalContext/useAuthModalContext";
import { render, screen } from "@testing-library/react";

const setModalStateMock = jest.fn();

jest.mock("@/_contexts/authModalContext/useAuthModalContext");

const mockUseAuthModalContext = useAuthModalContext as jest.MockedFunction<
  typeof useAuthModalContext
>;

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const setAuthStateMock = jest.fn();

jest.mock("@/_contexts/authContext/useAuthContext", () => ({
  useAuthContext: () => ({
    setAuthState: setAuthStateMock,
  }),
}));

describe("AuthModal component", () => {
  beforeEach(() => {
    mockUseAuthModalContext.mockReturnValue({
      modalState: { mode: null },
      setModalState: setModalStateMock,
    });

    jest.clearAllMocks();
  });

  it("Не отображается, если mode === null", () => {
    render(<AuthModal />);
    expect(screen.queryByText("Вход")).not.toBeInTheDocument();
    expect(screen.queryByText("Регистрация")).not.toBeInTheDocument();
  });

  it("Отображается форма логина, mode = login", () => {
    mockUseAuthModalContext.mockReturnValue({
      modalState: { mode: "login" },
      setModalState: setModalStateMock,
    });

    render(<AuthModal />);

    expect(screen.getByText("Вход")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });

  it("Отображается форма регистрации, mode = register", () => {
    mockUseAuthModalContext.mockReturnValue({
      modalState: { mode: "register" },
      setModalState: setModalStateMock,
    });

    render(<AuthModal />);

    expect(screen.getByText("Регистрация")).toBeInTheDocument();
    expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
  });
});
