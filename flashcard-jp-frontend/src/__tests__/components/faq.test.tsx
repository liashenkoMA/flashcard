import { render, screen } from "@testing-library/react";
import Faq from "@/_components/FAQ/Faq";

describe("Faq component", () => {
  it("Рендерит блок FAQ", () => {
    render(<Faq />);

    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(
      screen.getByText("Всё, что важно знать о Memora"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ответы на вопросы об изучении, карточках и возможностях сервиса.",
      ),
    ).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<Faq />);

    expect(container).toMatchSnapshot();
  });
});
