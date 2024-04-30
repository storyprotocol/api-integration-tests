import { test, expect } from "../fixtures/base";

const endpoint = "./modules";

test.describe("List Modules @Modules", async () => {
  test("Should return default Modules list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].name).toBe("string");
    expect(typeof data[0].module).toBe("string");
    expect(typeof data[0].deletedAt).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].name).toBeTruthy();
    expect(data[0].module).toBeTruthy();
    expect(data[0].blockNumber).toBeTruthy();
    expect(data[0].blockTimestamp).toBeTruthy();
    for (let i = 0; i < data.length - 1; i++) {
      const item = parseInt(data[i].blockTimestamp);
      const nextItem = parseInt(data[i + 1].blockTimestamp);
      expect(item).toBeGreaterThanOrEqual(nextItem);
    }
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Modules list with pagination ${JSON.stringify(
      pagination
    )}`, async ({ request }) => {
      const payload = {
        options: { pagination: pagination },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const offsetResponse = await request.post(endpoint, {
        data: { options: { pagination: { limit: 5 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  // const orderParams = [
  //   { orderBy: "id", orderDirection: "desc" },
  //   { orderBy: "id", orderDirection: "asc" },
  //   { orderBy: "name", orderDirection: "desc" },
  //   { orderBy: "name", orderDirection: "asc" },
  //   { orderBy: "module", orderDirection: "desc" },
  //   { orderBy: "module", orderDirection: "asc" },
  //   { orderBy: "deletedAt", orderDirection: "desc" },
  //   { orderBy: "deletedAt", orderDirection: "asc" },
  //   { orderBy: "blockNumber", orderDirection: "desc" },
  //   { orderBy: "blockNumber", orderDirection: "asc" },
  //   { orderBy: "blockTimestamp", orderDirection: "desc" },
  //   { orderBy: "blockTimestamp", orderDirection: "asc" },
  // ];
  // for (const { orderBy, orderDirection } of orderParams) {
  //   test(`Should return Modules list ordered by ${orderBy} ${orderDirection}`, async ({
  //     request,
  //   }) => {
  //     const payload = {
  //       options: { orderBy, orderDirection },
  //     };
  //     const response = await request.post(endpoint, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(200);

  //     const { errors, data } = await response.json();
  //     expect(errors).toBeUndefined();
  //     expect(data.length).toBeGreaterThan(0);
  //     for (let i = 0; i < data.length - 1; i++) {
  //       const item = data[i][orderBy].trim() || "\uFFFF";
  //       const nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
  //       if (orderDirection === "asc") {
  //         expect(item <= nextItem).toBeTruthy();
  //       } else {
  //         expect(item >= nextItem).toBeTruthy();
  //       }
  //     }
  //   });
  // }

  // const pageAndOrderParams = [
  //   {
  //     pagination: { offset: 0, limit: 5 },
  //     orderBy: "name",
  //     orderDirection: "desc",
  //   },
  //   {
  //     pagination: { offset: 1, limit: 4 },
  //     orderBy: "id",
  //     orderDirection: "asc",
  //   },
  // ];
  // for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
  //   test(`Should return Modules list with pagination ${JSON.stringify(
  //     pagination
  //   )} ordered by ${orderBy} ${orderDirection}`, async ({ request }) => {
  //     const payload = {
  //       options: { pagination, orderBy, orderDirection },
  //     };
  //     const response = await request.post(endpoint, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(200);

  //     const { errors, data } = await response.json();
  //     expect(errors).toBeUndefined();
  //     expect(data.length).toBeGreaterThan(0);
  //     expect(data.length).toBeLessThanOrEqual(pagination.limit);
  //     for (let i = 0; i < data.length - 1; i++) {
  //       const item = data[i][orderBy].trim() || "\uFFFF";
  //       const nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
  //       if (orderDirection === "asc") {
  //         expect(item <= nextItem).toBeTruthy();
  //       } else {
  //         expect(item >= nextItem).toBeTruthy();
  //       }
  //     }
  //   });
  // }

  test("Should return Modules list with filter", async ({
    request,
    modules,
  }) => {
    const whereParams = [
      { where: { name: modules[1].name }, exists: true },
      { where: { name: "abcd" }, exists: false },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with ${JSON.stringify(where)}`, async () => {
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
          data.forEach((item: object) => {
            expect(item).toMatchObject(where);
          });
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Modules list with filter, order and pagination", async ({
    request,
    modules,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "id",
        orderDirection: "asc",
        where: { name: modules[1].name },
      },
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "module",
        orderDirection: "desc",
        where: { name: modules[2].name },
      },
    ];
    for (const p of params) {
      await test.step(`Query with ${JSON.stringify(p)}`, async () => {
        const payload = {
          options: { ...p },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        expect(data.length).toBeGreaterThan(0);
        expect(data.length).toBeLessThanOrEqual(p.pagination.limit);
        // for (let i = 0; i < data.length - 1; i++) {
        //   const item = data[i][p.orderBy].trim() || "\uFFFF";
        //   const nextItem = data[i + 1][p.orderBy].trim() || "\uFFFF";
        //   if (p.orderDirection === "asc") {
        //     expect(item <= nextItem).toBeTruthy();
        //   } else {
        //     expect(item >= nextItem).toBeTruthy();
        //   }
        // }
        data.forEach((item: object) => {
          expect(item).toMatchObject(p.where);
        });
      });
    }
  });
});
