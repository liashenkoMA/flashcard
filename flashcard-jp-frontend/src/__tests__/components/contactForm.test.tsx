import ContactForm from "@/_components/ContactForm/ContactForm";
import { telegramMessage } from "@/_utils/api/client/telegramApi";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/_utils/api/client/telegramApi", () => ({
  telegramMessage: jest.fn(),
}));

describe("Contact Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");
    const textarea = screen.getByPlaceholderText("Введите ваше сообщение");

    expect(inputName).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
  });

  it("Вводим данные, handleChange", () => {
    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");
    const textarea = screen.getByPlaceholderText("Введите ваше сообщение");

    fireEvent.change(inputName, {
      target: { value: "Иван" },
    });

    fireEvent.change(textarea, {
      target: { value: "Тестовое сообщение" },
    });

    expect(inputName).toHaveValue("Иван");
    expect(textarea).toHaveValue("Тестовое сообщение");
  });

  it("Ошибка выводится, имя меньше 2 символов", () => {
    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");

    fireEvent.change(inputName, {
      target: { value: "И" },
    });

    const submitBtn = screen.getByText("Отправить сообщение");
    fireEvent.click(submitBtn);

    expect(
      screen.getByText("Имя должно быть не короче 2 символов"),
    ).toBeInTheDocument();
  });

  it("Ошибка выводится, сообщение пустое", () => {
    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");

    fireEvent.change(inputName, {
      target: { value: "Иван" },
    });

    const submitBtn = screen.getByText("Отправить сообщение");
    fireEvent.click(submitBtn);

    expect(screen.getByText("Введите сообщение")).toBeInTheDocument();
  });

  it("Успешная отправка формы", async () => {
    (telegramMessage as jest.Mock).mockResolvedValueOnce({});

    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");
    const textarea = screen.getByPlaceholderText("Введите ваше сообщение");

    fireEvent.change(inputName, {
      target: { value: "Иван" },
    });

    fireEvent.change(textarea, {
      target: { value: "Тестовое сообщение" },
    });

    const submitBtn = screen.getByText("Отправить сообщение");
    fireEvent.click(submitBtn);

    expect(telegramMessage).toHaveBeenCalledTimes(1);
    expect(telegramMessage).toHaveBeenCalledWith({
      name: "Иван",
      text: "Тестовое сообщение",
    });
  });

  it("Отображает ошибку сервера, если telegramMessage завершился с ошибкой", async () => {
    const errorMessage = "Ошибка сервера";

    (telegramMessage as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");
    const textarea = screen.getByPlaceholderText("Введите ваше сообщение");

    fireEvent.change(inputName, {
      target: { value: "Иван" },
    });

    fireEvent.change(textarea, {
      target: { value: "Тестовое сообщение" },
    });

    const submitBtn = screen.getByText("Отправить сообщение");
    fireEvent.click(submitBtn);

    const errorText = await screen.findByText(errorMessage);

    expect(errorText).toBeInTheDocument();
  });

  it("Кнопка заблокирована во время отправки формы", async () => {
    (telegramMessage as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );

    render(<ContactForm />);

    const inputName = screen.getByPlaceholderText("Иван");
    const textarea = screen.getByPlaceholderText("Введите ваше сообщение");

    fireEvent.change(inputName, {
      target: { value: "Иван" },
    });

    fireEvent.change(textarea, {
      target: { value: "Тестовое сообщение" },
    });

    const submitBtn = screen.getByText("Отправить сообщение");

    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
  });

  it("Snapshot", async () => {
    const { container } = render(<ContactForm />);
    await expect(container).toMatchSnapshot();
  });
});
