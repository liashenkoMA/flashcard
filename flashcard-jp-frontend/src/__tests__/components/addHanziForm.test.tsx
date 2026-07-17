import AddHanziForm from "@/_components/AddHanziForm/AddHanziForm";
import { HANZI_FORM_INPUTS } from "@/_constants/hanziAddForm.constant";
import { addHanzi, getHanziCategory } from "@/_utils/api/client/hanziApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/hanziApi", () => ({
  addHanzi: jest.fn(),
  getHanziCategory: jest.fn(),
}));

describe("Add Hanzi Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    render(<AddHanziForm />);

    for (const input of HANZI_FORM_INPUTS) {
      expect(
        screen.getByPlaceholderText(input.placeholder as string),
      ).toBeInTheDocument();
    }

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Ввод данных", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    render(<AddHanziForm />);

    const input = screen.getByPlaceholderText(
      HANZI_FORM_INPUTS[0].placeholder as string,
    );

    fireEvent.change(input, { target: { value: "你好" } });

    expect(input).toHaveValue("你好");
  });

  it("Показывает ошибки валидации", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    render(<AddHanziForm />);

    fireEvent.click(screen.getByText("Добавить"));

    expect(screen.getByText("Введите ханзи")).toBeInTheDocument();
    expect(screen.getByText("Введите перевод")).toBeInTheDocument();
    expect(
      screen.getByText("Введите транскрипцию (pinyin)"),
    ).toBeInTheDocument();
  });

  it("Выбор категории из списка", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue(["еда", "машины"]);

    render(<AddHanziForm />);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("Без категории");

    fireEvent.change(select, { target: { value: "еда" } });

    waitFor(() => {
      expect(select).toHaveValue("еда");
    });
  });

  it("Появляется инпут при новой категории", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    render(<AddHanziForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Новая категория?" },
    });

    expect(screen.getByText("Категория:")).toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    (addHanzi as jest.Mock).mockRejectedValueOnce(new Error("Ошибка сервера"));

    render(<AddHanziForm />);

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[0].placeholder as string),
      { target: { value: "你好" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[1].placeholder as string),
      { target: { value: "nǐ hǎo" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[2].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Ошибка сервера")).toBeInTheDocument();
  });

  it("Успешная отправка формы", async () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    (addHanzi as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddHanziForm />);

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[0].placeholder as string),
      { target: { value: "你好" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[1].placeholder as string),
      { target: { value: "nǐ hǎo" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(HANZI_FORM_INPUTS[2].placeholder as string),
      { target: { value: "привет" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText("Успешно добавлено")).toBeInTheDocument();
  });

  it("Snapshot", () => {
    (getHanziCategory as jest.Mock).mockResolvedValue([]);

    const { container } = render(<AddHanziForm />);

    expect(container).toMatchSnapshot();
  });
});
