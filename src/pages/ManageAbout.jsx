import { useSiteContent } from '../hooks/useSiteContent.js';
import { TextField, TextArea, ToggleField } from '../components/form/FormFields.jsx';

// Empty item templates
const emptyPrinciple = { title: '', description: '' };
const emptyEducation = { degree: '', institution: '' };
const emptyExperience = { role: '', company: '', bullets: [] };
const emptySkillCategory = { name: '', items: [] };
const emptySkill = { name: '', percentage: 50 };

function listFromText(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function SectionPanel({ title, section, onToggle, children }) {
  if (!section) return null;
  return (
    <section className="glass-card section-group">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">About Section</p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        </div>
        <ToggleField label="Show section" checked={section.enabled} onChange={onToggle} />
      </div>
      {children}
    </section>
  );
}

function ManageAbout() {
  const { content, loading, saving, save, updateContent } = useSiteContent();

  if (loading) {
    return <div className="panel text-white">Loading About page content...</div>;
  }

  const aboutPage = content.aboutPage || {};

  // Helper to deep update the aboutPage object
  const updateAboutSection = (sectionKey, updates) => {
    updateContent({
      aboutPage: {
        ...aboutPage,
        [sectionKey]: {
          ...aboutPage[sectionKey],
          ...updates,
        },
      },
    });
  };

  const updateAboutArray = (sectionKey, arrayKey, newArray) => {
    updateAboutSection(sectionKey, { [arrayKey]: newArray });
  };

  return (
    <form className="section-group" onSubmit={save}>
      <div className="panel product-panel">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">Editable website content</p>
          <h2 className="mt-3 text-3xl font-black text-white">Manage About Page</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Update your public About page content, including vision, mission, skills, and experience.
          </p>
        </div>
        <div className="button-group">
          <button type="submit" className="btn-action" disabled={saving}>
            {saving ? 'Saving...' : 'Save About Page'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <SectionPanel title="Hero Section" section={aboutPage.hero} onToggle={(enabled) => updateAboutSection('hero', { enabled })}>
        <TextField label="Title" value={aboutPage.hero?.title || ''} onChange={(value) => updateAboutSection('hero', { title: value })} />
        <TextArea label="Description (Markdown supported)" value={aboutPage.hero?.description || ''} onChange={(value) => updateAboutSection('hero', { description: value })} />
      </SectionPanel>

      {/* Vision */}
      <SectionPanel title="Vision" section={aboutPage.vision} onToggle={(enabled) => updateAboutSection('vision', { enabled })}>
        <TextField label="Section Title" value={aboutPage.vision?.title || ''} onChange={(value) => updateAboutSection('vision', { title: value })} />
        <TextField label="Heading" value={aboutPage.vision?.heading || ''} onChange={(value) => updateAboutSection('vision', { heading: value })} />
        <TextArea label="Description" value={aboutPage.vision?.description || ''} onChange={(value) => updateAboutSection('vision', { description: value })} />
        
        <div className="mt-6">
          <h4 className="text-lg font-bold text-white mb-4">Core Principles</h4>
          {(aboutPage.vision?.principles || []).map((principle, index) => (
            <div key={index} className="glass-card mb-4 border border-[var(--line)] p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-[var(--text)]">Principle {index + 1}</h5>
                <button type="button" className="btn-secondary text-xs" onClick={() => {
                  const arr = [...aboutPage.vision.principles];
                  arr.splice(index, 1);
                  updateAboutArray('vision', 'principles', arr);
                }}>Remove</button>
              </div>
              <div className="field-grid md:grid-cols-2">
                <TextField label="Title" value={principle.title} onChange={(val) => {
                  const arr = [...aboutPage.vision.principles];
                  arr[index] = { ...arr[index], title: val };
                  updateAboutArray('vision', 'principles', arr);
                }} />
                <TextArea label="Description" value={principle.description} onChange={(val) => {
                  const arr = [...aboutPage.vision.principles];
                  arr[index] = { ...arr[index], description: val };
                  updateAboutArray('vision', 'principles', arr);
                }} />
              </div>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => {
            const arr = [...(aboutPage.vision?.principles || []), { ...emptyPrinciple }];
            updateAboutArray('vision', 'principles', arr);
          }}>Add Principle</button>
        </div>

        <div className="mt-6">
          <TextArea label="Footer text" value={aboutPage.vision?.footer || ''} onChange={(value) => updateAboutSection('vision', { footer: value })} />
        </div>
      </SectionPanel>

      {/* Mission */}
      <SectionPanel title="Mission" section={aboutPage.mission} onToggle={(enabled) => updateAboutSection('mission', { enabled })}>
        <TextField label="Section Title" value={aboutPage.mission?.title || ''} onChange={(value) => updateAboutSection('mission', { title: value })} />
        <TextArea label="Description" value={aboutPage.mission?.description || ''} onChange={(value) => updateAboutSection('mission', { description: value })} />
      </SectionPanel>

      {/* Education */}
      <SectionPanel title="Education" section={aboutPage.education} onToggle={(enabled) => updateAboutSection('education', { enabled })}>
        <TextField label="Section Title" value={aboutPage.education?.title || ''} onChange={(value) => updateAboutSection('education', { title: value })} />
        
        <div className="mt-4">
          {(aboutPage.education?.items || []).map((item, index) => (
            <div key={index} className="glass-card mb-4 border border-[var(--line)] p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-[var(--text)]">Item {index + 1}</h5>
                <button type="button" className="btn-secondary text-xs" onClick={() => {
                  const arr = [...aboutPage.education.items];
                  arr.splice(index, 1);
                  updateAboutArray('education', 'items', arr);
                }}>Remove</button>
              </div>
              <div className="field-grid md:grid-cols-2">
                <TextField label="Degree / Course" value={item.degree} onChange={(val) => {
                  const arr = [...aboutPage.education.items];
                  arr[index] = { ...arr[index], degree: val };
                  updateAboutArray('education', 'items', arr);
                }} />
                <TextField label="Institution" value={item.institution} onChange={(val) => {
                  const arr = [...aboutPage.education.items];
                  arr[index] = { ...arr[index], institution: val };
                  updateAboutArray('education', 'items', arr);
                }} />
              </div>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => {
            const arr = [...(aboutPage.education?.items || []), { ...emptyEducation }];
            updateAboutArray('education', 'items', arr);
          }}>Add Education</button>
        </div>
      </SectionPanel>

      {/* Experience */}
      <SectionPanel title="Professional Experience" section={aboutPage.experience} onToggle={(enabled) => updateAboutSection('experience', { enabled })}>
        <TextField label="Section Title" value={aboutPage.experience?.title || ''} onChange={(value) => updateAboutSection('experience', { title: value })} />
        
        <div className="mt-4">
          {(aboutPage.experience?.items || []).map((item, index) => (
            <div key={index} className="glass-card mb-4 border border-[var(--line)] p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-bold text-[var(--text)]">Role {index + 1}</h5>
                <button type="button" className="btn-secondary text-xs" onClick={() => {
                  const arr = [...aboutPage.experience.items];
                  arr.splice(index, 1);
                  updateAboutArray('experience', 'items', arr);
                }}>Remove</button>
              </div>
              <div className="field-grid md:grid-cols-2">
                <TextField label="Role / Title" value={item.role} onChange={(val) => {
                  const arr = [...aboutPage.experience.items];
                  arr[index] = { ...arr[index], role: val };
                  updateAboutArray('experience', 'items', arr);
                }} />
                <TextField label="Company" value={item.company} onChange={(val) => {
                  const arr = [...aboutPage.experience.items];
                  arr[index] = { ...arr[index], company: val };
                  updateAboutArray('experience', 'items', arr);
                }} />
                <div className="md:col-span-2">
                  <TextArea label="Bullet points (one per line)" value={(item.bullets || []).join('\n')} onChange={(val) => {
                    const arr = [...aboutPage.experience.items];
                    arr[index] = { ...arr[index], bullets: listFromText(val) };
                    updateAboutArray('experience', 'items', arr);
                  }} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => {
            const arr = [...(aboutPage.experience?.items || []), { ...emptyExperience }];
            updateAboutArray('experience', 'items', arr);
          }}>Add Experience</button>
        </div>
      </SectionPanel>

      {/* Technical Skills */}
      <SectionPanel title="Technical Skills" section={aboutPage.skills} onToggle={(enabled) => updateAboutSection('skills', { enabled })}>
        <TextField label="Section Title" value={aboutPage.skills?.title || ''} onChange={(value) => updateAboutSection('skills', { title: value })} />
        
        <div className="mt-4">
          {(aboutPage.skills?.categories || []).map((cat, catIndex) => (
            <div key={catIndex} className="glass-card mb-6 border border-[var(--accent)]/30 p-5">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--line)]">
                <TextField 
                  label={`Category ${catIndex + 1} Name`} 
                  value={cat.name} 
                  onChange={(val) => {
                    const arr = [...aboutPage.skills.categories];
                    arr[catIndex] = { ...arr[catIndex], name: val };
                    updateAboutArray('skills', 'categories', arr);
                  }} 
                />
                <button type="button" className="btn-secondary text-xs text-red-400 hover:text-red-300 ml-4" onClick={() => {
                  const arr = [...aboutPage.skills.categories];
                  arr.splice(catIndex, 1);
                  updateAboutArray('skills', 'categories', arr);
                }}>Remove Category</button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(cat.items || []).map((skill, skillIndex) => (
                  <div key={skillIndex} className="bg-[var(--surface-2)] p-3 rounded-lg flex items-center gap-2">
                    <input 
                      type="text"
                      className="bg-transparent text-[var(--text)] border border-[var(--line)] rounded px-2 py-1 w-full text-sm outline-none focus:border-[var(--accent)]"
                      placeholder="Skill name"
                      value={skill.name}
                      onChange={(e) => {
                        const arr = [...aboutPage.skills.categories];
                        arr[catIndex].items[skillIndex] = { ...skill, name: e.target.value };
                        updateAboutArray('skills', 'categories', arr);
                      }}
                    />
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      className="bg-transparent text-[var(--text)] border border-[var(--line)] rounded px-2 py-1 w-20 text-sm outline-none focus:border-[var(--accent)]"
                      placeholder="%"
                      value={skill.percentage}
                      onChange={(e) => {
                        const arr = [...aboutPage.skills.categories];
                        arr[catIndex].items[skillIndex] = { ...skill, percentage: parseInt(e.target.value) || 0 };
                        updateAboutArray('skills', 'categories', arr);
                      }}
                    />
                    <button type="button" className="text-[var(--muted)] hover:text-red-400 font-bold px-1" onClick={() => {
                      const arr = [...aboutPage.skills.categories];
                      arr[catIndex].items.splice(skillIndex, 1);
                      updateAboutArray('skills', 'categories', arr);
                    }}>×</button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary text-xs mt-3" onClick={() => {
                const arr = [...aboutPage.skills.categories];
                arr[catIndex].items.push({ ...emptySkill });
                updateAboutArray('skills', 'categories', arr);
              }}>+ Add Skill to {cat.name || 'Category'}</button>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => {
            const arr = [...(aboutPage.skills?.categories || []), { ...emptySkillCategory }];
            updateAboutArray('skills', 'categories', arr);
          }}>Add Skill Category</button>
        </div>
      </SectionPanel>

      {/* Services List */}
      <SectionPanel title="Services Offered" section={aboutPage.services} onToggle={(enabled) => updateAboutSection('services', { enabled })}>
        <TextField label="Section Title" value={aboutPage.services?.title || ''} onChange={(value) => updateAboutSection('services', { title: value })} />
        <TextArea label="Services (one per line)" value={(aboutPage.services?.items || []).join('\n')} onChange={(value) => updateAboutSection('services', { items: listFromText(value) })} />
      </SectionPanel>

      {/* Why Work With Me */}
      <SectionPanel title="Why Work With Me" section={aboutPage.whyWorkWithMe} onToggle={(enabled) => updateAboutSection('whyWorkWithMe', { enabled })}>
        <TextField label="Section Title" value={aboutPage.whyWorkWithMe?.title || ''} onChange={(value) => updateAboutSection('whyWorkWithMe', { title: value })} />
        <TextArea label="Reasons (one per line)" value={(aboutPage.whyWorkWithMe?.items || []).join('\n')} onChange={(value) => updateAboutSection('whyWorkWithMe', { items: listFromText(value) })} />
      </SectionPanel>

      {/* Tech Stack */}
      <SectionPanel title="Technology Stack" section={aboutPage.techStack} onToggle={(enabled) => updateAboutSection('techStack', { enabled })}>
        <TextField label="Section Title" value={aboutPage.techStack?.title || ''} onChange={(value) => updateAboutSection('techStack', { title: value })} />
        <TextArea label="Tech Stack (comma or bullet separated)" value={aboutPage.techStack?.content || ''} onChange={(value) => updateAboutSection('techStack', { content: value })} />
      </SectionPanel>

      {/* Footer CTA */}
      <SectionPanel title="Footer CTA" section={aboutPage.footerCTA} onToggle={(enabled) => updateAboutSection('footerCTA', { enabled })}>
        <TextField label="Title" value={aboutPage.footerCTA?.title || ''} onChange={(value) => updateAboutSection('footerCTA', { title: value })} />
        <TextArea label="Description (Markdown supported)" value={aboutPage.footerCTA?.description || ''} onChange={(value) => updateAboutSection('footerCTA', { description: value })} />
      </SectionPanel>

      <div className="button-group">
        <button type="submit" className="btn-action" disabled={saving}>
          {saving ? 'Saving...' : 'Save About Page'}
        </button>
      </div>
    </form>
  );
}

export default ManageAbout;
