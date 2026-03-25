import type { ResumeData } from "../../types/resume";

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, skills, experience, education, projects } =
    data;
  return (
    <div
      className="bg-white text-gray-900 p-8 min-h-full font-sans text-sm leading-relaxed"
      id="resume-preview"
    >
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-lg text-gray-600 mt-1">{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-2 text-gray-500 text-xs">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Summary
          </h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="border border-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {exp.role || "Role"}
                  </h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap">
                  {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-1 text-xs">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.school}</p>
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                {proj.url && (
                  <span className="text-blue-500 text-xs">{proj.url}</span>
                )}
              </div>
              {proj.technologies && (
                <p className="text-gray-500 text-xs">{proj.technologies}</p>
              )}
              {proj.description && (
                <p className="text-gray-600 text-xs mt-1">{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
