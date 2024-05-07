import { test, expect } from "../fixtures/base";

const endpoint = "./collections";

test.describe("Get a Collection @Collections", async () => {
  test("Should return a Collection detail", async ({
    request,
    collections,
  }) => {
    const collectionId = collections[0].id;
    const response = await request.get(endpoint + `/${collectionId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(collectionId);
    expect.soft(typeof data.assetCount).toBe("string");
    expect.soft(typeof data.licensesCount).toBe("string");
    expect.soft(typeof data.raisedDisputeCount).toBe("string");
    expect.soft(typeof data.judgedDisputeCount).toBe("string");
    expect.soft(typeof data.resolvedDisputeCount).toBe("string");
    expect.soft(typeof data.cancelledDisputeCount).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.assetCount).toBeTruthy();
    expect.soft(data.licensesCount).toBeTruthy();
    expect.soft(data.raisedDisputeCount).toBeTruthy();
    expect.soft(data.judgedDisputeCount).toBeTruthy();
    expect.soft(data.resolvedDisputeCount).toBeTruthy();
    expect.soft(data.cancelledDisputeCount).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist collectionId", async ({ request }) => {
    const response = await request.get(
      endpoint + "/0x6456cba1cf7189a5e51a207fe232574e1fc21999"
    );
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no collectionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
