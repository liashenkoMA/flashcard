import HangeulPageComponent from "@/_components/HangeulPageComponent/HangeulPageComponent";
import {
  updateHangeul,
  updateHangeulWeight,
} from "@/_utils/api/client/hangeulApi";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReactNode } from "react";

jest.mock("@/_utils/api/client/hangeulApi", () => ({
  updateHangeul: jest.fn(),
  updateHangeulWeight: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  },
}));

const mockCards = [
  { symbol: "가", romaji: "ga", weight: 1, _id: "1" },
  { symbol: "나", romaji: "na", weight: 1, _id: "2" },
  { symbol: "다", romaji: "da", weight: 1, _id: "3" },
];

describe("HangeulPageComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Показывает загрузку при пустом массиве", () => {
    render(
      <HangeulPageComponent hangeul={[]} searchParams={{ type: "learn" }} />,
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("Рендер первой карточки после загрузки", async () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "learn" }}
      />,
    );

    expect(await screen.findByText(/가|나|다/)).toBeInTheDocument();
  });

  it("В режиме repeat отображаются кнопки Помню и Не помню", async () => {
    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Помню" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Не помню" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Назад" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Вперед" }),
    ).not.toBeInTheDocument();
  });

  it("В обычном режиме отображаются кнопки Назад, Вперед и Запомнил", async () => {
    render(<HangeulPageComponent hangeul={mockCards} searchParams={{}} />);

    expect(
      await screen.findByRole("button", { name: "Назад" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Вперед" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Запомнил" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Помню" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Не помню" }),
    ).not.toBeInTheDocument();
  });

  it("Кнопка Запомнил вызывает updateHangeul", async () => {
    (updateHangeul as jest.Mock).mockResolvedValue({});

    render(<HangeulPageComponent hangeul={mockCards} searchParams={{}} />);

    await screen.findByText(/가|나|다/);

    fireEvent.click(screen.getByRole("button", { name: "Запомнил" }));

    await waitFor(() => {
      expect(updateHangeul).toHaveBeenCalledTimes(1);
    });
  });

  it("Кнопка Помню вызывает updateHangeulWeight", async () => {
    (updateHangeulWeight as jest.Mock).mockResolvedValue({});

    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/가|나|다/);

    fireEvent.click(screen.getByRole("button", { name: "Помню" }));

    await waitFor(() => {
      expect(updateHangeulWeight).toHaveBeenCalledTimes(1);
      expect(updateHangeulWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "remember",
      });
    });
  });

  it("Кнопка Не помню вызывает updateHangeulWeight со статусом forgot", async () => {
    (updateHangeulWeight as jest.Mock).mockResolvedValue({});

    render(
      <HangeulPageComponent
        hangeul={mockCards}
        searchParams={{ type: "repeat" }}
      />,
    );

    await screen.findByText(/가|나|다/);

    fireEvent.click(screen.getByRole("button", { name: "Не помню" }));

    await waitFor(() => {
      expect(updateHangeulWeight).toHaveBeenCalledTimes(1);
      expect(updateHangeulWeight).toHaveBeenCalledWith(expect.any(Object), {
        status: "forgot",
      });
    });
  });
});
