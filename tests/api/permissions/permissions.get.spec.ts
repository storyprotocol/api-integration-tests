import { test, expect } from "../fixtures/base";

const endpoint = "./permissions";

test.describe("Get a Permission @Permissions", async () => {
  test("Should return Permissions detail @bug", async ({
    request,
    permissionsList,
  }) => {
    const params = [
      { permissionId: permissionsList[1].id, exists: true },
      { permissionId: "0x93c5f4a647d060x55", exists: false },
    ];
    for (const { permissionId, exists } of params) {
      await test.step(`Query with permissionId ${permissionId}`, async () => {
        const response = await request.get(endpoint + `/${permissionId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(permissionId);
          expect(typeof data.permission).toBe("string");
          expect(typeof data.signer).toBe("string");
          expect(typeof data.to).toBe("string");
          expect(typeof data.func).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no permissionId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
