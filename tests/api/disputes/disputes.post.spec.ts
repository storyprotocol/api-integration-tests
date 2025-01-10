import { test, expect } from "../fixtures/base";

const endpoint = "./disputes";

test.describe("List Disputes @Disputes", async () => {
  test("Should return default Disputes list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].targetIpId).toBe("string");
    expect(typeof data[0].targetTag).toBe("string");
    expect(typeof data[0].currentTag).toBe("string");
    expect(typeof data[0].arbitrationPolicy).toBe("string");
    expect(typeof data[0].evidenceLink).toBe("string");
    expect(typeof data[0].initiator).toBe("string");
    expect(typeof data[0].data).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].targetIpId).toBeTruthy();
    expect(data[0].targetTag).toBeTruthy();
    expect(data[0].arbitrationPolicy).toBeTruthy();
    expect(data[0].evidenceLink).toBeTruthy();
    expect(data[0].initiator).toBeTruthy();
    expect(data[0].blockNumber).toBeTruthy();
    expect(data[0].blockTimestamp).toBeTruthy();
    for (let i = 0; i < data.length - 1; i++) {
      const item = parseInt(data[i].blockTimestamp);
      const nextItem = parseInt(data[i + 1].blockTimestamp);
      expect(item).toBeGreaterThanOrEqual(nextItem);
    }
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 1 } },
    { pagination: { offset: 1, limit: 1 } },
    { pagination: { offset: 0, limit: 2 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Disputes list with pagination ${JSON.stringify(
      pagination
    )}`, async ({ request, disputes }) => {
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
      if (pagination.offset < disputes.length) {
        expect(data[0]).toMatchObject(firstItem);
      }
    });
  }

  // const orderParams = [
  //   { orderBy: "id", orderDirection: "desc" },
  //   { orderBy: "id", orderDirection: "asc" },
  //   { orderBy: "targetIpId", orderDirection: "desc" },
  //   { orderBy: "targetIpId", orderDirection: "asc" },
  //   { orderBy: "targetTag", orderDirection: "desc" },
  //   { orderBy: "targetTag", orderDirection: "asc" },
  //   { orderBy: "currentTag", orderDirection: "desc" },
  //   { orderBy: "currentTag", orderDirection: "asc" },
  //   { orderBy: "arbitrationPolicy", orderDirection: "desc" },
  //   { orderBy: "arbitrationPolicy", orderDirection: "asc" },
  //   { orderBy: "evidenceLink", orderDirection: "desc" },
  //   { orderBy: "evidenceLink", orderDirection: "asc" },
  //   { orderBy: "initiator", orderDirection: "desc" },
  //   { orderBy: "initiator", orderDirection: "asc" },
  //   { orderBy: "data", orderDirection: "desc" },
  //   { orderBy: "data", orderDirection: "asc" },
  //   { orderBy: "blockNumber", orderDirection: "desc" },
  //   { orderBy: "blockNumber", orderDirection: "asc" },
  //   { orderBy: "blockTimestamp", orderDirection: "desc" },
  //   { orderBy: "blockTimestamp", orderDirection: "asc" },
  // ];
  // for (const { orderBy, orderDirection } of orderParams) {
  //   test(`Should return Disputes list ordered by ${orderBy} ${orderDirection}`, async ({
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
  //     pagination: { offset: 0, limit: 1 },
  //     orderBy: "targetIpId",
  //     orderDirection: "asc",
  //   },
  //   {
  //     pagination: { offset: 1, limit: 1 },
  //     orderBy: "initiator",
  //     orderDirection: "desc",
  //   },
  // ];
  // for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
  //   test(`Should return Disputes list with pagination ${JSON.stringify(
  //     pagination
  //   )} ordered by ${orderBy} ${orderDirection}`, async ({ request, disputes }) => {
  //     const payload = {
  //       options: { pagination, orderBy, orderDirection },
  //     };
  //     const response = await request.post(endpoint, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(200);

  //     const { errors, data } = await response.json();
  //     expect(errors).toBeUndefined();
  //     if (pagination.offset < disputes.length) {
  //       expect(data.length).toBeGreaterThan(0);
  //     }
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

  test("Should return disputes list with filter", async ({
    request,
    disputes,
  }) => {
    const filterEmptyData = disputes.filter((d) => d.currentTag);
    const whereParams = [
      {
        where: {
          targetTag: disputes[0].targetTag,
        },
        exists: true,
      },
      {
        where: {
          targetTag:
            "0x504c414749415249534d00000000000000000000000000000000000000009999",
        },
        exists: false,
      },
      {
        where: {
          currentTag: filterEmptyData[0]?.currentTag ?? disputes[0].currentTag,
        },
        exists: true,
      },
      {
        where: {
          currentTag:
            "0x504c414749415249534d00000000000000000000000000000000000000009999",
        },
        exists: false,
      },
      {
        where: { targetIpId: disputes[0].targetIpId },
        exists: true,
      },
      {
        where: { targetIpId: "0x41056a9d8234108718f28467595f76b92f8fe999" },
        exists: false,
      },
      {
        where: { initiator: disputes[0].initiator },
        exists: true,
      },
      {
        where: { initiator: "0xf398c12a45bc409b6c652e25bb0a3e702492a999" },
        exists: false,
      },
      {
        where: {
          targetTag: disputes[0].targetTag,
          targetIpId: disputes[0].targetIpId,
        },
        exists: true,
      },
      {
        where: {
          currentTag:
            "0x504c414749415249534d00000000000000000000000000000000000000000000",
          initiator: "0xd84316a1b6f40902c17b8177854cdaeb3c957daf",
        },
        exists: false,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Should return Disputes list with where ${JSON.stringify(
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
          if (where.currentTag?.trim() !== "") {
            for (const item of data) {
              expect(item).toMatchObject(where);
            }
          }
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Disputes list with filter, order and pagination", async ({
    request,
    disputes,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "id",
        orderDirection: "desc",
        where: {
          targetTag: disputes[0].targetTag,
          initiator: disputes[0].initiator,
        },
      },
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "targetIpId",
        orderDirection: "asc",
        where: {
          targetTag: disputes[0].targetTag,
          initiator: disputes[0].initiator,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Should return Disputes list with pagination ${JSON.stringify(
        p.pagination
      )}, orderBy ${p.orderBy}, orderDirection ${
        p.orderDirection
      } and where ${JSON.stringify(p.where)}`, async () => {
        const payload = {
          options: { ...p },
        };
        const response = await request.post(endpoint, {
          data: payload,
        });
        expect(response.status()).toBe(200);

        const { errors, data } = await response.json();
        expect(errors).toBeUndefined();
        if (p.pagination.offset < disputes.length) {
          expect(data.length).toBeGreaterThan(0);
        }
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
