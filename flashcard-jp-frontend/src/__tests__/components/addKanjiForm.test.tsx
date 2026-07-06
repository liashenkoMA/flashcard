import AddKanjiForm from "@/_components/AddKanjiForm/AddKanjiForm";
import { KANJI_FORM_INPUTS } from "@/_constants/kanjiAddFrom.constant";
import { addKanji } from "@/_utils/api/client/kanjiApi";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/_utils/api/client/kanjiApi", () => ({
  addKanji: jest.fn(),
}));

describe("Add Kanji Form component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Рендер всех полей", () => {
    render(<AddKanjiForm />);

    for (const input of KANJI_FORM_INPUTS) {
      const field = screen.getByPlaceholderText(input.placeholder as string);

      expect(field).toBeInTheDocument();
    }

    expect(screen.getByLabelText(/Выберите уровень/i)).toBeInTheDocument();
  });

  it("Изменение уровня (select)", () => {
    render(<AddKanjiForm />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "N3" } });

    expect(select).toHaveValue("N3");
  });

  it("Вводим данные, handleChange", () => {
    render(<AddKanjiForm />);

    const input = screen.getByPlaceholderText(
      KANJI_FORM_INPUTS[0].placeholder as string,
    );

    fireEvent.change(input, {
      target: { value: "日" },
    });

    expect(input).toHaveValue("日");
  });

  it("Показывает ошибку валидации, если форма пустая", () => {
    render(<AddKanjiForm />);

    const button = screen.getByRole("button", { name: /Добавить/i });

    fireEvent.click(button);

    expect(screen.getByText("Введите кандзи")).toBeInTheDocument();
  });

  it("Ошибка сервера отображается", async () => {
    const errorMessage = "Ошибка сервера";

    (addKanji as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<AddKanjiForm />);

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[0].placeholder as string),
      { target: { value: "日" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[1].placeholder as string),
      { target: { value: "ひ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[2].placeholder as string),
      { target: { value: "ニチ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[3].placeholder as string),
      { target: { value: "день" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it("Успешная отправка формы + проверка level в payload", async () => {
    (addKanji as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddKanjiForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "N2" },
    });

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[0].placeholder as string),
      { target: { value: "日" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[1].placeholder as string),
      { target: { value: "ひ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[2].placeholder as string),
      { target: { value: "ニチ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[3].placeholder as string),
      { target: { value: "день" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    await screen.findByText("Успешно добавлено");

    expect(addKanji).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "N2",
        kanji: "日",
      }),
    );
  });

  it("После успешной отправки форма сбрасывается (level = N5)", async () => {
    (addKanji as jest.Mock).mockResolvedValueOnce({
      data: "Успешно добавлено",
    });

    render(<AddKanjiForm />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "N1" },
    });

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[0].placeholder as string),
      { target: { value: "日" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[1].placeholder as string),
      { target: { value: "ひ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[2].placeholder as string),
      { target: { value: "ニチ" } },
    );

    fireEvent.change(
      screen.getByPlaceholderText(KANJI_FORM_INPUTS[3].placeholder as string),
      { target: { value: "день" } },
    );

    fireEvent.click(screen.getByText("Добавить"));

    await screen.findByText("Успешно добавлено");

    expect(screen.getByRole("combobox")).toHaveValue("N5");
  });

  it("Snapshot", () => {
    const { container } = render(<AddKanjiForm />);

    expect(container).toMatchSnapshot();
  });
});
