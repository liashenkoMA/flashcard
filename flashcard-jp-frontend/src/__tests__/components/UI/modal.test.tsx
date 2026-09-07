import Modal from "@/_components/UI/Portal/Modal";
import { fireEvent, render, screen } from "@testing-library/react";

const onCloseMock = jest.fn();

describe("Modal component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Не рендерится, если isOpen = false", () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    expect(screen.queryByText("Контент")).not.toBeInTheDocument();
  });

  it("Рендерится, если isOpen = true, и отображает title, children", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    expect(screen.getByText("Заголовок")).toBeInTheDocument();
    expect(screen.getByText("Контент")).toBeInTheDocument();
  });

  it("Нажатие Escape вызывает onClose", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Другие клавиши не вызывают onClose", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    fireEvent.keyDown(window, { key: "Enter", code: "Enter" });

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("Копка закрытия вызывает onClose", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    const button = screen.getByRole("button", { name: /закрыть/i });

    fireEvent.click(button);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Клик по overlay вызывает onClose", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    const overlay = screen.getByTestId("overlay");

    fireEvent.pointerDown(overlay);
    fireEvent.pointerUp(overlay);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("Нажатие в форме и отпускание на overlay не вызывае onClose", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Заголовок">
        <div>Контент</div>
      </Modal>,
    );

    const overlay = screen.getByTestId("overlay");
    const content = screen.getByText("Контент");

    fireEvent.pointerDown(content);
    fireEvent.pointerUp(overlay);

    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
