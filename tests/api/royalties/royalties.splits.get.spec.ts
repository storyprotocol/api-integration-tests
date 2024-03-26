import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/royalties/splits";

test.describe("Get a Royalties Split @Royalties", () => {
  test("Should return Royalties Split detail", async ({
    request,
    royaltiesPolicies,
  }) => {
    const params = [
      { royaltySplitId: royaltiesPolicies[1].splitClone, exists: true },
      {
        royaltySplitId: "0x53da49b421effb384e66a64f4fba28925c569999",
        exists: false,
      },
    ];
    for (const { royaltySplitId, exists } of params) {
      await test.step(`Query with royaltySplitId ${royaltySplitId}`, async () => {
        const response = await request.get(endpoint + `/${royaltySplitId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(royaltySplitId);
          expect(typeof data.claimFromIPPoolArg).toBe("string");
          expect(Array.isArray(data.holders)).toBeTruthy();
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no royaltySplitId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
