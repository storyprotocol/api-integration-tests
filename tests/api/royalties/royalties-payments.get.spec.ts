import { test, expect } from "../fixtures/base";

const endpoint = "./royalties/payments";

test.describe("Get a RoyaltyPay @Royalties", () => {
  test("Should return RoyaltyPay detail", async ({
    request,
    royaltiesPayments,
  }) => {
    const params = [
      { royaltyPayId: royaltiesPayments[0].id, exists: true },
      { royaltyPayId: "0x55ffbb07777249999", exists: false },
    ];
    for (const { royaltyPayId, exists } of params) {
      await test.step(`Query with royaltyPayId ${royaltyPayId}`, async () => {
        const response = await request.get(endpoint + `/${royaltyPayId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(royaltyPayId);
          expect(typeof data.payerIpId).toBe("string");
          expect(typeof data.receiverIpId).toBe("string");
          expect(typeof data.sender).toBe("string");
          expect(typeof data.token).toBe("string");
          expect(typeof data.amount).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.payerIpId).toBeTruthy();
          expect(data.receiverIpId).toBeTruthy();
          expect(data.sender).toBeTruthy();
          expect(data.token).toBeTruthy();
          expect(data.amount).toBeTruthy();
          expect(data.blockNumber).toBeTruthy();
          expect(data.blockTimestamp).toBeTruthy();
        } else {
          expect(data.id).toBeFalsy();
        }
      });
    }
  });

  test("Should return 404 for no royaltyPayId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
