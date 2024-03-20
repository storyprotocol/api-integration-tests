import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/collections";

test.describe("Get a Collection @Collections", async () => {
  test("Should return a Collection detail", async ({
    request,
    collections,
  }) => {
    const params = [
      { collectionId: collections[0].id, exists: true },
      {
        collectionId: "0x6456cba1cf7189a5e51a207fe232574e1fc21999",
        exists: false,
      },
    ];
    for (const { collectionId, exists } of params) {
      await test.step(`Should return the Collection detail with collectionId ${collectionId}`, async () => {
        const response = await request.get(endpoint + `/${collectionId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(collectionId);
          expect(typeof data.assetCount).toBe("string");
          expect(typeof data.licensesCount).toBe("string");
          expect(typeof data.raisedDisputeCount).toBe("string");
          expect(typeof data.judgedDisputeCount).toBe("string");
          expect(typeof data.resolvedDisputeCount).toBe("string");
          expect(typeof data.cancelledDisputeCount).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no collectionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
