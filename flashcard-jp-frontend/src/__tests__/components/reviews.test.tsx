import { fireEvent, render, screen } from "@testing-library/react";
import Reviews from "@/_components/Reviews/Reviews";

jest.mock("@/_components/ReviewsCard/ReviewsCard", () => {
  return function MockReviewsCard() {
    return <div>Review card</div>;
  };
});

describe("Reviews component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит блок отзывов", () => {
    render(<Reviews />);

    expect(screen.getByText("Отзывы")).toBeInTheDocument();
    expect(
      screen.getByText("Первые впечатления от Memora"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Мы развиваем сервис вместе с первыми пользователями и собираем обратную связь, чтобы сделать повторение языкового материала удобнее.",
      ),
    ).toBeInTheDocument();
  });

  it("Рендерит карточки отзывов", () => {
    render(<Reviews />);

    expect(screen.getAllByText("Review card")[0]).toBeInTheDocument();
  });

  it("Вызывает скролл при клике на кнопки", () => {
    render(<Reviews />);

    const viewport = screen.getByTestId("reviews-viewport");

    viewport.scrollBy = jest.fn();

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(viewport.scrollBy).toHaveBeenCalledTimes(2);
  });

  it("Snapshot", () => {
    const { container } = render(<Reviews />);

    expect(container).toMatchSnapshot();
  });
});
