import { test, expect } from "../fixtures/base";

const endpoint = "./royalties/policies";

test.describe("Get a Royalties Policy @Royalties", () => {
  test("Should return Royalties Policy detail", async ({
    request,
    royaltiesPolicies,
  }) => {
    const royaltyPolicyId = royaltiesPolicies[1].id;
    const response = await request.get(endpoint + `/${royaltyPolicyId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(royaltyPolicyId);
    expect.soft(typeof data.royaltyStack).toBe("string");
    expect.soft(typeof data.ipRoyaltyVault).toBe("string");
    expect.soft(Array.isArray(data.targetAncestors ?? [])).toBeTruthy();
    expect.soft(Array.isArray(data.targetRoyaltyAmount ?? [])).toBeTruthy();
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.royaltyStack).toBeTruthy();
    expect.soft(data.ipRoyaltyVault).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist royaltyPolicyId", async ({
    request,
  }) => {
    const response = await request.get(
      endpoint + "/0x484c10779f9c5209b371afa029797e76129d9999"
    );
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no royaltyPolicyId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
