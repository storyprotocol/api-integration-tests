import { test as base } from "@playwright/test";
import { ApiPrefix } from "../../constants";

type TestOptions = {
  assets: Array<{
    id: string;
    chainId: string;
    tokenId: string;
    metadataResolverAddress: string;
    tokenContract: string;
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
  ipapolicies: Array<{
    id: string;
    ipId: string;
    policyId: string;
    active: boolean;
    inherited: boolean;
  }>;
  licenses: Array<{
    id: string;
    policyId: string;
    licensorIpId: string;
    transferable: boolean;
  }>;
  licensesMintingfees: Array<{
    id: string;
    token: string;
    payer: string;
    receiverIpId: string;
  }>;
  licensesOwners: Array<{
    id: string;
    owner: string;
    policyId: string;
  }>;
};

export const test = base.extend<TestOptions>({
  assets: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/assets");
    const { data } = await response.json();
    await use(data);
  },
  disputes: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/disputes");
    const { data } = await response.json();
    await use(data);
  },
  collections: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/collections");
    const { data } = await response.json();
    await use(data);
  },
  ipapolicies: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/ipapolicies");
    const { data } = await response.json();
    await use(data);
  },
  licenses: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses");
    const { data } = await response.json();
    await use(data);
  },
  licensesMintingfees: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses/mintingfees");
    const { data } = await response.json();
    await use(data);
  },
  licensesOwners: async ({ request }, use) => {
    const response = await request.post(ApiPrefix + "/licenses/owners");
    const { data } = await response.json();
    await use(data);
  },
});
export { expect } from "@playwright/test";
