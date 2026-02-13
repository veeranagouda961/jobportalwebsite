import { describe, it, expect } from "vitest";
import { computeATSScore } from "@/lib/atsScoring";
import { emptyResume, sampleResume, ResumeData } from "@/data/resumeTypes";

describe("ATS Score Calculator", () => {
  it("returns 0 for empty resume", () => {
    const { score } = computeATSScore(emptyResume);
    expect(score).toBe(0);
  });

  it("gives +10 for name", () => {
    const r: ResumeData = { ...emptyResume, personal: { ...emptyResume.personal, name: "John" } };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +10 for email", () => {
    const r: ResumeData = { ...emptyResume, personal: { ...emptyResume.personal, email: "a@b.com" } };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +5 for phone", () => {
    const r: ResumeData = { ...emptyResume, personal: { ...emptyResume.personal, phone: "123" } };
    expect(computeATSScore(r).score).toBe(5);
  });

  it("gives +10 for summary > 50 chars", () => {
    const r: ResumeData = { ...emptyResume, summary: "A".repeat(51) };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +10 for action verbs in summary", () => {
    const r: ResumeData = { ...emptyResume, summary: "I built and designed scalable systems that improved performance significantly over time." };
    // summary > 50 chars (+10) + action verbs (+10) = 20
    expect(computeATSScore(r).score).toBe(20);
  });

  it("gives +15 for experience with description", () => {
    const r: ResumeData = {
      ...emptyResume,
      experience: [{ id: "1", company: "Co", role: "Dev", startDate: "2023", endDate: "2024", description: "Did stuff" }],
    };
    expect(computeATSScore(r).score).toBe(15);
  });

  it("gives +10 for education", () => {
    const r: ResumeData = {
      ...emptyResume,
      education: [{ id: "1", institution: "MIT", degree: "BS", field: "CS", startYear: "2020", endYear: "2024" }],
    };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +10 for 5+ skills", () => {
    const r: ResumeData = {
      ...emptyResume,
      skills: { technical: ["A", "B", "C", "D", "E"], soft: [], tools: [] },
    };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +10 for 1+ project", () => {
    const r: ResumeData = {
      ...emptyResume,
      projects: [{ id: "1", title: "P", description: "", techStack: [], liveUrl: "", githubUrl: "" }],
    };
    expect(computeATSScore(r).score).toBe(10);
  });

  it("gives +5 for LinkedIn", () => {
    const r: ResumeData = { ...emptyResume, links: { ...emptyResume.links, linkedin: "https://linkedin.com/in/x" } };
    expect(computeATSScore(r).score).toBe(5);
  });

  it("gives +5 for GitHub", () => {
    const r: ResumeData = { ...emptyResume, links: { ...emptyResume.links, github: "https://github.com/x" } };
    expect(computeATSScore(r).score).toBe(5);
  });

  it("sample resume scores high (>=90)", () => {
    const { score } = computeATSScore(sampleResume);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it("caps at 100", () => {
    const { score } = computeATSScore(sampleResume);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns suggestions for missing items", () => {
    const { suggestions } = computeATSScore(emptyResume);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => s.includes("+"))).toBe(true);
  });

  it("returns no suggestions for complete resume", () => {
    const { suggestions } = computeATSScore(sampleResume);
    expect(suggestions.length).toBe(0);
  });
});
