import { request, test, expect, APIRequestContext } from "@playwright/test";
import crypto from "crypto";

test.describe("Should return 401 for invalid api key @API-KEY", () => {
  let context: APIRequestContext;
  test.beforeAll(async () => {
    context = await request.newContext({
      baseURL: process.env.API_BASE_URL,
      extraHTTPHeaders: {
        accept: "application/json",
        "content-type": "application/json",
        "X-API-KEY": crypto.randomBytes(24).toString("base64url"),
      },
    });
  });

  test("Post /assets", async () => {
    const response = await context.post("./assets");
    expect(response.status()).toBe(401);
  });

  test("Get /assets/{assetId}", async () => {
    const response = await context.get("./assets/1");
    expect(response.status()).toBe(401);
  });

  test("Post /collections", async () => {
    const response = await context.post("./collections");
    expect(response.status()).toBe(401);
  });

  test("Get /collections/{collectionId}", async () => {
    const response = await context.get("./collections/1");
    expect(response.status()).toBe(401);
  });

  test("Post /disputes", async () => {
    const response = await context.post("./disputes");
    expect(response.status()).toBe(401);
  });

  test("Get /disputes/{disputeId}", async () => {
    const response = await context.get("./disputes/1");
    expect(response.status()).toBe(401);
  });

  test("Post /ipapolicies", async () => {
    const response = await context.post("./ipapolicies");
    expect(response.status()).toBe(401);
  });

  test("Get /ipapolicies/{ipapolicyId}", async () => {
    const response = await context.get("./ipapolicies/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses", async () => {
    const response = await context.post("./licenses");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/{licenseId}", async () => {
    const response = await context.get("./licenses/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses/mintingfees", async () => {
    const response = await context.post("./licenses/mintingfees");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/mintingfees/{mintingfeeId}", async () => {
    const response = await context.get("./licenses/mintingfees/1");
    expect(response.status()).toBe(401);
  });

  test("Post /licenses/owners", async () => {
    const response = await context.post("./licenses/owners");
    expect(response.status()).toBe(401);
  });

  test("Get /licenses/owners/{ownerId}", async () => {
    const response = await context.get("./licenses/owners/1");
    expect(response.status()).toBe(401);
  });

  test("Post /modules", async () => {
    const response = await context.post("./modules");
    expect(response.status()).toBe(401);
  });

  test("Get /modules/{moduleId}", async () => {
    const response = await context.get("./modules/1");
    expect(response.status()).toBe(401);
  });

  test("Post /permissions", async () => {
    const response = await context.post("./permissions");
    expect(response.status()).toBe(401);
  });

  test("Get /permissions/{permissionId}", async () => {
    const response = await context.get("./permissions/1");
    expect(response.status()).toBe(401);
  });

  test("Post /policies", async () => {
    const response = await context.post("./policies");
    expect(response.status()).toBe(401);
  });

  test("Get /policies/{policyId}", async () => {
    const response = await context.get("./policies/1");
    expect(response.status()).toBe(401);
  });

  test("Post /policies/frameworks", async () => {
    const response = await context.post("./policies/frameworks");
    expect(response.status()).toBe(401);
  });

  test("Get /policies/frameworks/{frameworkId}", async () => {
    const response = await context.get("./policies/frameworks/1");
    expect(response.status()).toBe(401);
  });

  test("Post /royalties/payments", async () => {
    const response = await context.post("./royalties/payments");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/payments/{paymentId}", async () => {
    const response = await context.get("./royalties/payments/1");
    expect(response.status()).toBe(401);
  });

  test("Post /royalties/policies", async () => {
    const response = await context.post("./royalties/policies");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/policies/{policyId}", async () => {
    const response = await context.get("./royalties/policies/1");
    expect(response.status()).toBe(401);
  });

  test("Get /royalties/splits/{splitId}", async () => {
    const response = await context.get("./royalties/splits/1");
    expect(response.status()).toBe(401);
  });

  test("Post /transactions", async () => {
    const response = await context.post("./transactions");
    expect(response.status()).toBe(401);
  });

  test("Get /transactions/{transactionId}", async () => {
    const response = await context.get("./transactions/1");
    expect(response.status()).toBe(401);
  });
});
