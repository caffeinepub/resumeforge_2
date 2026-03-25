import type { ResumeData } from "../../types/resume";

export function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, summary, skills, experience, education, projects } =
    data;
  return (
    <div
      className="bg-white text-gray-900 min-h-full font-sans text-sm flex"
      id="resume-preview"
    >
      <div className="bg-gradient-to-b from-purple-700 to-purple-900 text-white p-6 w-2/5 flex-shrink-0">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mb-3">
            {personalInfo.fullName
              ? personalInfo.fullName[0].toUpperCase()
              : "?"}
          </div>
          <h1 className="text-xl font-bold leading-tight">
            {personalInfo.fullName || "Your Name"}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-purple-200 text-sm mt-1">
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
            Contact
          </h2>
          <div className="space-y-2 text-xs text-purple-100">
            {personalInfo.email && (
              <p className="break-all">{personalInfo.email}</p>
            )}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && (
              <p className="break-all">{personalInfo.linkedin}</p>
            )}
            {personalInfo.website && (
              <p className="break-all">{personalInfo.website}</p>
            )}
          </div>
        </div>
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-semibold text-white text-xs">
                  {edu.degree}
                </h3>
                {edu.field && (
                  <p className="text-purple-200 text-xs">{edu.field}</p>
                )}
                <p className="text-purple-300 text-xs">{edu.school}</p>
                <p className="text-purple-400 text-xs">
                  {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 border-b-2 border-purple-200 pb-1 mb-2">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed text-xs">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-700 border-b-2 border-purple-200 pb-1 mb-3">
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-purple-600 text-xs font-medium">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded">
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
          <div>
            <h2 className="text-lg font-bold text-purple-700 border-b-2 border-purple-200 pb-1 mb-3">
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  {proj.url && (
                    <span className="text-purple-500 text-xs">{proj.url}</span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-xs text-purple-500 font-medium">
                    {proj.technologies}
                  </p>
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
  );
}
