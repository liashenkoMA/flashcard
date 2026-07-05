import { fireEvent, render, screen } from "@testing-library/react";
import WritingPractice from "@/_components/WritingPractice/WritingPractice";

describe("WritingPractice component", () => {
  it("Рендерит пустой компонент", () => {
    render(<WritingPractice key="1" translate="Hello" />);

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("Ввод обновляет значение", () => {
    render(<WritingPractice key="1" translate="Hello" />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Hello" },
    });

    expect(input).toHaveValue("Hello");
  });

  it("Успех при правильном ответе", () => {
    render(<WritingPractice key="1" translate="Hello" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button.className).toContain("writingPractice__button_success");
  });

  it("Ошибка при неправильном ответе", () => {
    render(<WritingPractice key="1" translate="Hello" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "World" },
    });

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button.className).toContain("writingPractice__button_error");
  });

  it("Очищает поля при смене карточки", () => {
    const { rerender } = render(<WritingPractice key="1" translate="Hello" />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello" },
    });

    rerender(<WritingPractice key="2" translate="World" />);

    expect(screen.getByRole("textbox")).toHaveValue("");

    const button = screen.getByRole("button");

    expect(button.className).not.toContain("writingPractice__button_success");
    expect(button.className).not.toContain("writingPractice__button_error");
  });
});
