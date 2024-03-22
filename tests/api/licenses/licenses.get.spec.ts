import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/licenses";

test.describe("Get a License @Licenses", async () => {
  test("Should return Licenses detail", async ({ request, licenses }) => {
    const params = [
      { licenseId: licenses[1].id, exists: true },
      { licenseId: "0", exists: false },
    ];
    for (const { licenseId, exists } of params) {
      await test.step(`Query with licenseId ${licenseId}`, async () => {
        const response = await request.get(endpoint + `/${licenseId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(licenseId);
          expect(typeof data.policyId).toBe("string");
          expect(typeof data.licensorIpId).toBe("string");
          expect(typeof data.amount).toBe("string");
          expect(typeof data.transferable).toBe("boolean");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no licenseId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
