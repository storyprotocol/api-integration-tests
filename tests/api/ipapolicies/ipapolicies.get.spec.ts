import { test, expect } from "../fixtures/base";

const endpoint =  "./ipapolicies";

test.describe("Get a IPAPolicy @IPAPolicies", async () => {
  test("Should return default IPAPolicy detail", async ({
    request,
    ipapolicies,
  }) => {
    const params = [
      { ipaPolicyId: ipapolicies[1].id, exists: true },
      { ipaPolicyId: "0xa9e59406bdcd00x99", exists: false },
    ];
    for (const { ipaPolicyId, exists } of params) {
      await test.step(`Should return the IPAPolicy detail with ipaPolicyId ${ipaPolicyId}`, async () => {
        const response = await request.get(endpoint + `/${ipaPolicyId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(ipaPolicyId);
          expect(typeof data.ipId).toBe("string");
          expect(typeof data.policyId).toBe("string");
          expect(typeof data.active).toBe("boolean");
          expect(typeof data.inherited).toBe("boolean");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no ipaPolicyId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
