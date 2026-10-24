import React, { useState } from 'react';
import {
  X,
  LayoutTemplate,
  Check,
  Grid,
  FileText,
  Calendar,
  BookOpen,
  GitBranch,
  Film,
  Kanban,
  Sparkles
} from 'lucide-react';
import type { TemplateType } from '../../types/canvas';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (type: TemplateType) => void;
  currentTemplate?: TemplateType;
}

interface TemplateItem {
  id: TemplateType;
  category: 'paper' | 'productivity' | 'creative';
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  previewBg: string;
  isDark?: boolean;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentTemplate = 'warm'
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'paper' | 'productivity' | 'creative'>('all');

  if (!isOpen) return null;

  const templates: TemplateItem[] = [
    // Paper Styles
    {
      id: 'blank',
      category: 'paper',
      title: 'Blank Pure White',
      badge: 'Paper',
      description: 'Clean, distraction-free pure white surface for freehand drawing & art.',
      icon: <FileText size={18} color="#777D5E" />,
      previewBg: '#FFFFFF'
    },
    {
      id: 'warm',
      category: 'paper',
      title: 'Warm Botanical Ivory',
      badge: 'Signature',
      description: 'Our signature warm cozy ivory canvas with subtle organic warmth.',
      icon: <Sparkles size={18} color="#D99379" />,
      previewBg: '#FFFEFA'
    },
    {
      id: 'dots',
      category: 'paper',
      title: 'Dot Grid (Bullet Journal)',
      badge: 'Grid',
      description: 'Precision 24px dot matrix for bullet journaling, sketching, and icons.',
      icon: <Grid size={18} color="#5E6547" />,
      previewBg: '#FAF6EE'
    },
    {
      id: 'grid',
      category: 'paper',
      title: 'Graph Paper (Math / Engineering)',
      badge: 'Grid',
      description: 'Crisp coordinate grid lines for geometric precision, charts, and math.',
      icon: <Grid size={18} color="#5E6547" />,
      previewBg: '#F7F3EB'
    },
    {
      id: 'lined',
      category: 'paper',
      title: 'Lined Notebook Paper',
      badge: 'Writing',
      description: 'Classic 28px ruled notebook lines with margin for neat writing and notes.',
      icon: <FileText size={18} color="#777D5E" />,
      previewBg: '#FAF7F0'
    },
    {
      id: 'dark',
      category: 'paper',
      title: 'Dark Slate / Blackboard',
      badge: 'Dark Mode',
      description: 'Sleek dark chalkboard surface with subtle starlight dot guides.',
      icon: <FileText size={18} color="#A8A49C" />,
      previewBg: '#1F221E',
      isDark: true
    },

    // Productivity & Notes
    {
      id: 'planner',
      category: 'productivity',
      title: 'Weekly Focus Planner',
      badge: 'Organizer',
      description: '7-day Mon–Sun columns with date badges and priority task checklists.',
      icon: <Calendar size={18} color="#777D5E" />,
      previewBg: '#FAF5EE'
    },
    {
      id: 'cornell',
      category: 'productivity',
      title: 'Cornell Notes System',
      badge: 'Study & Work',
      description: 'Structured 3-section layout: Recall cues, Detailed notes, and Summary.',
      icon: <BookOpen size={18} color="#5E6547" />,
      previewBg: '#FAF5EE'
    },
    {
      id: 'kanban',
      category: 'productivity',
      title: 'Kanban Project Board',
      badge: 'Agile',
      description: '3 clear workflow columns: To Do, In Progress, and Done with task cards.',
      icon: <Kanban size={18} color="#777D5E" />,
      previewBg: '#FAF6EE'
    },

    // Brainstorm & Creative
    {
      id: 'mindmap',
      category: 'creative',
      title: 'Mind Map & Brainstorm',
      badge: 'Ideation',
      description: 'Central concept bubble with 4 branching theme nodes and connector paths.',
      icon: <GitBranch size={18} color="#D99379" />,
      previewBg: '#FFFEFA'
    },
    {
      id: 'storyboard',
      category: 'creative',
      title: 'Storyboard & Scene Frames',
      badge: 'Visual Design',
      description: '6 neat visual frames with action sketch boxes and scene caption areas.',
      icon: <Film size={18} color="#5E6547" />,
      previewBg: '#FFFEFA'
    }
  ];

  const filteredTemplates = activeTab === 'all'
    ? templates
    : templates.filter((t) => t.category === activeTab);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          width: 780,
          maxWidth: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFEFA',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 48px -10px rgba(60, 50, 35, 0.22)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid #E8DFD3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#EAEEDD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5E6547'
              }}
            >
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#30312D', margin: 0 }}>
                Canvas Templates & Paper Styles
              </h2>
              <p style={{ fontSize: 12, color: '#79766F', margin: '2px 0 0' }}>
                Select a paper background or ready-to-use vector layout for your workspace.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#79766F',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #EFE8DE',
            display: 'flex',
            gap: 8,
            backgroundColor: '#FDFAF5'
          }}
        >
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'paper', label: 'Paper & Grids' },
            { id: 'productivity', label: 'Planners & Notes' },
            { id: 'creative', label: 'Brainstorm & Creative' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? '#777D5E' : '#F5EFE5',
                  color: isActive ? '#FFFFFF' : '#4E504A',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid Content */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
            maxHeight: 520
          }}
        >
          {filteredTemplates.map((template) => {
            const isSelected = currentTemplate === template.id;
            return (
              <div
                key={template.id}
                onClick={() => {
                  onApplyTemplate(template.id);
                  onClose();
                }}
                style={{
                  borderRadius: 14,
                  border: isSelected ? '2px solid #777D5E' : '1px solid #E8DFD3',
                  backgroundColor: '#FFFFFF',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected
                    ? '0 6px 20px -4px rgba(119, 125, 94, 0.25)'
                    : '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(70, 60, 45, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isSelected
                    ? '0 6px 20px -4px rgba(119, 125, 94, 0.25)'
                    : '0 2px 8px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Visual Thumbnail */}
                <div
                  style={{
                    height: 96,
                    borderRadius: 10,
                    backgroundColor: template.previewBg,
                    border: '1px solid #EAE2D5',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Pattern preview simulation */}
                  {template.id === 'dots' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(119, 125, 94, 0.45) 1.5px, transparent 1.5px)',
                        backgroundSize: '16px 16px'
                      }}
                    />
                  )}
                  {template.id === 'grid' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
                          linear-gradient(to right, rgba(119, 125, 94, 0.22) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(119, 125, 94, 0.22) 1px, transparent 1px)
                        `,
                        backgroundSize: '16px 16px'
                      }}
                    />
                  )}
                  {template.id === 'lined' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(to bottom, transparent 17px, rgba(119, 125, 94, 0.3) 18px)',
                        backgroundSize: '100% 18px'
                      }}
                    />
                  )}
                  {template.id === 'dark' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 1.5px, transparent 1.5px)',
                        backgroundSize: '16px 16px'
                      }}
                    />
                  )}

                  {/* Icon Representation */}
                  <div
                    style={{
                      zIndex: 2,
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: template.isDark ? '#2D302C' : 'rgba(255, 255, 255, 0.88)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    {template.icon}
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        backgroundColor: '#777D5E',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#30312D' }}>
                      {template.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 6,
                        backgroundColor: '#F5EFE5',
                        color: '#5E6547',
                        textTransform: 'uppercase'
                      }}
                    >
                      {template.badge}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#6E6B64',
                      lineHeight: 1.4,
                      margin: 0,
                      minHeight: 32
                    }}
                  >
                    {template.description}
                  </p>
                </div>

                {/* Apply Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyTemplate(template.id);
                    onClose();
                  }}
                  style={{
                    marginTop: 'auto',
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: isSelected ? '#EAEEDD' : '#F5EFE5',
                    color: isSelected ? '#5E6547' : '#30312D',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check size={14} color="#5E6547" />
                      <span>Active Canvas</span>
                    </>
                  ) : (
                    <span>Use Template</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
