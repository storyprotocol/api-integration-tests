import { test, expect } from "../fixtures/base";
import { ApiPrefix } from "../../constants";

const endpoint = ApiPrefix + "/policies";

test.describe("List Policies @Policies", async () => {
  test("Should return default Policies list", async ({ request }) => {
    const response = await request.post(endpoint);
    expect(response.status()).toBe(200);

    const { errors, data } = await response.json();
    expect(errors).toBeUndefined();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
    expect(typeof data[0].id).toBe("string");
    expect(typeof data[0].mintingFee).toBe("string");
    expect(typeof data[0].mintingFeeToken).toBe("string");
    expect(typeof data[0].policyFrameworkManager).toBe("string");
    expect(typeof data[0].frameworkData).toBe("string");
    expect(typeof data[0].royaltyData).toBe("string");
    expect(typeof data[0].royaltyPolicy).toBe("string");
    expect(typeof data[0].pil.id).toBe("string");
    expect(typeof data[0].pil.attribution).toBe("boolean");
    expect(typeof data[0].pil.commercialAttribution).toBe("boolean");
    expect(typeof data[0].pil.commercialRevShare).toBe("string");
    expect(typeof data[0].pil.commercialUse).toBe("boolean");
    expect(typeof data[0].pil.commercializerChecker).toBe("string");
    expect(typeof data[0].pil.commercializerCheckerData).toBe("string");
    expect(typeof data[0].pil.derivativesAllowed).toBe("boolean");
    expect(typeof data[0].pil.derivativesApproval).toBe("boolean");
    expect(typeof data[0].pil.derivativesAttribution).toBe("boolean");
    expect(typeof data[0].pil.derivativesReciprocal).toBe("boolean");
    expect(Array.isArray(data[0].pil.contentRestrictions)).toBeTruthy();
    expect(Array.isArray(data[0].pil.distributionChannels)).toBeTruthy();
    expect(Array.isArray(data[0].pil.territories)).toBeTruthy();
    expect(typeof data[0].blockNumber).toBe("string");
    expect(typeof data[0].blockTimestamp).toBe("string");
  });

  const pageParams = [
    { pagination: { offset: 0, limit: 5 } },
    { pagination: { offset: 1, limit: 4 } },
    { pagination: { offset: 2, limit: 3 } },
  ];
  for (const { pagination } of pageParams) {
    test(`Should return Policies list with pagination ${JSON.stringify(
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
        data: { options: { pagination: { limit: 30 } } },
      });
      const offsetJson = await offsetResponse.json();
      const firstItem = offsetJson.data[pagination.offset];

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeLessThanOrEqual(pagination.limit);
      expect(data[0]).toMatchObject(firstItem);
    });
  }

  const orderParams = [
    { orderBy: "id", orderDirection: "desc" },
    { orderBy: "id", orderDirection: "asc" },
    { orderBy: "mintingFee", orderDirection: "desc" },
    { orderBy: "mintingFee", orderDirection: "asc" },
    { orderBy: "mintingFeeToken", orderDirection: "desc" },
    { orderBy: "mintingFeeToken", orderDirection: "asc" },
    { orderBy: "policyFrameworkManager", orderDirection: "desc" },
    { orderBy: "policyFrameworkManager", orderDirection: "asc" },
    { orderBy: "frameworkData", orderDirection: "desc" },
    { orderBy: "frameworkData", orderDirection: "asc" },
    { orderBy: "royaltyData", orderDirection: "desc" },
    { orderBy: "royaltyData", orderDirection: "asc" },
    { orderBy: "royaltyPolicy", orderDirection: "desc" },
    { orderBy: "royaltyPolicy", orderDirection: "asc" },
    { orderBy: "blockNumber", orderDirection: "desc" },
    { orderBy: "blockNumber", orderDirection: "asc" },
    { orderBy: "blockTimestamp", orderDirection: "desc" },
    { orderBy: "blockTimestamp", orderDirection: "asc" },
  ];
  for (const { orderBy, orderDirection } of orderParams) {
    test(`Should return Policies list with order by ${orderBy} and order direction ${orderDirection}`, async ({
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
        let item: string | number;
        let nextItem: string | number;
        if (orderBy === "mintingFee") {
          item = parseInt(data[i][orderBy]);
          nextItem = parseInt(data[i + 1][orderBy]);
        } else {
          item = data[i][orderBy].trim() || "\uFFFF";
          nextItem = data[i + 1][orderBy].trim() || "\uFFFF";
        }
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
      orderBy: "mintingFeeToken",
      orderDirection: "desc",
    },
  ];
  for (const { pagination, orderBy, orderDirection } of pageAndOrderParams) {
    test(`Should return Policies list with pagination ${JSON.stringify(
      pagination
    )} and order by ${orderBy} ${orderDirection}`, async ({ request }) => {
      const payload = {
        options: { pagination, orderBy, orderDirection },
      };
      const response = await request.post(endpoint, {
        data: payload,
      });
      expect(response.status()).toBe(200);

      const { errors, data } = await response.json();
      expect(errors).toBeUndefined();
      expect(data.length).toBeGreaterThan(0);
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

  test("Should return Policies list with filter", async ({
    request,
    policies,
  }) => {
    const whereParams = [
      { where: { mintingFeeToken: policies[1].mintingFeeToken }, exists: true },
      {
        where: {
          mintingFeeToken: "0x0000000000000000000000000000000000000aaa",
        },
        exists: false,
      },
      {
        where: { policyFrameworkManager: policies[0].policyFrameworkManager },
        exists: true,
      },
      {
        where: {
          policyFrameworkManager: "0xeaabf2b80b7e069ee449b5629590a1cc0f9bc999",
        },
        exists: false,
      },
      { where: { royaltyPolicy: policies[0].royaltyPolicy }, exists: true },
      {
        where: { royaltyPolicy: "0x16ef58e959522727588921a92e9084d36e5d3999" },
        exists: false,
      },
      {
        where: {
          royaltyPolicy: policies[1].royaltyPolicy,
          policyFrameworkManager: policies[1].policyFrameworkManager,
        },
        exists: true,
      },
    ];
    for (const { where, exists } of whereParams) {
      await test.step(`Query with where ${JSON.stringify(where)}`, async () => {
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

  test("Should return Policies list with filter, order and pagination", async ({
    request,
    policies,
  }) => {
    const params = [
      {
        pagination: { offset: 0, limit: 5 },
        orderBy: "id",
        orderDirection: "asc",
        where: {
          mintingFeeToken: policies[0].mintingFeeToken,
          policyFrameworkManager: policies[0].policyFrameworkManager,
        },
      },
      {
        pagination: { offset: 0, limit: 3 },
        orderBy: "royaltyPolicy",
        orderDirection: "desc",
        where: {
          royaltyPolicy: policies[1].royaltyPolicy,
          policyFrameworkManager: policies[1].policyFrameworkManager,
        },
      },
    ];
    for (const p of params) {
      await test.step(`Query with pagination ${JSON.stringify(
        p.pagination
      )}, order by ${p.orderBy} and order direction ${
        p.orderDirection
      }, and filter ${JSON.stringify(p.where)}`, async () => {
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
