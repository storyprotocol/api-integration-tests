import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/policies/frameworks";

test.describe("Get a Policy Framework @Policies", async () => {
  test("Should return Policy Framework detail", async ({
    request,
    policiesFrameworks,
  }) => {
    const params = [
      { policyFrameworkId: policiesFrameworks[0].id, exists: true },
      { policyFrameworkId: "0x9aa790890a9309999", exists: false },
    ];
    for (const { policyFrameworkId, exists } of params) {
      await test.step(`Query with policyFrameworkId ${policyFrameworkId}`, async () => {
        const response = await request.get(endpoint + `/${policyFrameworkId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(policyFrameworkId);
          expect(typeof data.name).toBe("string");
          expect(typeof data.address).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return null for no policyFrameworkId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(200);
    const { data } = await response.json();
    expect(data).toBeNull();
  });
});
