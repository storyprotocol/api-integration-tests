import { test as base } from "@playwright/test";

type TestOptions = {
  assets: Array<{
    id: string;
    nftMetadata: {
      chainId: string;
      tokenId: string;
      tokenContract: string;
    }
  }>;
  disputes: Array<{
    id: string;
    targetIpId: string;
    targetTag: string;
    currentTag: string;
    initiator: string;
  }>;
  collections: Array<{
    id: string;
  }>;
  licensesMintingfees: Array<{
    id: string;
    token: string;
    payer: string;
    receiverIpId: string;
  }>;
  modules: Array<{
    id: string;
    name: string;
  }>;
  permissionsList: Array<{
    id: string;
    signer: string;
    to: string;
  }>;
  transactions: Array<{
    id: string;
    ipId: string;
    resourceId: string;
    actionType: string;
  }>;
  royaltiesPayments: Array<{
    id: string;
    payerIpId: string;
    receiverIpId: string;
    sender: string;
    token: string;
  }>;
  royaltiesPolicies: Array<{
    id: string;
  }>;
  licensesTemplates: Array<{
    id: string;
    name: string;
  }>;
  licensesTerms: Array<{
    id: string;
    licenseTemplate: string;
  }>;
  licensesIpTerms: Array<{
    id: string;
    ipId: string;
  }>;
  licensesTokens: Array<{
    id: string;
    licensorIpId: string;
  }>;
};

export const test = base.extend<TestOptions>({
  assets: async ({ request }, use) => {
    const response = await request.post("./assets");
    const { data } = await response.json();
    await use(data);
  },
  disputes: async ({ request }, use) => {
    const response = await request.post("./disputes");
    const { data } = await response.json();
    await use(data);
  },
  collections: async ({ request }, use) => {
    const response = await request.post("./collections");
    const { data } = await response.json();
    await use(data);
  },
  licensesMintingfees: async ({ request }, use) => {
    const response = await request.post("./licenses/mintingfees");
    const { data } = await response.json();
    await use(data);
  },
  modules: async ({ request }, use) => {
    const response = await request.post("./modules");
    const { data } = await response.json();
    await use(data);
  },
  permissionsList: async ({ request }, use) => {
    const response = await request.post("./permissions");
    const { data } = await response.json();
    await use(data);
  },
  transactions: async ({ request }, use) => {
    const response = await request.post("./transactions");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPayments: async ({ request }, use) => {
    const response = await request.post("./royalties/payments");
    const { data } = await response.json();
    await use(data);
  },
  royaltiesPolicies: async ({ request }, use) => {
    const response = await request.post("./royalties/policies");
    const { data } = await response.json();
    await use(data);
  },
  licensesTemplates: async ({ request }, use) => {
    const response = await request.post("./licenses/templates");
    const { data } = await response.json();
    await use(data);
  },
  licensesTerms: async ({ request }, use) => {
    const response = await request.post("./licenses/terms");
    const { data } = await response.json();
    await use(data);
  },
  licensesIpTerms: async ({ request }, use) => {
    const response = await request.post("./licenses/ip/terms");
    const { data } = await response.json();
    await use(data);
  },
  licensesTokens: async ({ request }, use) => {
    const response = await request.post("./licenses/tokens");
    const { data } = await response.json();
    await use(data);
  }
});
export { expect } from "@playwright/test";
