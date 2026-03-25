import type { ResumeData } from "../../types/resume";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, skills, experience, education, projects } =
    data;
  return (
    <div
      className="bg-white text-gray-900 min-h-full font-sans text-sm"
      id="resume-preview"
    >
      <div className="bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-blue-400 text-lg mt-1 font-medium">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-3 text-gray-300 text-xs">
          {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>in {personalInfo.linkedin}</span>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0">
        <div className="bg-gray-50 p-6 col-span-1">
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                Skills
              </h2>
              <div className="flex flex-col gap-1">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-xs">
                    {edu.degree}
                  </h3>
                  {edu.field && (
                    <p className="text-gray-500 text-xs">{edu.field}</p>
                  )}
                  <p className="text-gray-700 text-xs font-medium">
                    {edu.school}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {edu.startDate} – {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-span-2 p-6">
          {summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                Profile
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}
          {experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                Experience
              </h2>
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="mb-4 pl-3 border-l-2 border-blue-200"
                >
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <div className="flex justify-between">
                    <p className="text-blue-600 text-xs font-medium">
                      {exp.company}
                    </p>
                    <span className="text-gray-400 text-xs">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {projects.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
                Projects
              </h2>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="mb-3 pl-3 border-l-2 border-blue-200"
                >
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.technologies && (
                    <p className="text-blue-500 text-xs">{proj.technologies}</p>
                  )}
                  {proj.description && (
                    <p className="text-gray-600 text-xs mt-1">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
