import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FolderOpen,
  Plus,
  Trash2,
  Copy,
  Clock,
  Sparkles,
  Edit2
} from 'lucide-react';
import type { CanvasProject } from '../../types/project';
import {
  getAllProjects,
  saveProject,
  deleteProject
} from '../../services/db';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onSelectProject: (project: CanvasProject) => void;
  onNewProject: () => void;
  onToast: (msg: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onToast
}) => {
  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const loadProjects = useCallback(async () => {
    const list = await getAllProjects();
    setProjects(list);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen, loadProjects]);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProject(id);
      onToast(`Deleted project "${name}"`);
      await loadProjects();
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, project: CanvasProject) => {
    e.stopPropagation();
    const duplicated: CanvasProject = {
      ...project,
      id: 'proj_' + Date.now(),
      name: `${project.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await saveProject(duplicated);
    onToast(`Duplicated project "${duplicated.name}"`);
    await loadProjects();
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim()) return;
    const project = projects.find((p) => p.id === id);
    if (project) {
      const updated = { ...project, name: editingName.trim(), updatedAt: Date.now() };
      await saveProject(updated);
      setEditingId(null);
      await loadProjects();
      onToast(`Renamed to "${updated.name}"`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 680, maxWidth: '94vw', height: 540, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #E8DED2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EE'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#D8DAC7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5E6547'
              }}
            >
              <FolderOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#30312D' }}>
                My Creative Projects
              </h2>
              <p style={{ fontSize: 12, color: '#79766F' }}>
                Locally saved drawing workspaces in browser storage
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                onNewProject();
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 10,
                backgroundColor: '#5E6547',
                color: '#FFFEFA',
                fontSize: 12.5,
                fontWeight: 550,
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>New Project</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#79766F',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {projects.length === 0 ? (
            <div
              style={{
                padding: '60px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                color: '#8A857A'
              }}
            >
              <Sparkles size={36} opacity={0.6} />
              <div style={{ fontSize: 15, fontWeight: 550 }}>No saved projects yet</div>
              <div style={{ fontSize: 12.5 }}>
                Click "Save" on the top header to save your work, or create a new project.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 16
              }}
            >
              {projects.map((proj) => {
                const isCurrent = proj.id === currentProjectId;
                const formattedDate = new Date(proj.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    style={{
                      borderRadius: 14,
                      border: `1.5px solid ${isCurrent ? '#777D5E' : '#EBE2D5'}`,
                      backgroundColor: '#FAF6F0',
                      padding: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(70, 60, 45, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Thumbnail preview */}
                    <div
                      style={{
                        width: '100%',
                        height: 110,
                        borderRadius: 8,
                        backgroundColor: proj.backgroundColor || '#FFFEFA',
                        border: '1px solid #ECE3D7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {proj.thumbnail ? (
                        <img
                          src={proj.thumbnail}
                          alt={proj.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: 11, color: '#A09C94' }}>Canvas Workspace</span>
                      )}
                    </div>

                    {/* Project title */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {editingId === proj.id ? (
                        <input
                          type="text"
                          value={editingName}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleRename(proj.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(proj.id);
                          }}
                          style={{
                            width: '100%',
                            fontSize: 12.5,
                            fontWeight: 600,
                            padding: '2px 4px',
                            borderRadius: 4,
                            border: '1px solid #777D5E',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#30312D',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {proj.name}
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(proj.id);
                          setEditingName(proj.name);
                        }}
                        title="Rename"
                        style={{ padding: 2, color: '#8A857A', cursor: 'pointer' }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>

                    {/* Metadata & Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: '#8A857A'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        <span>{formattedDate}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={(e) => handleDuplicate(e, proj)}
                          title="Duplicate"
                          style={{ color: '#6A675F', cursor: 'pointer' }}
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, proj.id, proj.name)}
                          title="Delete"
                          style={{ color: '#C24D3E', cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
