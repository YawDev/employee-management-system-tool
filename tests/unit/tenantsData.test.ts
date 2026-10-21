import { createHttpClient, getAuthHeaders } from "@/lib/data/client";
import {
  getTenant,
  getTenantOrganizations,
  getTenantRows,
  getTenants,
} from "@/lib/data/core/tenants";

jest.mock("@/lib/data/client", () => ({
  createHttpClient: jest.fn(),
  getAuthHeaders: jest.fn(),
}));

const get = jest.fn();
const auth = { Authorization: "Bearer token" };

const tenants = [
  { tenantId: 1, uid: "uid-1", name: "Acme Corp", logo: "acme.png", organizationCount: 2 },
  { tenantId: 2, uid: "uid-2", name: "Globex", logo: null, organizationCount: 0 },
];

const organizations = [
  { organizationId: 1, name: "Acme Retail", tenantId: 1, industry: "Retail", tenantName: "Acme Corp" },
  { organizationId: 2, name: "Acme Labs", tenantId: 1, industry: "Research", tenantName: "Acme Corp" },
  { organizationId: 3, name: "Globex Energy", tenantId: 2, industry: "Energy", tenantName: "Globex" },
];

beforeEach(() => {
  jest.clearAllMocks();
  (createHttpClient as jest.Mock).mockReturnValue({ get });
  (getAuthHeaders as jest.Mock).mockResolvedValue(auth);
});

describe("tenants data layer", () => {
  it("getTenants calls get-all-tenants on the microservice with the bearer header", async () => {
    get.mockResolvedValue({ data: tenants });

    const result = await getTenants();

    expect(createHttpClient).toHaveBeenCalledWith("emtCore");
    expect(get).toHaveBeenCalledWith("/sys-api/get-all-tenants", { headers: auth });
    expect(result).toEqual(tenants);
  });

  it("getTenantRows uses the organizationCount from the API", async () => {
    get.mockResolvedValue({ data: tenants });

    expect(await getTenantRows()).toEqual([
      { tenantId: 1, name: "Acme Corp", organizationCount: 2 },
      { tenantId: 2, name: "Globex", organizationCount: 0 },
    ]);
  });

  it("getTenant returns the matching tenant", async () => {
    get.mockResolvedValue({ data: tenants });

    expect(await getTenant(2)).toEqual(tenants[1]);
  });

  it("getTenant returns undefined for an unknown id", async () => {
    get.mockResolvedValue({ data: tenants });

    expect(await getTenant(99)).toBeUndefined();
  });

  it("getTenantOrganizations keeps only the tenant's organizations", async () => {
    get.mockResolvedValue({ data: { organizations } });

    const result = await getTenantOrganizations(1);

    expect(get).toHaveBeenCalledWith("/sys-api/get-all-organizations", { headers: auth });
    expect(result.map((org) => org.organizationId)).toEqual([1, 2]);
  });

  it("propagates API errors", async () => {
    get.mockRejectedValue(new Error("Network Error"));

    await expect(getTenants()).rejects.toThrow("Network Error");
  });
});
