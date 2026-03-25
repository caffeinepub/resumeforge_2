import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Variant_creative_minimal_modern } from "../backend";
import { CreativeTemplate } from "../components/templates/CreativeTemplate";
import { MinimalTemplate } from "../components/templates/MinimalTemplate";
import { ModernTemplate } from "../components/templates/ModernTemplate";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { ResumeData, TemplateType } from "../types/resume";
import { emptyResumeData } from "../types/resume";

const STEPS = [
  "Personal Info",
  "Summary",
  "Skills",
  "Experience",
  "Education",
  "Projects",
];
const TEMPLATES: TemplateType[] = ["minimal", "modern", "creative"];
const LS_KEY = "resumeforge_draft";

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function Builder() {
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const resumeId = params?.id;
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();

  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState<TemplateType>("minimal");
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [title, setTitle] = useState("My Resume");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!resumeId);
  const previewRef = useRef<HTMLDivElement>(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (!resumeId || !actor) return;
    actor
      .getResumes()
      .then((resumes) => {
        const r = resumes.find((x) => x.id === resumeId);
        if (r) {
          setTitle(r.title);
          setTemplate(r.template as TemplateType);
          try {
            setData(JSON.parse(r.jsonData));
          } catch {}
        }
      })
      .finally(() => setLoading(false));
  }, [resumeId, actor]);

  useEffect(() => {
    if (resumeId) return;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          data?: ResumeData;
          template?: TemplateType;
          title?: string;
        };
        if (parsed.data) setData(parsed.data);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.title) setTitle(parsed.title);
      }
    } catch {}
  }, [resumeId]);

  useEffect(() => {
    if (resumeId) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ data, template, title }));
  }, [data, template, title, resumeId]);

  const updatePersonal = (field: string, value: string) =>
    setData((d) => ({
      ...d,
      personalInfo: { ...d.personalInfo, [field]: value },
    }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || data.skills.includes(s)) return;
    setData((d) => ({ ...d, skills: [...d.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (s: string) =>
    setData((d) => ({ ...d, skills: d.skills.filter((x) => x !== s) }));

  const addExperience = () =>
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        {
          id: uid(),
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));

  const updateExp = (id: string, field: string, value: string | boolean) =>
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));

  const removeExp = (id: string) =>
    setData((d) => ({
      ...d,
      experience: d.experience.filter((e) => e.id !== id),
    }));

  const addEducation = () =>
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        {
          id: uid(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));

  const updateEdu = (id: string, field: string, value: string) =>
    setData((d) => ({
      ...d,
      education: d.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));

  const removeEdu = (id: string) =>
    setData((d) => ({
      ...d,
      education: d.education.filter((e) => e.id !== id),
    }));

  const addProject = () =>
    setData((d) => ({
      ...d,
      projects: [
        ...d.projects,
        { id: uid(), name: "", url: "", description: "", technologies: "" },
      ],
    }));

  const updateProj = (id: string, field: string, value: string) =>
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));

  const removeProj = (id: string) =>
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      if (resumeId) {
        await actor.updateResume({
          id: resumeId,
          title,
          jsonData: JSON.stringify(data),
          template: template as unknown as Variant_creative_minimal_modern,
          createdAt: BigInt(0),
          updatedAt: BigInt(Date.now() * 1_000_000),
        });
        toast.success("Resume updated!");
      } else {
        const id = await actor.createResume({
          id: uid(),
          title,
          jsonData: JSON.stringify(data),
          template: template as unknown as Variant_creative_minimal_modern,
          createdAt: BigInt(Date.now() * 1_000_000),
          updatedAt: BigInt(Date.now() * 1_000_000),
        });
        toast.success("Resume saved!");
        localStorage.removeItem(LS_KEY);
        navigate({ to: `/builder/${id}` });
      }
    } catch {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const ic =
    "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
  const lc = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in to build your resume
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Save your progress and access it from anywhere.
          </p>
          <button
            type="button"
            onClick={login}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm font-semibold text-gray-900 dark:text-white bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500 px-1 py-0.5 max-w-xs"
          placeholder="Resume title"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🖨️ Print / PDF
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden print:hidden">
          <div className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-700">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-shrink-0 px-3 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  step === i
                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                {(
                  [
                    ["fullName", "Full Name", "John Doe"],
                    ["jobTitle", "Job Title", "Software Engineer"],
                    ["email", "Email", "john@example.com"],
                    ["phone", "Phone", "+1 234 567 8900"],
                    ["location", "Location", "San Francisco, CA"],
                    ["linkedin", "LinkedIn URL", "linkedin.com/in/johndoe"],
                    ["website", "Website", "johndoe.com"],
                  ] as [string, string, string][]
                ).map(([field, label, placeholder]) => (
                  <div key={field}>
                    <span className={lc}>{label}</span>
                    <input
                      className={ic}
                      placeholder={placeholder}
                      value={
                        (
                          data.personalInfo as unknown as Record<string, string>
                        )[field] || ""
                      }
                      onChange={(e) => updatePersonal(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Professional Summary
                </h2>
                <p className="text-xs text-gray-500">
                  Write 2-4 sentences about your experience, strengths, and
                  goals.
                </p>
                <textarea
                  className={`${ic} resize-none h-40`}
                  placeholder="Experienced software engineer with 5+ years..."
                  value={data.summary}
                  onChange={(e) =>
                    setData((d) => ({ ...d, summary: e.target.value }))
                  }
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Skills
                </h2>
                <div className="flex gap-2">
                  <input
                    className={ic}
                    placeholder="Add a skill (e.g. React)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex-shrink-0"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.skills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2.5 py-1 rounded-full"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Work Experience
                  </h2>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-xs font-medium text-purple-600 border border-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-50"
                  >
                    + Add
                  </button>
                </div>
                {data.experience.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No experience added yet.
                  </p>
                )}
                {data.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Entry
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExp(exp.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        × Remove
                      </button>
                    </div>
                    {(
                      [
                        ["company", "Company", "Acme Inc."],
                        ["role", "Role / Title", "Senior Engineer"],
                        ["startDate", "Start Date", "2020-01"],
                        ["endDate", "End Date", "2023-12"],
                      ] as [string, string, string][]
                    ).map(([f, l, p]) => (
                      <div key={f}>
                        <span className={lc}>{l}</span>
                        <input
                          className={ic}
                          placeholder={p}
                          value={
                            (exp as unknown as Record<string, string>)[f] || ""
                          }
                          onChange={(e) => updateExp(exp.id, f, e.target.value)}
                        />
                      </div>
                    ))}
                    <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) =>
                          updateExp(exp.id, "current", e.target.checked)
                        }
                        className="rounded"
                      />
                      Currently working here
                    </label>
                    <div>
                      <span className={lc}>Description</span>
                      <textarea
                        className={`${ic} resize-none h-24`}
                        placeholder="Key responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) =>
                          updateExp(exp.id, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Education
                  </h2>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-xs font-medium text-purple-600 border border-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-50"
                  >
                    + Add
                  </button>
                </div>
                {data.education.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No education added yet.
                  </p>
                )}
                {data.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Degree
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEdu(edu.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        × Remove
                      </button>
                    </div>
                    {(
                      [
                        ["school", "School / University", "MIT"],
                        ["degree", "Degree", "Bachelor of Science"],
                        ["field", "Field of Study", "Computer Science"],
                        ["startDate", "Start Year", "2016"],
                        ["endDate", "End Year", "2020"],
                      ] as [string, string, string][]
                    ).map(([f, l, p]) => (
                      <div key={f}>
                        <span className={lc}>{l}</span>
                        <input
                          className={ic}
                          placeholder={p}
                          value={
                            (edu as unknown as Record<string, string>)[f] || ""
                          }
                          onChange={(e) => updateEdu(edu.id, f, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Projects
                  </h2>
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-xs font-medium text-purple-600 border border-purple-300 px-2.5 py-1 rounded-lg hover:bg-purple-50"
                  >
                    + Add
                  </button>
                </div>
                {data.projects.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No projects added yet.
                  </p>
                )}
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Project
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProj(proj.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        × Remove
                      </button>
                    </div>
                    {(
                      [
                        ["name", "Project Name", "My Awesome App"],
                        ["url", "URL / Link", "github.com/you/project"],
                        [
                          "technologies",
                          "Technologies",
                          "React, Node.js, PostgreSQL",
                        ],
                      ] as [string, string, string][]
                    ).map(([f, l, p]) => (
                      <div key={f}>
                        <span className={lc}>{l}</span>
                        <input
                          className={ic}
                          placeholder={p}
                          value={
                            (proj as unknown as Record<string, string>)[f] || ""
                          }
                          onChange={(e) =>
                            updateProj(proj.id, f, e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <div>
                      <span className={lc}>Description</span>
                      <textarea
                        className={`${ic} resize-none h-20`}
                        placeholder="What the project does and your role..."
                        value={proj.description}
                        onChange={(e) =>
                          updateProj(proj.id, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 p-4 flex justify-between print:hidden">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg disabled:opacity-40 hover:bg-purple-700 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 print:hidden">
            <span className="text-xs font-medium text-gray-500 mr-2">
              Template:
            </span>
            {TEMPLATES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-all ${
                  template === t
                    ? "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div
              ref={previewRef}
              className="bg-white shadow-xl rounded-lg overflow-hidden max-w-2xl mx-auto min-h-[800px]"
            >
              {template === "minimal" && <MinimalTemplate data={data} />}
              {template === "modern" && <ModernTemplate data={data} />}
              {template === "creative" && <CreativeTemplate data={data} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-preview, #resume-preview * { visibility: visible !important; }
          #resume-preview { position: fixed !important; left: 0 !important; top: 0 !important; width: 100% !important; z-index: 9999 !important; }
        }
      `}</style>
    </div>
  );
}
