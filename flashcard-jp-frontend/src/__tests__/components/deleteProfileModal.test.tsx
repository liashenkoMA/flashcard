import DeleteProfileModule from "@/_components/DeleteProfileModal/DeleteProfileModal";
import { deleteUser } from "@/_utils/server/authApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/_utils/authApi", () => ({
  deleteUser: jest.fn(),
}));

const pushMock = jest.fn();

describe("Delete Profile modal component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("Рендерит модалку, когда isOpen=true", () => {
    render(<DeleteProfileModule isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText("Вы уверены?")).toBeInTheDocument();
  });

  it("Не рендерит модалку, когда isOpen=false", () => {
    render(<DeleteProfileModule isOpen={false} onClose={jest.fn()} />);

    expect(screen.queryByText("Вы уверены?")).not.toBeInTheDocument();
  });

  it("Вызывает onClose при клике 'Нет'", () => {
    const onCloseMock = jest.fn();

    render(<DeleteProfileModule isOpen={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByText("Нет"));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Вызывает deleteUser и перенаправляет после успешного удаления", async () => {
    (deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

    render(<DeleteProfileModule isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByText("Да"));

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("Отображаем ошибку сервера, если deleteUser завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (deleteUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<DeleteProfileModule isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(screen.getByText("Да"));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
