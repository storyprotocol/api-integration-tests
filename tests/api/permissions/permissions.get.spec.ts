import { test, expect } from "../fixtures/base";

const endpoint = "./permissions";

test.describe("Get a Permission @Permissions", async () => {
  test("Should return Permissions detail", async ({
    request,
    permissionsList,
  }) => {
    const permissionId = permissionsList[1].id;
    const response = await request.get(endpoint + `/${permissionId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(permissionId);
    expect.soft(typeof data.permission).toBe("string");
    expect.soft(typeof data.signer).toBe("string");
    expect.soft(typeof data.to).toBe("string");
    expect.soft(typeof data.func).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.permission).toBeTruthy();
    expect.soft(data.signer).toBeTruthy();
    expect.soft(data.to).toBeTruthy();
    expect.soft(data.func).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist permissionId", async ({ request }) => {
    const response = await request.get(endpoint + "/0x93c5f4a647d060x55");
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no permissionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
