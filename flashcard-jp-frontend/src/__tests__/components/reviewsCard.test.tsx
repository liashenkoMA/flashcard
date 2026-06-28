import { render } from "@testing-library/react";
import ReviewsCard from "../../_components/ReviewsCard/ReviewsCard";
import { IReview } from "@/_interface/Interface";

describe("ReviewsCard component", () => {
  const mockReview: IReview = {
    user: "Алексей",
    learned: "Японский",
    message: "Отличное приложение для изучения слов",
  };

  it("Snapshot", () => {
    const { container } = render(<ReviewsCard card={mockReview} />);

    expect(container).toMatchSnapshot();
  });
});
