import { test, expect } from "../fixtures/base";

const endpoint = "./disputes";

test.describe("Get a Dispute @Disputes", async () => {
  test("Should return the Dispute detail", async ({ request, disputes }) => {
    const disputeId = disputes[1].id;
    const response = await request.get(endpoint + `/${disputeId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(disputeId);
    expect.soft(typeof data.targetIpId).toBe("string");
    expect.soft(typeof data.targetTag).toBe("string");
    expect.soft(typeof data.currentTag).toBe("string");
    expect.soft(typeof data.arbitrationPolicy).toBe("string");
    expect.soft(typeof data.evidenceLink).toBe("string");
    expect.soft(typeof data.initiator).toBe("string");
    expect.soft(typeof data.data).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.targetIpId).toBeTruthy();
    expect.soft(data.targetTag).toBeTruthy();
    expect.soft(data.arbitrationPolicy).toBeTruthy();
    expect.soft(data.evidenceLink).toBeTruthy();
    expect.soft(data.initiator).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist disputeId", async ({ request }) => {
    const response = await request.get(endpoint + "/0");
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no disputeId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
