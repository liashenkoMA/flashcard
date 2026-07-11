import AddKrWordForm from "@/_components/AddKrWordForm/AddKrWordForm";
import { KR_WORD_FORM_INPUTS } from "@/_constants/krWordAddForm.constant";
import { addKrWord, getKrWordsCategory } from "@/_utils/api/client/krWordsApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/krWordsApi", () => ({
  addKrWord: jest.fn(),
  getKrWordsCategory: jest.fn(),
}));

describe("Add Kr Word Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddKrWordForm />);

    for (const input of KR_WORD_FORM_INPUTS) {
      expect(
        screen.getByPlaceholderText(input.placeholder as string),
      ).toBeInTheDocument();
    }

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Ввод данных", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddKrWordForm />);

    const input = screen.getByPlaceholderText(
      KR_WORD_FORM_INPUTS[0].placeholder as string,
    );

    fireEvent.change(input, { target: { value: "안녕" } });

    expect(input).toHaveValue("안녕");
  });

  it("Показывает ошибки валидации", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddKrWordForm />);

    fireEvent.click(screen.getByText("Добавить"));

    expect(screen.getByText("Введите слово")).toBeInTheDocument();
    expect(screen.getByText("Введите перевод")).toBeInTheDocument();
  });

  it("Выбор категории из списка", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue(["еда", "машины"]);

    render(<AddKrWordForm />);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("Без категории");

    fireEvent.change(select, { target: { value: "еда" } });

    waitFor(() => {
      expect(select).toHaveValue("еда");
    });
  });

  it("Появляется инпут при новой категории", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddKrWordForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Новая категория?" },
    });

    expect(screen.getByText("Категория:")).toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    (addKrWord as jest.Mock).mockRejectedValueOnce(new Error("Ошибка сервера"));

    render(<AddKrWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(KR_WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "こんにちは" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KR_WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Ошибка сервера")).toBeInTheDocument();
  });

  it("Успешная отправка формы", async () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    (addKrWord as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddKrWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(KR_WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "안녕" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KR_WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Успешно добавлено")).toBeInTheDocument();
  });

  it("Snapshot", () => {
    (getKrWordsCategory as jest.Mock).mockResolvedValue([]);

    const { container } = render(<AddKrWordForm />);

    expect(container).toMatchSnapshot();
  });
});
