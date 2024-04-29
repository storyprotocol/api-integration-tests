import { test, expect } from "../fixtures/base";

const endpoint = "./royalties/policies";

test.describe("List RoyaltyPolicies @Royalties", () => {
  test("Should return default Royalty Policies list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].royaltyStack).toBe("string");
    expect(typeof data[0].ipRoyaltyVault).toBe("string");
    expect(Array.isArray(data[0].targetAncestors ?? [])).toBeTruthy();
    expect(Array.isArray(data[0].targetRoyaltyAmount ?? [])).toBeTruthy();
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
    expect(data[0].id).toBeTruthy();
    expect(data[0].royaltyStack).toBeTruthy();
    expect(data[0].ipRoyaltyVault).toBeTruthy();
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
    test(`Should return Royalty Policies list with pagination ${JSON.stringify(
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
  //   { orderBy: "royaltyStack", orderDirection: "desc" },
  //   { orderBy: "royaltyStack", orderDirection: "asc" },
  //   { orderBy: "ipRoyaltyVault", orderDirection: "desc" },
  //   { orderBy: "ipRoyaltyVault", orderDirection: "asc" },
  //   { orderBy: "blockNumber", orderDirection: "desc" },
  //   { orderBy: "blockNumber", orderDirection: "asc" },
  //   { orderBy: "blockTimestamp", orderDirection: "desc" },
  //   { orderBy: "blockTimestamp", orderDirection: "asc" },
  // ];
  // for (const { orderBy, orderDirection } of orderParams) {
  //   test(`query with ${orderBy} ${orderDirection}`, async ({
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
  //       if (orderBy === "royaltyStack") {
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
  //     orderBy: "ipRoyaltyVault",
  //     orderDirection: "desc",
  //   },
  // ];
  // for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
  //   test(`Should return Royalty Policies list with pagination ${JSON.stringify(
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
});
