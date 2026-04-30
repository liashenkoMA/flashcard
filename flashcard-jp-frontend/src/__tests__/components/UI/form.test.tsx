import Form from "@/_components/UI/Form/Form";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Form component", () => {
  it("Рендерит children, form", () => {
    const { container } = render(
      <Form handleSubmit={() => {}}>
        <p>Form</p>
      </Form>
    );

    expect(container.getElementsByClassName("form")[0]).toBeInTheDocument();
    expect(screen.getByText("Form")).toBeInTheDocument();
  });

  it("Срабатывает handleSubmit при отправке формы", () => {
    const handleSubmit = jest.fn();

    render(
      <Form handleSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    fireEvent.submit(screen.getByText("Submit"));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("Snapshot", () => {
    const { container } = render(
      <Form handleSubmit={() => {}}>
        <p>Form</p>
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
});
