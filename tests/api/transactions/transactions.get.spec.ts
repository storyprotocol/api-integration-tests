import { test, expect } from "../fixtures/base";

const endpoint = "./transactions";

test.describe("Get a Transaction @Transactions", async () => {
  test("Should return Transaction detail", async ({
    request,
    transactions,
  }) => {
    const params = [
      { transactionId: transactions[1].id, exists: true },
      {
        transactionId:
          "0xffc3262a1bdcf0c2dca55874eeccc85deb54f887b072a58775ae9a508d049999",
        exists: false,
      },
    ];
    for (const { transactionId, exists } of params) {
      await test.step(`Query with transactionId ${transactionId}`, async () => {
        const response = await request.get(endpoint + `/${transactionId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(transactionId);
          expect(typeof data.initiator).toBe("string");
          expect(typeof data.ipId).toBe("string");
          expect(typeof data.resourceId).toBe("string");
          expect(typeof data.resourceType).toBe("string");
          expect(typeof data.actionType).toBe("string");
          expect(typeof data.createdAt).toBe("string");
          expect(data.id).toBeTruthy();
          expect(data.initiator).toBeTruthy();
          expect(data.resourceId).toBeTruthy();
          expect(data.resourceType).toBeTruthy();
          expect(data.actionType).toBeTruthy();
          expect(data.createdAt).toBeTruthy();
        } else {
          expect(data.id).toBeFalsy();
        }
      });
    }
  });

  test("Should return 404 for no transactionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
