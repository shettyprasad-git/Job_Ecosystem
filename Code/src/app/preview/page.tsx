'use client';

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialResumeData, generatePlainTextResume, calculateAtsResult } from '@/lib/resume';
import type { ResumeData, Template } from '@/lib/types';
import { ACCENT_COLORS } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ResumePreview from '@/components/builder/ResumePreview';
import { Button } from '@/components/ui/button';
import { Printer, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import AtsScore from '@/components/builder/AtsScore';

const TEMPLATES: {id: Template, name: string}[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
];

export default function PreviewPage() {
    const [resume] = useLocalStorage<ResumeData>('resumeBuilderData', initialResumeData);
    const [template, setTemplate] = useLocalStorage<Template>('resumeBuilderTemplate', 'modern');
    const [accentColor, setAccentColor] = useLocalStorage<string>('resumeBuilderAccent', ACCENT_COLORS.teal);
    const [isMounted, setIsMounted] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [exportAction, setExportAction] = useState<(() => void) | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const atsResult = useMemo(() => calculateAtsResult(resume), [resume]);

    const performValidation = () => {
        return !(!resume.personalInfo.name || (resume.experience.length === 0 && resume.projects.length === 0));
    };

    const handlePrint = () => {
        window.print();
        toast({
            title: "PDF export ready!",
            description: "Check your downloads.",
        });
    };

    const handleCopy = () => {
        const textToCopy = generatePlainTextResume(resume);
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({
                title: "Copied to clipboard!",
                description: "Resume content copied as plain text.",
            });
        });
    };

    const onPrintClick = () => {
        const action = handlePrint;
        if (performValidation()) {
            action();
        } else {
            setExportAction(() => action);
            setShowWarning(true);
        }
    };

    const onCopyClick = () => {
        const action = handleCopy;
        if (performValidation()) {
            action();
        } else {
            setExportAction(() => action);
            setShowWarning(true);
        }
    };
    
    const proceedWithExport = () => {
        exportAction?.();
        setShowWarning(false);
        setExportAction(null);
    };

    if (!isMounted) {
        return (
            <div className="p-12 bg-muted flex flex-col printable-area" style={{minHeight: 'calc(100vh - 4rem)'}}>
                 <Skeleton className="h-10 w-48 mx-auto no-print" />
                 <div className="mt-8 bg-background p-8 resume-print-container">
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                    <div className="mt-12 space-y-8">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-muted p-4 sm:p-8 md:p-12 flex flex-col items-center printable-area" style={{minHeight: 'calc(100vh - 4rem)'}}>
            <div className="w-full max-w-4xl no-print mb-4 space-y-4">
                <AtsScore score={atsResult.score} suggestions={atsResult.suggestions} />
                <TemplatePicker selected={template} onSelect={setTemplate} />
                <ColorPicker selected={accentColor} onSelect={setAccentColor} />
                 <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={onPrintClick}><Printer className="mr-2" /> Print / Save as PDF</Button>
                    <Button onClick={onCopyClick}><Clipboard className="mr-2" /> Copy Resume as Text</Button>
                </div>
            </div>

            <div className="w-full max-w-4xl shadow-lg resume-print-container">
                 <ResumePreview resume={resume} template={template} accentColor={accentColor} />
            </div>

            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Resume Incomplete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your resume is missing a name or any experience/projects. It may look incomplete.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setShowWarning(false); setExportAction(null); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={proceedWithExport}>Export Anyway</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function TemplatePicker({ selected, onSelect }: { selected: Template, onSelect: (id: Template) => void }) {
    return (
        <div className="p-2 bg-card border rounded-lg flex flex-col gap-2 no-print">
            <Label className="text-sm px-2 pt-1 text-muted-foreground">Template</Label>
            <div className="grid grid-cols-3 gap-3 px-2 pb-2">
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
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                        <span className="absolute bottom-1.5 left-0 right-0 text-center text-xs font-semibold">{template.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function TemplateThumbnail({ id }: { id: Template }) {
    if (id === 'modern') return (
        <div className="flex h-full p-2 gap-2">
            <div className="w-1/3 bg-muted rounded-sm"></div>
            <div className="w-2/3 space-y-2">
                <div className="h-3 bg-muted rounded-sm w-3/4"></div>
                <div className="h-2 bg-muted/50 rounded-sm"></div>
                <div className="h-2 bg-muted/50 rounded-sm w-5/6"></div>
            </div>
        </div>
    );
    if (id === 'classic') return (
         <div className="h-full p-2 space-y-2">
            <div className="h-3 bg-muted rounded-sm w-3/4 mx-auto"></div>
            <div className="h-2 bg-muted/50 rounded-sm w-1/2 mx-auto"></div>
            <div className="h-px bg-muted my-2"></div>
            <div className="h-2.5 bg-muted rounded-sm w-1/4"></div>
            <div className="h-2 bg-muted/50 rounded-sm"></div>
         </div>
    );
    return ( // Minimal
         <div className="h-full p-2 space-y-2">
            <div className="h-3 bg-muted rounded-sm w-3/4"></div>
            <div className="h-2 bg-muted/50 rounded-sm w-1/2"></div>
            <div className="h-2.5 bg-muted rounded-sm w-1/4 mt-3"></div>
            <div className="h-2 bg-muted/50 rounded-sm"></div>
         </div>
    );
}

function ColorPicker({ selected, onSelect }: { selected: string, onSelect: (color: string) => void }) {
    return (
        <div className="p-2 bg-card border rounded-lg flex flex-col gap-2 no-print">
            <Label className="text-sm px-2 pt-1 text-muted-foreground">Template</Label>
            <div className="flex gap-3 px-2 pb-2">
                {Object.values(ACCENT_COLORS).map(color => (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        className={cn(
                            "h-7 w-7 rounded-full border-2",
                            selected === color ? 'border-blue-500' : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    );
}
