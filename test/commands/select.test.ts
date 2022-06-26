import { expect, test } from "@oclif/test";

describe("gscreds", () => {
  test
    .stdout()
    .it("shows help message", (ctx) => {
      expect(ctx.stdout).to.contain("");
    });
});
