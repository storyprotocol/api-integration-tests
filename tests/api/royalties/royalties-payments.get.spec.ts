import { test, expect } from "../fixtures/base";

const endpoint = "./royalties/payments";

test.describe("Get a RoyaltyPay @Royalties", () => {
  test("Should return RoyaltyPay detail", async ({
    request,
    royaltiesPayments,
  }) => {
    const royaltyPayId = royaltiesPayments[0].id;
    const response = await request.get(endpoint + `/${royaltyPayId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(royaltyPayId);
    expect.soft(typeof data.payerIpId).toBe("string");
    expect.soft(typeof data.receiverIpId).toBe("string");
    expect.soft(typeof data.sender).toBe("string");
    expect.soft(typeof data.token).toBe("string");
    expect.soft(typeof data.amount).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.payerIpId).toBeTruthy();
    expect.soft(data.receiverIpId).toBeTruthy();
    expect.soft(data.sender).toBeTruthy();
    expect.soft(data.token).toBeTruthy();
    expect.soft(data.amount).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist royaltyPayId", async ({ request }) => {
    const response = await request.get(endpoint + "/0x55ffbb07777249999");
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no royaltyPayId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
