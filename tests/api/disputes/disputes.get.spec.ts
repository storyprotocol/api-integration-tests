import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/disputes";

test.describe("Get a Dispute @Disputes", async () => {
  test("Should return the Dispute detail", async ({ request, disputes }) => {
    const params = [
      { disputeId: disputes[1].id, exists: true },
      { disputeId: "0", exists: false },
    ];
    for (const { disputeId, exists } of params) {
      await test.step(`Should return the Dispute detail with disputeId ${disputeId}`, async () => {
        const response = await request.get(endpoint + `/${disputeId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(disputeId);
          expect(typeof data.targetIpId).toBe("string");
          expect(typeof data.targetTag).toBe("string");
          expect(typeof data.currentTag).toBe("string");
          expect(typeof data.arbitrationPolicy).toBe("string");
          expect(typeof data.evidenceLink).toBe("string");
          expect(typeof data.initiator).toBe("string");
          expect(typeof data.data).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no disputeId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
