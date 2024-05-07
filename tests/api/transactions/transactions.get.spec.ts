import { test, expect } from "../fixtures/base";

const endpoint = "./transactions";

test.describe("Get a Transaction @Transactions", async () => {
  test("Should return Transaction detail", async ({
    request,
    transactions,
  }) => {
    const transactionId = transactions[1].id;
    const response = await request.get(endpoint + `/${transactionId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(transactionId);
    expect.soft(typeof data.initiator).toBe("string");
    expect.soft(typeof data.ipId).toBe("string");
    expect.soft(typeof data.resourceId).toBe("string");
    expect.soft(typeof data.resourceType).toBe("string");
    expect.soft(typeof data.actionType).toBe("string");
    expect.soft(typeof data.createdAt).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.initiator).toBeTruthy();
    expect.soft(data.resourceId).toBeTruthy();
    expect.soft(data.resourceType).toBeTruthy();
    expect.soft(data.actionType).toBeTruthy();
    expect.soft(data.createdAt).toBeTruthy();
  });

  test("Should return 404 for non-exist transactionId", async ({ request }) => {
    const response = await request.get(
      endpoint +
        "/0xffc3262a1bdcf0c2dca55874eeccc85deb54f887b072a58775ae9a508d049999"
    );
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no transactionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
