import { describe, it, expect } from "vitest";
import { resumeToPlainText, getAllSkills } from "@/lib/resumeToText";
import { emptyResume, sampleResume } from "@/data/resumeTypes";

describe("resumeToPlainText", () => {
  it("returns empty string for empty resume", () => {
    expect(resumeToPlainText(emptyResume)).toBe("");
  });

  it("includes name in output", () => {
    const text = resumeToPlainText(sampleResume);
    expect(text).toContain("Arjun Mehta");
  });

  it("includes section headers", () => {
    const text = resumeToPlainText(sampleResume);
    expect(text).toContain("SUMMARY");
    expect(text).toContain("EXPERIENCE");
    expect(text).toContain("EDUCATION");
    expect(text).toContain("PROJECTS");
    expect(text).toContain("SKILLS");
    expect(text).toContain("LINKS");
  });

  it("includes tech stack in brackets", () => {
    const text = resumeToPlainText(sampleResume);
    expect(text).toContain("[React, Node.js, PostgreSQL, Socket.io]");
  });
});

describe("getAllSkills", () => {
  it("flattens all categories", () => {
    const all = getAllSkills(sampleResume.skills);
    expect(all).toContain("React");
    expect(all).toContain("Team Leadership");
    expect(all).toContain("Docker");
    expect(all.length).toBe(
      sampleResume.skills.technical.length + sampleResume.skills.soft.length + sampleResume.skills.tools.length
    );
  });

  it("returns empty for no skills", () => {
    expect(getAllSkills(emptyResume.skills)).toEqual([]);
  });
});
