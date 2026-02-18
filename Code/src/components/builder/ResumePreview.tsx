'use client';

import type { ResumeData, Template } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Github, Link as LinkIcon, Mail, Phone, MapPin } from "lucide-react";

interface ResumePreviewProps {
  resume: ResumeData;
  template: Template;
  accentColor: string;
}

const Section = ({ title, children, show, template, className = '' }: { title: string, children: React.ReactNode, show: boolean, template: Template, className?: string }) => {
    if (!show) return null;
    
    const titleStyles: Record<Template, string> = {
        modern: "text-lg font-bold text-[var(--resume-accent)] mb-2 uppercase tracking-wider",
        classic: "text-sm font-bold uppercase tracking-widest border-b-2 border-neutral-300 pb-1 mb-3 text-neutral-800",
        minimal: "text-base font-bold mb-2 text-neutral-800"
    };

    return (
        <section className={cn("mb-4 break-inside-avoid", className)}>
            <h2 className={titleStyles[template]}>{title}</h2>
            {children}
        </section>
    );
}

const ModernLayout = ({ resume, accentColor }: { resume: ResumeData, accentColor: string }) => {
    const { personalInfo, summary, education, experience, projects, skills, links } = resume;
    return (
        <div 
            className="w-full h-full bg-white text-black font-sans text-sm flex"
            style={{'--resume-accent': accentColor} as React.CSSProperties}
        >
            <aside className="w-1/3 bg-[var(--resume-accent)] text-white p-6 flex flex-col gap-6">
                <Section title="Contact" show={true} template="modern" className="!text-white">
                    <div className="space-y-2 text-xs">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3"/>{personalInfo.email}</div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3"/>{personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin className="h-3 w-3"/>{personalInfo.location}</div>}
                        {links.linkedin && <div className="flex items-center gap-2"><LinkIcon className="h-3 w-3"/>{links.linkedin.replace(/https?:\/\//, '')}</div>}
                        {links.github && <div className="flex items-center gap-2"><Github className="h-3 w-3"/>{links.github.replace(/https?:\/\//, '')}</div>}
                    </div>
                </Section>
                <Section title="Skills" show={(skills?.technical?.length ?? 0) > 0 || (skills?.soft?.length ?? 0) > 0 || (skills?.tools?.length ?? 0) > 0} template="modern" className="!text-white">
                     <div className="flex flex-col gap-3">
                        {(skills?.technical?.length ?? 0) > 0 && <div><h4 className="font-bold text-xs uppercase mb-1">Technical</h4><div className="flex flex-wrap gap-1">{skills.technical.map(s => <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded">{s}</span>)}</div></div>}
                        {(skills?.soft?.length ?? 0) > 0 && <div><h4 className="font-bold text-xs uppercase mb-1">Soft</h4><div className="flex flex-wrap gap-1">{skills.soft.map(s => <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded">{s}</span>)}</div></div>}
                        {(skills?.tools?.length ?? 0) > 0 && <div><h4 className="font-bold text-xs uppercase mb-1">Tools</h4><div className="flex flex-wrap gap-1">{skills.tools.map(s => <span key={s} className="text-xs bg-white/20 px-2 py-0.5 rounded">{s}</span>)}</div></div>}
                    </div>
                </Section>
            </aside>
            <main className="w-2/3 p-8">
                {personalInfo.name && <h1 className="text-4xl font-bold font-headline mb-4">{personalInfo.name}</h1>}
                <Section title="Summary" show={!!summary} template="modern"><p className="text-sm text-neutral-700 leading-relaxed">{summary}</p></Section>
                <Section title="Experience" show={experience.length > 0} template="modern">
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4 break-inside-avoid">
                            <div className="flex justify-between items-baseline"><h3 className="font-bold text-base">{exp.role}</h3><p className="text-xs text-neutral-500">{exp.startDate} - {exp.endDate}</p></div>
                            <p className="text-sm italic text-neutral-600 mb-1">{exp.company}</p>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700 whitespace-pre-wrap">{exp.description.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line.replace(/^[•*-]\s*/, '')}</li>)}</ul>
                        </div>
                    ))}
                </Section>
                 <Section title="Projects" show={projects.length > 0} template="modern">
                    {projects.map(proj => (
                         <div key={proj.id} className="mb-4 break-inside-avoid">
                             <div className="flex justify-between items-baseline"><h3 className="font-bold text-base">{proj.name}</h3></div>
                             <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700 whitespace-pre-wrap">{proj.description.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line.replace(/^[•*-]\s*/, '')}</li>)}</ul>
                             {(proj.techStack?.length ?? 0) > 0 && <div className="flex flex-wrap gap-1 mt-2">{proj.techStack.map(tech => <span key={tech} className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">{tech}</span>)}</div>}
                        </div>
                    ))}
                </Section>
                <Section title="Education" show={education.length > 0} template="modern">
                     {education.map(edu => (
                        <div key={edu.id} className="flex justify-between items-baseline text-sm">
                            <div><h3 className="font-bold">{edu.degree}</h3><p className="italic text-neutral-600">{edu.school}</p></div>
                            <p className="text-xs text-neutral-500">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </Section>
            </main>
        </div>
    );
};

const DefaultLayout = ({ resume, template, accentColor }: { resume: ResumeData, template: Template, accentColor: string }) => {
     const { personalInfo, summary, education, experience, projects, skills, links } = resume;
     const contactInfo = [ personalInfo.email, personalInfo.phone, personalInfo.location, links.linkedin?.replace(/https?:\/\//, ''), links.github?.replace(/https?:\/\//, '')].filter(Boolean);
    
     const fontClass = template === 'classic' ? 'font-serif' : 'font-sans';
     const headingFontClass = template === 'classic' ? 'font-serif' : 'font-headline';

    return (
        <div 
            className={cn("w-full h-full p-8 bg-white text-black text-sm", fontClass)}
            style={{'--resume-accent': accentColor} as React.CSSProperties}
        >
            <header className={cn("text-center mb-6", {'border-b-2 pb-4 border-neutral-300': template === 'classic' })}>
                {personalInfo.name && <h1 className={cn("text-4xl font-bold", headingFontClass)}>{personalInfo.name}</h1>}
                <div className={cn("text-xs text-neutral-600 mt-2", {'tracking-widest': template === 'classic'})}>
                    {contactInfo.join(' • ')}
                </div>
            </header>

            <Section title="Summary" show={!!summary} template={template}><p className="text-sm text-neutral-700 leading-relaxed">{summary}</p></Section>
            
            <Section title="Experience" show={experience.length > 0} template={template}>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between items-baseline"><h3 className={cn("font-bold text-base", headingFontClass)}>{exp.role}</h3><p className="text-xs text-neutral-500">{exp.startDate} - {exp.endDate}</p></div>
                        <p className="text-sm italic text-neutral-600 mb-1">{exp.company}</p>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700 whitespace-pre-wrap">{exp.description.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line.replace(/^[•*-]\s*/, '')}</li>)}</ul>
                    </div>
                ))}
            </Section>

            <Section title="Projects" show={projects.length > 0} template={template}>
                {projects.map(proj => (
                     <div key={proj.id} className="mb-4 break-inside-avoid">
                         <h3 className={cn("font-bold text-base", headingFontClass)}>{proj.name}</h3>
                         <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-700 whitespace-pre-wrap">{proj.description.split('\n').filter(Boolean).map((line, i) => <li key={i}>{line.replace(/^[•*-]\s*/, '')}</li>)}</ul>
                         {(proj.techStack?.length ?? 0) > 0 && <div className="flex flex-wrap gap-1 mt-2">{proj.techStack.map(tech => <span key={tech} className={cn("text-[10px] px-2 py-0.5 rounded", {'border border-neutral-300': template === 'classic', 'bg-neutral-100': template === 'minimal'})}>{tech}</span>)}</div>}
                    </div>
                ))}
            </Section>

             <Section title="Education" show={education.length > 0} template={template}>
                 {education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-baseline text-sm mb-2">
                        <div><h3 className={cn("font-bold", headingFontClass)}>{edu.degree}</h3><p className="italic text-neutral-600">{edu.school}</p></div>
                        <p className="text-xs text-neutral-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills" show={(skills?.technical?.length ?? 0) > 0 || (skills?.soft?.length ?? 0) > 0 || (skills?.tools?.length ?? 0) > 0} template={template}>
                <div className="flex flex-wrap gap-2">
                    {[...(skills?.technical ?? []), ...(skills?.soft ?? []), ...(skills?.tools ?? [])].map(skill => (
                        <span key={skill} className={cn("text-xs px-2 py-1 rounded", {'border border-neutral-300': template === 'classic', 'bg-neutral-100': template === 'minimal'})}>{skill}</span>
                    ))}
                </div>
            </Section>
        </div>
    );
};


export default function ResumePreview({ resume, template, accentColor }: ResumePreviewProps) {
    if (template === 'modern') {
        return <ModernLayout resume={resume} accentColor={accentColor} />;
    }
    return <DefaultLayout resume={resume} template={template} accentColor={accentColor} />;
}
