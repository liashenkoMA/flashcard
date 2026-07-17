import HanziTable from "@/_components/HanziTable/HanziTable";
import { IHanzi } from "@/_interface/Interface";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { deleteHanzi } from "@/_utils/api/client/hanziApi";

jest.mock("@/_utils/api/client/hanziApi", () => ({
  deleteHanzi: jest.fn(),
}));

describe("HanziTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHanzi: IHanzi[] = [
    {
      _id: "1",
      category: "HSK1",
      hanzi: "日",
      translate: "солнце",
      pinyin: "rì",
      weight: 1,
    },
  ];

  it("Рендерит список ханзи", () => {
    render(<HanziTable hanzi={mockHanzi} />);

    expect(screen.getByText("Таблица ханзи")).toBeInTheDocument();
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("Вызывает deleteHanzi при клике", async () => {
    (deleteHanzi as jest.Mock).mockResolvedValueOnce({
      data: "ханзи успешно удалён",
    });

    render(<HanziTable hanzi={mockHanzi} />);

    const deleteButton = screen.getByRole("button", {
      name: /удалить/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteHanzi).toHaveBeenCalledTimes(1);
    });
    expect(deleteHanzi).toHaveBeenCalledWith(mockHanzi[0]);
  });
});
