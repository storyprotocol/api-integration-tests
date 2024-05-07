import { test, expect } from "../fixtures/base";

const endpoint = "./modules";

test.describe("Get a Module @Modules", async () => {
  test("Should return Modules detail", async ({ request, modules }) => {
    const moduleId = modules[1].id;
    const response = await request.get(endpoint + `/${moduleId}`);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(data.id).toBe(moduleId);
    expect.soft(typeof data.name).toBe("string");
    expect.soft(typeof data.module).toBe("string");
    expect.soft(typeof data.deletedAt).toBe("string");
    expect.soft(typeof data.blockNumber).toBe("string");
    expect.soft(typeof data.blockTimestamp).toBe("string");
    expect.soft(data.id).toBeTruthy();
    expect.soft(data.name).toBeTruthy();
    expect.soft(data.module).toBeTruthy();
    expect.soft(data.blockNumber).toBeTruthy();
    expect.soft(data.blockTimestamp).toBeTruthy();
  });

  test("Should return 404 for non-exist moduleId", async ({ request }) => {
    const response = await request.get(
      endpoint + "/0x950d766a1a0afdc33c3e653c861a8765cb42d999"
    );
    expect(response.status()).toBe(404);
  });

  test("Should return 404 for no moduleId", async ({ request }) => {
    const response = await request.get(endpoint);
    expect(response.status()).toBe(404);
  });
});
