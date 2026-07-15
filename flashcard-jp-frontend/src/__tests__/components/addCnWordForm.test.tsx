import AddCnWordForm from "@/_components/AddCnWordForm/AddCnWordForm";
import { CN_WORD_FORM_INPUTS } from "@/_constants/cnWordAddForm.constant";
import { addCnWord, getCnWordsCategory } from "@/_utils/api/client/cnWordsApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/cnWordsApi", () => ({
  addCnWord: jest.fn(),
  getCnWordsCategory: jest.fn(),
}));

describe("Add Cn Word Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddCnWordForm />);

    for (const input of CN_WORD_FORM_INPUTS) {
      expect(
        screen.getByPlaceholderText(input.placeholder as string),
      ).toBeInTheDocument();
    }

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Ввод данных", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddCnWordForm />);

    const input = screen.getByPlaceholderText(
      CN_WORD_FORM_INPUTS[0].placeholder as string,
    );

    fireEvent.change(input, { target: { value: "你好" } });

    expect(input).toHaveValue("你好");
  });

  it("Показывает ошибки валидации", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddCnWordForm />);

    fireEvent.click(screen.getByText("Добавить"));

    expect(screen.getByText("Введите слово")).toBeInTheDocument();
    expect(screen.getByText("Введите перевод")).toBeInTheDocument();
    expect(
      screen.getByText("Введите транскрипцию (pinyin)"),
    ).toBeInTheDocument();
  });

  it("Выбор категории из списка", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue(["еда", "машины"]);

    render(<AddCnWordForm />);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("Без категории");

    fireEvent.change(select, { target: { value: "еда" } });

    waitFor(() => {
      expect(select).toHaveValue("еда");
    });
  });

  it("Появляется инпут при новой категории", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    render(<AddCnWordForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Новая категория?" },
    });

    expect(screen.getByText("Категория:")).toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    (addCnWord as jest.Mock).mockRejectedValueOnce(new Error("Ошибка сервера"));

    render(<AddCnWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "你好" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "nǐ hǎo" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[2].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Ошибка сервера")).toBeInTheDocument();
  });

  it("Успешная отправка формы", async () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    (addCnWord as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddCnWordForm />);

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[0].placeholder as string),
      { target: { value: "你好" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[1].placeholder as string),
      { target: { value: "nǐ hǎo" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(CN_WORD_FORM_INPUTS[2].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Успешно добавлено")).toBeInTheDocument();
  });

  it("Snapshot", () => {
    (getCnWordsCategory as jest.Mock).mockResolvedValue([]);

    const { container } = render(<AddCnWordForm />);

    expect(container).toMatchSnapshot();
  });
});
