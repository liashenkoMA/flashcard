import RootLayout from "../../app/layout";
import { getUser, getUserUsage } from "@/_utils/api/server/userApi";

jest.mock("@/_utils/api/server/userApi", () => ({
  getUser: jest.fn(),
  getUserUsage: jest.fn(),
}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Вызывает getUser и getUserUsage", async () => {
    (getUser as jest.Mock).mockResolvedValue({
      user: {
        name: "Иван",
        email: "test@test.ru",
        subscription: {
          active: true,
          expiresAt: null,
        },
      },
    });

    (getUserUsage as jest.Mock).mockResolvedValue({
      usage: {
        hanzi: 10,
        wordCn: 20,
        kanji: 30,
        wordJp: 40,
        wordKr: 50,
      },
    });

    await RootLayout({
      children: <div>Test</div>,
    });

    expect(getUser).toHaveBeenCalledTimes(1);
    expect(getUserUsage).toHaveBeenCalledTimes(1);
  });

  it("Вызывает Promise.all", async () => {
    let userResolved = false;
    let usageResolved = false;

    (getUser as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            userResolved = true;

            resolve({
              user: {
                name: "Иван",
                email: "test@test.ru",
                subscription: {
                  active: true,
                  expiresAt: null,
                },
              },
            });
          }, 20);
        }),
    );

    (getUserUsage as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            usageResolved = true;

            resolve({
              usage: {
                hanzi: 10,
                wordCn: 20,
                kanji: 30,
                wordJp: 40,
                wordKr: 50,
              },
            });
          }, 10);
        }),
    );

    await RootLayout({
      children: <div>Test</div>,
    });

    expect(userResolved).toBe(true);
    expect(usageResolved).toBe(true);
  });
});
