const { ProfileNotFound } = require("../errors");
const { getProfileById } = require("./profile");

describe("getProfileById", () => {
  it("getProfileById should get profile with correct id", async () => {
    const profile = await getProfileById(1);
    expect(profile).toBeDefined();
    expect(profile.id).toBe(1);
    expect(profile.firstName).toBeDefined();
  });

  it("getProfileById should not get profile with incorrect id", async () => {
    await expect(getProfileById(9999999999)).rejects.toThrow(
      ProfileNotFound.message
    );
  });
});
