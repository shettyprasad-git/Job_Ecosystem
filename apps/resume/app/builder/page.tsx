'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit, AlertTriangle, Sparkles, Loader, X, Check } from "lucide-react";
import useLocalStorage from '@/hooks/use-local-storage';
import { initialResumeData, sampleResumeData } from '@/lib/resume';
import type { ResumeData, EducationEntry, ExperienceEntry, ProjectEntry, Template } from '@/lib/types';
import { ACCENT_COLORS } from '@/lib/types';
import ResumePreview from '@/components/builder/ResumePreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type SectionKey = "education" | "experience" | "projects";

export default function BuilderPage() {
    const [resume, setResume] = useLocalStorage<ResumeData>('resumeBuilderData', initialResumeData);
    const [template, setTemplate] = useLocalStorage<Template>('resumeBuilderTemplate', 'modern');
    const [accentColor, setAccentColor] = useLocalStorage<string>('resumeBuilderAccent', ACCENT_COLORS.teal);
    const [isMounted, setIsMounted] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
    const [editingEntry, setEditingEntry] = useState<EducationEntry | ExperienceEntry | ProjectEntry | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleInputChange = (section: keyof ResumeData, field: string, value: string) => {
        setResume(prev => ({
            ...prev,
            [section]: {
                ...(prev[section as keyof ResumeData] as object),
                [field]: value
            }
        }));
    };
    
    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResume(prev => ({ ...prev, summary: e.target.value }));
    };

    const handleSkillsChange = (category: keyof ResumeData['skills'], newSkills: string[]) => {
        setResume(prev => ({
            ...prev,
            skills: {
                technical: prev.skills?.technical ?? [],
                soft: prev.skills?.soft ?? [],
                tools: prev.skills?.tools ?? [],
                [category]: newSkills
            }
        }));
    };

    const handleSuggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResume(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...(prev.skills?.technical ?? []), "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...(prev.skills?.soft ?? []), "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...(prev.skills?.tools ?? []), "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    }

    const handleLinksChange = (field: 'github' | 'linkedin', value: string) => {
        setResume(prev => ({
            ...prev,
            links: {
                ...prev.links,
                [field]: value
            }
        }));
    };

    const openEditDialog = (section: SectionKey, entry: EducationEntry | ExperienceEntry | ProjectEntry | null) => {
        setEditingSection(section);
        setEditingEntry(entry);
    };

    const closeEditDialog = () => {
        setEditingSection(null);
        setEditingEntry(null);
    };
    
    const handleSaveEntry = (section: SectionKey, entry: EducationEntry | ExperienceEntry | ProjectEntry) => {
        setResume(prev => {
            const list = [...prev[section]];
            const index = list.findIndex(item => item.id === entry.id);

            if (index > -1) {
                list[index] = entry as any;
            } else {
                list.push({ ...entry, id: crypto.randomUUID() } as any);
            }
            return { ...prev, [section]: list };
        });
        closeEditDialog();
    };
    
    const handleDeleteEntry = (section: SectionKey, id: string) => {
        setResume(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };


    if (!isMounted) {
        return <div className="p-8">Loading builder...</div>;
    }

    return (
        <div className="grid md:grid-cols-[1fr,450px] gap-8 p-4 md:p-8" style={{height: 'calc(100vh - 4rem)'}}>
            {/* Form Column */}
            <div className="space-y-6 overflow-y-auto pb-8 pr-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold font-headline">Resume Builder</h1>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setResume(sampleResumeData)}>Load Sample Data</Button>
                        <Button variant="outline" onClick={() => setResume(initialResumeData)}>Clear Data</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" value={resume.personalInfo.name} onChange={e => handleInputChange('personalInfo', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" value={resume.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" placeholder="(123) 456-7890" value={resume.personalInfo.phone} onChange={e => handleInputChange('personalInfo', 'phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="San Francisco, CA" value={resume.personalInfo.location} onChange={e => handleInputChange('personalInfo', 'location', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea id="summary" placeholder="A brief summary of your career and skills..." rows={5} value={resume.summary} onChange={handleSummaryChange} />
                    </CardContent>
                </Card>
                
                <RepeatableSection
                    title="Education"
                    items={resume.education}
                    onAdd={() => openEditDialog('education', null)}
                    onEdit={(item) => openEditDialog('education', item)}
                    onDelete={(id) => handleDeleteEntry('education', id)}
                    renderItem={(item) => (
                        <div>
                            <p className="font-semibold">{item.school}</p>
                            <p className="text-sm text-muted-foreground">{item.degree}</p>
                        </div>
                    )}
                />

                <RepeatableSection
                    title="Experience"
                    items={resume.experience}
                    onAdd={() => openEditDialog('experience', null)}
                    onEdit={(item) => openEditDialog('experience', item)}
                    onDelete={(id) => handleDeleteEntry('experience', id)}
                    renderItem={(item) => (
                        <div>
                            <p className="font-semibold">{item.company}</p>
                            <p className="text-sm text-muted-foreground">{item.role}</p>
                        </div>
                    )}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Projects
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog('projects', null)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resume.projects.length > 0 ? (
                            <Accordion type="multiple" className="space-y-2">
                                {resume.projects.map((item) => (
                                    <AccordionItem value={item.id} key={item.id} className="border rounded-lg px-4">
                                        <AccordionTrigger className="py-3 hover:no-underline">
                                            <div className="flex justify-between w-full items-center">
                                                <p className="font-semibold">{item.name}</p>
                                                <div className="space-x-2 mr-2">
                                                    <div
                                                        role="button"
                                                        aria-label="Edit project"
                                                        onClick={(e) => { e.stopPropagation(); openEditDialog('projects', item); }}
                                                        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                                                    >
                                                        <Edit className="h-4 w-4"/>
                                                    </div>
                                                    <div
                                                        role="button"
                                                        aria-label="Delete project"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteEntry('projects', item.id); }}
                                                        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 space-y-2">
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(item.techStack ?? []).map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-4 space-y-2 min-h-[6rem] flex items-center justify-center bg-muted/50">
                                <p className="text-sm text-muted-foreground">Your projects will show up here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Skills</CardTitle>
                            <Button variant="outline" onClick={handleSuggestSkills} disabled={isSuggesting}>
                                {isSuggesting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Suggest Skills
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Technical Skills ({(resume.skills?.technical?.length ?? 0)})</Label>
                            <TagInput
                                value={resume.skills?.technical ?? []}
                                onChange={skills => handleSkillsChange('technical', skills)}
                                placeholder="e.g. React"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Soft Skills ({(resume.skills?.soft?.length ?? 0)})</Label>
                            <TagInput
                                value={resume.skills?.soft ?? []}
                                onChange={skills => handleSkillsChange('soft', skills)}
                                placeholder="e.g. Communication"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tools & Technologies ({(resume.skills?.tools?.length ?? 0)})</Label>
                            <TagInput
                                value={resume.skills?.tools ?? []}
                                onChange={skills => handleSkillsChange('tools', skills)}
                                placeholder="e.g. Git"
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                     <CardHeader><CardTitle>Links</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="github">GitHub</Label>
                            <Input id="github" placeholder="https://github.com/johndoe" value={resume.links.github} onChange={e => handleLinksChange('github', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input id="linkedin" placeholder="https://linkedin.com/in/johndoe" value={resume.links.linkedin} onChange={e => handleLinksChange('linkedin', e.target.value)} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Column */}
            <div className="space-y-6 overflow-y-auto hidden md:flex md:flex-col pb-8">
                <div className="flex flex-col flex-1">
                    <TemplatePicker selected={template} onSelect={setTemplate} />
                    <ColorPicker selected={accentColor} onSelect={setAccentColor} />
                    <div className="bg-card rounded-lg border p-4 overflow-y-auto flex-1 mt-4">
                        <ResumePreview resume={resume} template={template} accentColor={accentColor} />
                    </div>
                </div>
            </div>

            <Dialog open={!!editingSection} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingEntry ? 'Edit' : 'Add'} {editingSection?.charAt(0).toUpperCase() + editingSection?.slice(1)}
                        </DialogTitle>
                    </DialogHeader>
                    {editingSection === 'education' && <EducationForm onSave={(entry) => handleSaveEntry('education', entry)} onCancel={closeEditDialog} entry={editingEntry as EducationEntry | null} />}
                    {editingSection === 'experience' && <ExperienceForm onSave={(entry) => handleSaveEntry('experience', entry)} onCancel={closeEditDialog} entry={editingEntry as ExperienceEntry | null} />}
                    {editingSection === 'projects' && <ProjectForm onSave={(entry) => handleSaveEntry('projects', entry)} onCancel={closeEditDialog} entry={editingEntry as ProjectEntry | null} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function RepeatableSection({ title, items, onAdd, onEdit, onDelete, renderItem }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {title}
                    <Button variant="ghost" size="sm" onClick={onAdd}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                                {renderItem(item)}
                                <div className="space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}><Edit className="h-4 w-4"/></Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-4 space-y-2 min-h-[6rem] flex items-center justify-center bg-muted/50">
                        <p className="text-sm text-muted-foreground">Your entries will show up here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function EducationForm({ onSave, onCancel, entry }: { onSave: (entry: EducationEntry) => void; onCancel: () => void; entry: EducationEntry | null }) {
    const [data, setData] = useState(entry || { id: '', school: '', degree: '', startDate: '', endDate: '' });
    const handleChange = (field: keyof EducationEntry, value: string) => setData(prev => ({...prev, [field]: value}));
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>School</Label><Input value={data.school} onChange={e => handleChange('school', e.target.value)} /></div>
            <div className="space-y-2"><Label>Degree</Label><Input value={data.degree} onChange={e => handleChange('degree', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input placeholder="e.g. 2020" value={data.startDate} onChange={e => handleChange('startDate', e.target.value)} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input placeholder="e.g. 2024" value={data.endDate} onChange={e => handleChange('endDate', e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={() => onSave(data)}>Save</Button></div>
        </div>
    );
}

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];
const getBulletSuggestions = (bullet: string): string[] => {
    const suggestions: string[] = [];
    if (!bullet.trim()) return [];

    const firstWord = bullet.trim().replace(/^[•*-]\s*/, '').split(' ')[0];
    const startsWithActionVerb = ACTION_VERBS.some(verb => firstWord.toLowerCase().startsWith(verb.toLowerCase()));
    
    if (!startsWithActionVerb) {
        suggestions.push("Start with a strong action verb like 'Developed', 'Led', or 'Managed'.");
    }

    const hasNumber = /\d/.test(bullet);
    if (!hasNumber) {
        suggestions.push("Add measurable impact (e.g., increased by 20%, saved $10k).");
    }

    return suggestions;
};


function BulletGuidance({ description }: { description: string }) {
    const bullets = useMemo(() => description.split('\n').filter(line => line.trim()), [description]);

    if (bullets.length === 0) return null;

    const suggestionsByBullet = bullets.map(bullet => ({
        bullet,
        suggestions: getBulletSuggestions(bullet)
    })).filter(item => item.suggestions.length > 0);

    if (suggestionsByBullet.length === 0) return null;

    return (
        <div className="mt-4 p-3 rounded-lg bg-accent/50 border border-accent">
            <h4 className="font-semibold text-sm mb-2">Bullet Improvements</h4>
            <div className="space-y-3">
                {suggestionsByBullet.map(({ bullet, suggestions }, index) => (
                    <div key={index} className="text-xs">
                        <p className="font-mono truncate text-muted-foreground">"{bullet}"</p>
                        <ul className="list-disc pl-4 mt-1 text-accent-foreground/90">
                            {suggestions.map((suggestion, sIndex) => (
                                <li key={sIndex} className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}


function ExperienceForm({ onSave, onCancel, entry }: { onSave: (entry: ExperienceEntry) => void; onCancel: () => void; entry: ExperienceEntry | null }) {
    const [data, setData] = useState(entry || { id: '', company: '', role: '', startDate: '', endDate: '', description: '' });
    const handleChange = (field: keyof ExperienceEntry, value: string) => setData(prev => ({...prev, [field]: value}));
    
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Company</Label><Input value={data.company} onChange={e => handleChange('company', e.target.value)} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={data.role} onChange={e => handleChange('role', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input placeholder="e.g. 2021" value={data.startDate} onChange={e => handleChange('startDate', e.target.value)} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input placeholder="e.g. Present" value={data.endDate} onChange={e => handleChange('endDate', e.target.value)} /></div>
            </div>
            <div className="space-y-2">
                <Label>Description / Bullets</Label>
                <Textarea 
                    value={data.description} 
                    onChange={e => handleChange('description', e.target.value)} 
                    rows={5} 
                    placeholder={"• Led a team of 5 engineers to refactor a legacy system, improving performance by 30%."}
                />
                <p className="text-xs text-muted-foreground">Start each line with a bullet point (•, -, *).</p>
                <BulletGuidance description={data.description} />
            </div>
            <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={() => onSave(data)}>Save</Button></div>
        </div>
    );
}

function TagInput({ value, onChange, placeholder }: { value: string[], onChange: (value: string[]) => void, placeholder: string }) {
    const [inputValue, setInputValue] = useState('');
    const tags = value ?? [];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1 mb-2">
                {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1.5 py-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="appearance-none rounded-full hover:bg-muted-foreground/20">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
        </div>
    );
}

function ProjectForm({ onSave, onCancel, entry }: { onSave: (entry: ProjectEntry) => void; onCancel: () => void; entry: ProjectEntry | null }) {
    const [data, setData] = useState(entry || { id: '', name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' });
    const handleChange = (field: keyof Omit<ProjectEntry, 'techStack'>, value: string) => setData(prev => ({...prev, [field]: value}));
    const handleTechStackChange = (techStack: string[]) => setData(prev => ({ ...prev, techStack }));

    const descriptionLength = data.description.length;
    const maxChars = 200;

    return (
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2"><Label>Project Name</Label><Input value={data.name} onChange={e => handleChange('name', e.target.value)} /></div>
            <div className="space-y-2">
                <Label>Description / Bullets</Label>
                <Textarea 
                    value={data.description} 
                    onChange={e => {
                        if (e.target.value.length <= maxChars) {
                            handleChange('description', e.target.value)
                        }
                    }}
                    rows={4}
                    placeholder={"• Developed a full-stack application using Next.js and Firebase, serving 1000+ users."}
                />
                 <div className="flex justify-between text-xs text-muted-foreground">
                    <p>Start each line with a bullet point (•, -, *).</p>
                    <p className={descriptionLength > maxChars ? 'text-destructive' : ''}>
                        {descriptionLength}/{maxChars}
                    </p>
                </div>
                <BulletGuidance description={data.description} />
            </div>
             <div className="space-y-2">
                <Label>Tech Stack</Label>
                <TagInput
                    value={data.techStack ?? []}
                    onChange={handleTechStackChange}
                    placeholder="Add tech and press Enter"
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Live URL (Optional)</Label><Input value={data.liveUrl} onChange={e => handleChange('liveUrl', e.target.value)} placeholder="https://..." /></div>
                <div className="space-y-2"><Label>GitHub URL (Optional)</Label><Input value={data.githubUrl} onChange={e => handleChange('githubUrl', e.target.value)} placeholder="https://github.com/..." /></div>
            </div>
            <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={() => onSave(data)}>Save</Button></div>
        </div>
    );
}

const TEMPLATES: {id: Template, name: string}[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
];

function TemplatePicker({ selected, onSelect }: { selected: Template, onSelect: (id: Template) => void }) {
    return (
        <div className="p-1 bg-muted rounded-lg flex flex-col gap-2 no-print">
            <Label className="text-xs px-2 pt-1 text-muted-foreground">Template</Label>
            <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                {TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={cn(
                            "relative block border-2 rounded-lg aspect-[3/4] bg-background hover:border-blue-500",
                             selected === template.id ? 'border-blue-500' : 'border-border'
                        )}
                    >
                        <TemplateThumbnail id={template.id} />
                        {selected === template.id && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                        <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-semibold">{template.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function TemplateThumbnail({ id }: { id: Template }) {
    if (id === 'modern') return (
        <div className="flex h-full p-1.5 gap-1.5">
            <div className="w-1/3 bg-muted rounded-sm"></div>
            <div className="w-2/3 space-y-1">
                <div className="h-2 bg-muted rounded-sm w-3/4"></div>
                <div className="h-1 bg-muted/50 rounded-sm"></div>
                <div className="h-1 bg-muted/50 rounded-sm w-5/6"></div>
            </div>
        </div>
    );
    if (id === 'classic') return (
         <div className="h-full p-1.5 space-y-1">
            <div className="h-2 bg-muted rounded-sm w-3/4 mx-auto"></div>
            <div className="h-1 bg-muted/50 rounded-sm w-1/2 mx-auto"></div>
            <div className="h-px bg-muted my-1.5"></div>
            <div className="h-1.5 bg-muted rounded-sm w-1/4"></div>
            <div className="h-1 bg-muted/50 rounded-sm"></div>
         </div>
    );
    return ( // Minimal
         <div className="h-full p-1.5 space-y-1">
            <div className="h-2 bg-muted rounded-sm w-3/4"></div>
            <div className="h-1 bg-muted/50 rounded-sm w-1/2"></div>
            <div className="h-1.5 bg-muted rounded-sm w-1/4 mt-2"></div>
            <div className="h-1 bg-muted/50 rounded-sm"></div>
         </div>
    );
}

function ColorPicker({ selected, onSelect }: { selected: string, onSelect: (color: string) => void }) {
    return (
        <div className="p-1 bg-muted rounded-lg flex flex-col gap-2 mt-2 no-print">
            <Label className="text-xs px-2 pt-1 text-muted-foreground">Accent Color</Label>
            <div className="flex gap-2 px-2 pb-2">
                {Object.values(ACCENT_COLORS).map(color => (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        className={cn(
                            "h-6 w-6 rounded-full border-2",
                            selected === color ? 'border-blue-500' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
}
