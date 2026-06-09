import AddWordForm from "@/_components/AddWordForm/AddWordForm";
import { WORD_FORM_INPUTS } from "@/_constants/wordAddForm.constant";
import { addWord, getWordsCategory } from "@/_utils/api/client/wordApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/wordApi", () => ({
  addWord: jest.fn(),
  getWordsCategory: jest.fn(),
}));

describe("Add Word Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddWordForm />);

    for (const input of WORD_FORM_INPUTS) {
      expect(
        screen.getByPlaceholderText(input.placeholder as string),
      ).toBeInTheDocument();
    }

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Ввод данных", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddWordForm />);

    const input = screen.getByPlaceholderText(
      WORD_FORM_INPUTS[0].placeholder as string,
    );

    fireEvent.change(input, { target: { value: "こんにちは" } });

    expect(input).toHaveValue("こんにちは");
  });

  it("Показывает ошибки валидации", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddWordForm />);

    fireEvent.click(screen.getByText("Добавить"));

    expect(screen.getByText("Введите слово")).toBeInTheDocument();
    expect(screen.getByText("Введите перевод")).toBeInTheDocument();
  });

  it("Выбор категории из списка", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue(["еда", "машины"]);

    render(<AddWordForm />);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("Без категории");

    fireEvent.change(select, { target: { value: "еда" } });

    waitFor(() => {
      expect(select).toHaveValue("еда");
    });
  });

  it("Появляется инпут при новой категории", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddWordForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Новая категория?" },
    });

    expect(screen.getByText("Категория:")).toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    (addWord as jest.Mock).mockRejectedValueOnce(new Error("Ошибка сервера"));

    render(<AddWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "こんにちは" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Ошибка сервера")).toBeInTheDocument();
  });

  it("Успешная отправка формы", async () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    (addWord as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "こんにちは" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Успешно добавлено")).toBeInTheDocument();
  });

  it("Snapshot", () => {
    (getWordsCategory as jest.Mock).mockResolvedValue([]);

    const { container } = render(<AddWordForm />);

    expect(container).toMatchSnapshot();
  });
});
