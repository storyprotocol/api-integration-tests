import { test, expect } from "../fixtures/base";

const endpoint = "./policies/frameworks";

test.describe("List Policies Frameworks @Policies", async () => {
  test("Should return default Policies Frameworks list", async ({
    request,
  }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].name).toBe("string");
    expect(typeof data[0].address).toBe("string");
    expect(typeof data[0].licenseUrl).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Policies Frameworks list with pagination ${JSON.stringify(
      pagination
    )}`, async ({ request, policiesFrameworks }) => {
      const payload = {
        options: { pagination: pagination },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const offsetResponse = await request.post(endpoint, {
        data: { options: { pagination: { limit: 30 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      if (pagination.offset < policiesFrameworks.length) {
        expect(data[0]).toMatchObject(firstItem);
      }
    });
  }

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "name", orderDirection: "desc" },
    { orderBy: "name", orderDirection: "asc" },
    { orderBy: "address", orderDirection: "desc" },
    { orderBy: "address", orderDirection: "asc" },
    { orderBy: "licenseUrl", orderDirection: "desc" },
    { orderBy: "licenseUrl", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Policies Frameworks list with order by ${orderBy} and order direction ${orderDirection}`, async ({
      request,
    }) => {
      const payload = {
        options: { orderBy, orderDirection },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeGreaterThan(0);
      for (let i = 0; i < data.length - 1; i++) {
        const item = data[i][orderBy].trim() || "\uFFFF";
        const nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        if (orderDirection === "asc") {
          expect(item <= nextItem).toBeTruthy();
        } else {
          expect(item >= nextItem).toBeTruthy();
        }
      }
    });
  }

  const pageAndOrderParams = [
    {
      pagination: { offset: 0, limit: 5 },
      orderBy: "id",
      orderDirection: "asc",
    },
    {
      pagination: { offset: 1, limit: 3 },
      orderBy: "name",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Policies Frameworks list with pagination ${JSON.stringify(
      pagination
    )}, order by ${orderBy} and order direction ${orderDirection}`, async ({
      request,
      policiesFrameworks,
    }) => {
      const payload = {
        options: { pagination, orderBy, orderDirection },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      if (pagination.offset < policiesFrameworks.length) {
        expect(data.length).toBeGreaterThan(0);
      }
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      for (let i = 0; i < data.length - 1; i++) {
        const item = data[i][orderBy].trim() || "\uFFFF";
        const nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        if (orderDirection === "asc") {
          expect(item <= nextItem).toBeTruthy();
        } else {
          expect(item >= nextItem).toBeTruthy();
        }
      }
    });
  }

  test("Should return Policies Frameworks list with filter", async ({
    request,
    policiesFrameworks,
  }) => {
    const whereParams = [
      { where: { address: policiesFrameworks[0].address }, exists: true },
      {
        where: { address: "0xeaabf2b80b7e069ee449b5629590a1cc0f9b9999" },
        exists: false,
      },
      { where: { name: policiesFrameworks[0].name }, exists: true },
      { where: { name: "abcd" }, exists: false },
      {
        where: {
          address: policiesFrameworks[0].address,
          name: policiesFrameworks[0].name,
        },
        exists: true,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with ${JSON.stringify(
        where
      )}`, async () => {
        const payload = {
          options: { where },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (exists) {
          expect(data.length).toBeGreaterThan(0);
          for (const item of data) {
            expect(item).toMatchObject(where);
          }
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Policies Frameworks list with filter, order and pagination", async ({
    request,
    policiesFrameworks,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "id",
        orderDirection: "asc",
        where: { address: policiesFrameworks[0].address },
      },
      {
        pagination: { offset: 1, limit: 3 },
        orderBy: "name",
        orderDirection: "desc",
        where: {
          address: policiesFrameworks[0].address,
          name: policiesFrameworks[0].name,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Query with ${JSON.stringify(
        p
      )}`, async () => {
        const payload = {
          options: { ...p },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (p.pagination.offset < policiesFrameworks.length) {
          expect(data.length).toBeGreaterThan(0);
        }
        expect(data.length).toBeLessThanOrEqual(p.pagination.limit);
        for (let i = 0; i < data.length - 1; i++) {
          const item = data[i][p.orderBy].trim() || "\uFFFF";
          const nextItem = data[i + 1][p.orderBy].trim() || "\uFFFF";
          if (p.orderDirection === "asc") {
            expect(item <= nextItem).toBeTruthy();
          } else {
            expect(item >= nextItem).toBeTruthy();
          }
        }
        data.forEach((item: object) => {
          expect(item).toMatchObject(p.where);
        });
      });
    }
  });
});
