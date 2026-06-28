import { render, screen } from "@testing-library/react";
import Faq from "@/_components/FAQ/Faq";

describe("Faq component", () => {
  it("Рендерит блок FAQ", () => {
    render(<Faq />);

    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("Часто задаваемые вопросы")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Коротко о главном — всё, что важно знать перед стартом",
      ),
    ).toBeInTheDocument();
  });

  it("Snapshot", () => {
    const { container } = render(<Faq />);

    expect(container).toMatchSnapshot();
  });
});
