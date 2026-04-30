import { render, screen } from "@testing-library/react";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";


describe("LinkButton component", () => {
  it("Рендерит ссылку с правильным текстом", () => {
    render(<LinkButton href="/test" text="Перейти" />);

    expect(
      screen.getByRole("link", { name: "Перейти" })
    ).toBeInTheDocument();
  });

  it("Установлен правильный href", () => {
    render(<LinkButton href="/test" text="Перейти" />);

    expect(
      screen.getByRole("link", { name: "Перейти" })
    ).toHaveAttribute("href", "/test");
  });

  it("Имеет target и rel", () => {
    render(<LinkButton href="/test" text="Перейти" />);

    const link = screen.getByRole("link", { name: "Перейти" });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Snapshot", () => {
    const { container } = render(
      <LinkButton href="/test" text="Перейти" />
    );

    expect(container).toMatchSnapshot();
  });
});