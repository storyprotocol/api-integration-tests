import { test, expect } from "../fixtures/base";

const endpoint = "./royalties/payments";

test.describe("List RoyaltyPays @Royalties", () => {
  test("Should return default Royalty Pays list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].payerIpId).toBe("string");
    expect(typeof data[0].receiverIpId).toBe("string");
    expect(typeof data[0].sender).toBe("string");
    expect(typeof data[0].token).toBe("string");
    expect(typeof data[0].amount).toBe("string");
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].payerIpId).toBeTruthy();
    expect(data[0].receiverIpId).toBeTruthy();
    expect(data[0].sender).toBeTruthy();
    expect(data[0].token).toBeTruthy();
    expect(data[0].amount).toBeTruthy();
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
    test(`Should return Royalty Pays list with pagination ${JSON.stringify(
      pagination
    )}`, async ({ request, royaltiesPayments }) => {
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
      if (pagination.offset < royaltiesPayments.length) {
        expect(data[0]).toMatchObject(firstItem);
      }
    });
  }

  // const orderParams = [
  //   { orderBy: "id", orderDirection: "desc" },
  //   { orderBy: "id", orderDirection: "asc" },
  //   { orderBy: "payerIpId", orderDirection: "desc" },
  //   { orderBy: "payerIpId", orderDirection: "asc" },
  //   { orderBy: "receiverIpId", orderDirection: "desc" },
  //   { orderBy: "receiverIpId", orderDirection: "asc" },
  //   { orderBy: "sender", orderDirection: "desc" },
  //   { orderBy: "sender", orderDirection: "asc" },
  //   { orderBy: "token", orderDirection: "desc" },
  //   { orderBy: "token", orderDirection: "asc" },
  //   { orderBy: "amount", orderDirection: "desc" },
  //   { orderBy: "amount", orderDirection: "asc" },
  //   { orderBy: "blockNumber", orderDirection: "desc" },
  //   { orderBy: "blockNumber", orderDirection: "asc" },
  //   { orderBy: "blockTimestamp", orderDirection: "desc" },
  //   { orderBy: "blockTimestamp", orderDirection: "asc" },
  // ];
  // for (const { orderBy, orderDirection } of orderParams) {
  //   test(`Should return Royalty Pays list with order by ${orderBy} and order direction ${orderDirection}`, async ({
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
  //       let item: string | number;
  //       let nextItem: string | number;
  //       if (orderBy === "amount") {
  //         item = parseInt(data[i][orderBy]);
  //         nextItem = parseInt(data[i + 1][orderBy]);
  //       } else {
  //         item = data[i][orderBy].trim() || "\uFFFF";
  //         nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
  //       }
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
  //     orderBy: "id",
  //     orderDirection: "asc",
  //   },
  //   {
  //     pagination: { offset: 1, limit: 3 },
  //     orderBy: "payerIpId",
  //     orderDirection: "desc",
  //   },
  // ];
  // for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
  //   test(`Should return Royalty Pays list with pagination ${JSON.stringify(
  //     pagination
  //   )}, order by ${orderBy} and order direction ${orderDirection}`, async ({
  //     request,
  //     royaltiesPayments,
  //   }) => {
  //     const payload = {
  //       options: { pagination, orderBy, orderDirection },
  //     };
  //     const response = await request.post(endpoint, {
  //       data: payload,
  //     });
  //     expect(response.status()).toBe(200);

  //     const { errors, data } = await response.json();
  //     expect(errors).toBeUndefined();
  //     if (pagination.offset < royaltiesPayments.length) {
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

  test("Should return Royalty Pays list with filter", async ({
    request,
    royaltiesPayments,
  }) => {
    const whereParams = [
      { where: { payerIpId: royaltiesPayments[0].payerIpId }, exists: true },
      {
        where: { payerIpId: "0x80ad6a261618b4fe3c2385f57e1ad7e614629999" },
        exists: false,
      },
      {
        where: { receiverIpId: royaltiesPayments[0].receiverIpId },
        exists: true,
      },
      {
        where: { receiverIpId: "0x80ad6a261618b4fe3c2385f57e1ad7e614629999" },
        exists: false,
      },
      { where: { sender: royaltiesPayments[0].sender }, exists: true },
      {
        where: { sender: "0xf398c12a45bc409b6c652e25bb0a3e7024929999" },
        exists: false,
      },
      { where: { token: royaltiesPayments[0].token }, exists: true },
      {
        where: { token: "0x857308523a01b430cb112400976b9fc4a6429999" },
        exists: false,
      },
      {
        where: {
          payerIpId: royaltiesPayments[0].payerIpId,
          token: royaltiesPayments[0].token,
        },
        exists: true,
      },
      {
        where: {
          receiverIpId: royaltiesPayments[0].receiverIpId,
          sender: royaltiesPayments[0].sender,
        },
        exists: true,
      },
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
          for (const item of data) {
            expect(item).toMatchObject(where);
          }
        } else {
          expect(data.length).toBe(0);
        }
      });
    }
  });

  test("Should return Royalty Pays list with filter, order and pagination", async ({
    request,
    royaltiesPayments,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "id",
        orderDirection: "asc",
        where: { payerIpId: royaltiesPayments[0].payerIpId },
      },
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "payerIpId",
        orderDirection: "desc",
        where: {
          payerIpId: royaltiesPayments[0].payerIpId,
          token: royaltiesPayments[0].token,
        },
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
