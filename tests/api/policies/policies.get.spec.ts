import { test, expect } from "../fixtures/base";

const endpoint = "./policies";

test.describe("Get a Policy @Policies", async () => {
  test("Should return Policies detail", async ({ request, policies }) => {
    const params = [
      { policyId: policies[1].id, exists: true },
      { policyId: "0", exists: false },
    ];
    for (const { policyId, exists } of params) {
      await test.step(`Query with policyId ${policyId}`, async () => {
        const response = await request.get(endpoint + `/${policyId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(policyId);
          expect(typeof data.mintingFee).toBe("string");
          expect(typeof data.mintingFeeToken).toBe("string");
          expect(typeof data.policyFrameworkManager).toBe("string");
          expect(typeof data.frameworkData).toBe("string");
          expect(typeof data.royaltyData).toBe("string");
          expect(typeof data.royaltyPolicy).toBe("string");
          expect(typeof data.pil.id).toBe("string");
          expect(typeof data.pil.attribution).toBe("boolean");
          expect(typeof data.pil.commercialAttribution).toBe("boolean");
          expect(typeof data.pil.commercialRevShare).toBe("string");
          expect(typeof data.pil.commercialUse).toBe("boolean");
          expect(typeof data.pil.commercializerChecker).toBe("string");
          expect(typeof data.pil.commercializerCheckerData).toBe("string");
          expect(typeof data.pil.derivativesAllowed).toBe("boolean");
          expect(typeof data.pil.derivativesApproval).toBe("boolean");
          expect(typeof data.pil.derivativesAttribution).toBe("boolean");
          expect(typeof data.pil.derivativesReciprocal).toBe("boolean");
          expect(Array.isArray(data.pil.contentRestrictions)).toBeTruthy();
          expect(Array.isArray(data.pil.distributionChannels)).toBeTruthy();
          expect(Array.isArray(data.pil.territories)).toBeTruthy();
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no policyId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
