import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/royalties/policies";

test.describe("Get a Royalties Policy @Royalties", () => {
  test("Should return Royalties Policy detail", async ({
    request,
    royaltiesPolicies,
  }) => {
    const params = [
      { royaltyPolicyId: royaltiesPolicies[1].id, exists: true },
      {
        royaltyPolicyId: "0x484c10779f9c5209b371afa029797e76129d9999",
        exists: false,
      },
    ];
    for (const { royaltyPolicyId, exists } of params) {
      await test.step(`Query with royaltyPolicyId ${royaltyPolicyId}`, async () => {
        const response = await request.get(endpoint + `/${royaltyPolicyId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(royaltyPolicyId);
          expect(typeof data.royaltyStack).toBe("string");
          expect(typeof data.splitClone).toBe("string");
          expect(typeof data.ancestorsVault).toBe("string");
          expect(Array.isArray(data.targetAncestors)).toBeTruthy();
          expect(Array.isArray(data.targetRoyaltyAmount)).toBeTruthy();
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no royaltyPolicyId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
