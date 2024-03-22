import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/modules";

test.describe("Get a Module @Modules", async () => {
  test("Should return Modules detail", async ({ request, modules }) => {
    const params = [
      { moduleId: modules[1].id, exists: true },
      { moduleId: "0x950d766a1a0afdc33c3e653c861a8765cb42d999", exists: false },
    ];
    for (const { moduleId, exists } of params) {
      await test.step(`Query with moduleId ${moduleId}`, async () => {
        const response = await request.get(endpoint + `/${moduleId}`);
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.id).toBe(moduleId);
          expect(typeof data.name).toBe("string");
          expect(typeof data.module).toBe("string");
          expect(typeof data.deletedAt).toBe("string");
          expect(typeof data.blockNumber).toBe("string");
          expect(typeof data.blockTimestamp).toBe("string");
        } else {
          expect(data).toBeNull();
        }
      });
    }
  });

  test("Should return 404 for no moduleId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
