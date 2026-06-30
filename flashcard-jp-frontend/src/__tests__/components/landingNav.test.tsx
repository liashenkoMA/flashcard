import { render, screen } from "@testing-library/react";
import LandingNav from "@/_components/LandingNav/LandingNav";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("LandingNav component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Рендерит меню если главная", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<LandingNav />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "О проекте" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Отзывы" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FAQ" })).toBeInTheDocument();
  });

  it("Не рендерит меню если страница не главная", () => {
    (usePathname as jest.Mock).mockReturnValue("/profile");

    const { container } = render(<LandingNav />);

    expect(container.firstChild).toBeNull();
  });

  it("Рендерит правильные ссылки", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<LandingNav />);

    expect(screen.getByRole("link", { name: "О проекте" })).toHaveAttribute(
      "href",
      "#introduction",
    );
    expect(screen.getByRole("link", { name: "Отзывы" })).toHaveAttribute(
      "href",
      "#reviews",
    );
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute(
      "href",
      "#faq",
    );
  });
});
