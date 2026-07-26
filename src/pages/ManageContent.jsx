import { defaultSiteContent } from '../data/siteContent.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { TextField, TextArea, SelectField, ToggleField } from '../components/form/FormFields.jsx';

// --- Empty item templates for array additions ---

const emptySlide = {
  eyebrow: '', title: '', phrase: [], body: '',
  cta: '', ctaPath: '', stat: '', statLabel: '',
};

const emptyLinkedItem = { title: '', description: '', linkLabel: '', linkUrl: '' };
const emptyTextItem = { title: '', description: '' };

const emptyTestimonial = {
  name: '', company: '', quote: '', rating: 5,
  showImage: true, imageType: 'photo', imageUrl: '',
};

const emptyFaq = { question: '', answer: '' };

// --- Text parsing helpers ---

function listFromText(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function phraseFromText(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

// --- Reusable panel and heading sub-components ---

function SectionPanel({ title, section, onToggle, children }) {
  return (
    <section className="glass-card section-group">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Website section</p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
        </div>
        <ToggleField label="Show section" checked={section.enabled} onChange={onToggle} />
      </div>
      {children}
    </section>
  );
}

function HeadingFields({ section, onChange, cta = false }) {
  return (
    <div className="field-grid md:grid-cols-2">
      <TextField label="Eyebrow" value={section.eyebrow} onChange={(value) => onChange({ eyebrow: value })} />
      <TextField label="Title" value={section.title} onChange={(value) => onChange({ title: value })} />
      <TextArea label="Description" value={section.description} onChange={(value) => onChange({ description: value })} />
      {cta ? (
        <>
          <TextField label="Button label" value={section.cta} onChange={(value) => onChange({ cta: value })} />
          <TextField label="Button path or URL" value={section.ctaPath} onChange={(value) => onChange({ ctaPath: value })} />
        </>
      ) : null}
    </div>
  );
}

// --- Main component ---

function ManageContent() {
  const { content, loading, saving, updateSection, updateArrayItem, addArrayItem, removeArrayItem, save } = useSiteContent();

  if (loading) {
    return <div className="panel text-white">Loading site content...</div>;
  }

  return (
    <form className="section-group" onSubmit={save}>
      <div className="panel product-panel">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">Editable website content</p>
          <h2 className="mt-3 text-3xl font-black text-white">Manage Content</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Update home-page sections here. Service cards, blog posts, and videos are still managed from their dedicated dashboard pages.
          </p>
        </div>
        <div className="button-group">
          <button type="submit" className="btn-action" disabled={saving}>
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <SectionPanel title="Hero" section={content.hero} onToggle={(enabled) => updateSection('hero', { enabled })}>
        <TextField label="Hero image URL (optional)" value={content.hero.imageUrl} onChange={(value) => updateSection('hero', { imageUrl: value })} />
        <div className="section-group">
          {content.hero.slides.map((slide, index) => (
            <div className="glass-card" key={`hero-${index}`}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <h4 className="text-xl font-black text-white">Slide {index + 1}</h4>
                <button type="button" className="btn-secondary" onClick={() => removeArrayItem('hero', 'slides', index)}>Remove</button>
              </div>
              <div className="field-grid md:grid-cols-2">
                <TextField label="Eyebrow" value={slide.eyebrow} onChange={(value) => updateArrayItem('hero', 'slides', index, { eyebrow: value })} />
                <TextField label="Title" value={slide.title} onChange={(value) => updateArrayItem('hero', 'slides', index, { title: value })} />
                <TextArea label="Body" value={slide.body} onChange={(value) => updateArrayItem('hero', 'slides', index, { body: value })} />
                <TextArea label="Typewriter phrases (comma separated)" value={(slide.phrase || []).join(', ')} onChange={(value) => updateArrayItem('hero', 'slides', index, { phrase: phraseFromText(value) })} />
                <TextField label="Button label" value={slide.cta} onChange={(value) => updateArrayItem('hero', 'slides', index, { cta: value })} />
                <TextField label="Button path" value={slide.ctaPath} onChange={(value) => updateArrayItem('hero', 'slides', index, { ctaPath: value })} />
                <TextField label="Stat value" value={slide.stat} onChange={(value) => updateArrayItem('hero', 'slides', index, { stat: value })} />
                <TextField label="Stat label" value={slide.statLabel} onChange={(value) => updateArrayItem('hero', 'slides', index, { statLabel: value })} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('hero', 'slides', emptySlide)}>Add Hero Slide</button>
      </SectionPanel>

      {/* Services Heading */}
      <SectionPanel title="Services Heading" section={content.services} onToggle={(enabled) => updateSection('services', { enabled })}>
        <HeadingFields section={content.services} onChange={(updates) => updateSection('services', updates)} cta />
      </SectionPanel>

      {/* Technologies */}
      <SectionPanel title="Technologies" section={content.technologies} onToggle={(enabled) => updateSection('technologies', { enabled })}>
        <HeadingFields section={content.technologies} onChange={(updates) => updateSection('technologies', updates)} />
        <TextArea label="Technology names (one per line)" value={(content.technologies.items || []).join('\n')} onChange={(value) => updateSection('technologies', { items: listFromText(value) })} />
      </SectionPanel>

      {/* Portfolio */}
      <SectionPanel title="Portfolio" section={content.portfolio} onToggle={(enabled) => updateSection('portfolio', { enabled })}>
        <HeadingFields section={content.portfolio} onChange={(updates) => updateSection('portfolio', updates)} />
        {content.portfolio.items.map((item, index) => (
          <div className="glass-card" key={`portfolio-${index}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h4 className="text-xl font-black text-white">Project {index + 1}</h4>
              <button type="button" className="btn-secondary" onClick={() => removeArrayItem('portfolio', 'items', index)}>Remove</button>
            </div>
            <div className="field-grid md:grid-cols-2">
              <TextField label="Title" value={item.title} onChange={(value) => updateArrayItem('portfolio', 'items', index, { title: value })} />
              <TextField label="Button label" value={item.linkLabel} onChange={(value) => updateArrayItem('portfolio', 'items', index, { linkLabel: value })} />
              <TextField label="Button path or URL" value={item.linkUrl} onChange={(value) => updateArrayItem('portfolio', 'items', index, { linkUrl: value })} />
              <TextArea label="Description" value={item.description} onChange={(value) => updateArrayItem('portfolio', 'items', index, { description: value })} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('portfolio', 'items', emptyLinkedItem)}>Add Portfolio Item</button>
      </SectionPanel>

      {/* Process */}
      <SectionPanel title="Process" section={content.process} onToggle={(enabled) => updateSection('process', { enabled })}>
        <HeadingFields section={content.process} onChange={(updates) => updateSection('process', updates)} />
        {content.process.steps.map((step, index) => (
          <div className="glass-card" key={`process-${index}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h4 className="text-xl font-black text-white">Step {index + 1}</h4>
              <button type="button" className="btn-secondary" onClick={() => removeArrayItem('process', 'steps', index)}>Remove</button>
            </div>
            <div className="field-grid md:grid-cols-2">
              <TextField label="Title" value={step.title} onChange={(value) => updateArrayItem('process', 'steps', index, { title: value })} />
              <TextArea label="Description" value={step.description} onChange={(value) => updateArrayItem('process', 'steps', index, { description: value })} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('process', 'steps', emptyTextItem)}>Add Process Step</button>
      </SectionPanel>

      {/* Why Choose Us */}
      <SectionPanel title="Why Choose Us" section={content.whyChoose} onToggle={(enabled) => updateSection('whyChoose', { enabled })}>
        <HeadingFields section={content.whyChoose} onChange={(updates) => updateSection('whyChoose', updates)} />
        {content.whyChoose.items.map((item, index) => (
          <div className="glass-card" key={`why-${index}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h4 className="text-xl font-black text-white">Reason {index + 1}</h4>
              <button type="button" className="btn-secondary" onClick={() => removeArrayItem('whyChoose', 'items', index)}>Remove</button>
            </div>
            <div className="field-grid md:grid-cols-2">
              <TextField label="Title" value={item.title} onChange={(value) => updateArrayItem('whyChoose', 'items', index, { title: value })} />
              <TextArea label="Description" value={item.description} onChange={(value) => updateArrayItem('whyChoose', 'items', index, { description: value })} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('whyChoose', 'items', emptyTextItem)}>Add Reason</button>
      </SectionPanel>

      {/* Featured Videos Heading */}
      <SectionPanel title="Featured Videos Heading" section={content.featuredVideos} onToggle={(enabled) => updateSection('featuredVideos', { enabled })}>
        <HeadingFields section={content.featuredVideos} onChange={(updates) => updateSection('featuredVideos', updates)} />
        <div className="field-grid md:grid-cols-2">
          <TextField label="YouTube label" value={content.featuredVideos.youtubeLabel} onChange={(value) => updateSection('featuredVideos', { youtubeLabel: value })} />
          <TextField label="YouTube URL" value={content.featuredVideos.youtubeUrl} onChange={(value) => updateSection('featuredVideos', { youtubeUrl: value })} />
          <TextField label="Facebook label" value={content.featuredVideos.facebookLabel} onChange={(value) => updateSection('featuredVideos', { facebookLabel: value })} />
          <TextField label="Facebook URL" value={content.featuredVideos.facebookUrl} onChange={(value) => updateSection('featuredVideos', { facebookUrl: value })} />
          <TextField label="Instagram label" value={content.featuredVideos.instagramLabel} onChange={(value) => updateSection('featuredVideos', { instagramLabel: value })} />
          <TextField label="Instagram URL" value={content.featuredVideos.instagramUrl} onChange={(value) => updateSection('featuredVideos', { instagramUrl: value })} />
        </div>
      </SectionPanel>

      {/* Latest Blogs Heading */}
      <SectionPanel title="Latest Blogs Heading" section={content.latestBlogs} onToggle={(enabled) => updateSection('latestBlogs', { enabled })}>
        <HeadingFields section={content.latestBlogs} onChange={(updates) => updateSection('latestBlogs', updates)} cta />
      </SectionPanel>

      {/* Testimonials */}
      <SectionPanel title="Testimonials" section={content.testimonials} onToggle={(enabled) => updateSection('testimonials', { enabled })}>
        <HeadingFields section={content.testimonials} onChange={(updates) => updateSection('testimonials', updates)} />
        {content.testimonials.items.map((item, index) => (
          <div className="glass-card" key={`testimonial-${index}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h4 className="text-xl font-black text-white">Testimonial {index + 1}</h4>
              <button type="button" className="btn-secondary" onClick={() => removeArrayItem('testimonials', 'items', index)}>Remove</button>
            </div>
            <div className="field-grid md:grid-cols-2">
              <TextField label="Name" value={item.name} onChange={(value) => updateArrayItem('testimonials', 'items', index, { name: value })} />
              <TextField label="Company / role" value={item.company} onChange={(value) => updateArrayItem('testimonials', 'items', index, { company: value })} />
              <TextField label="Rating (0-5)" type="number" value={item.rating} onChange={(value) => updateArrayItem('testimonials', 'items', index, { rating: Number(value) })} />
              <SelectField
                label="Display image as"
                value={item.imageType || 'photo'}
                onChange={(value) => updateArrayItem('testimonials', 'items', index, { imageType: value })}
                options={[
                  { label: 'Photo', value: 'photo' },
                  { label: 'Logo', value: 'logo' },
                ]}
              />
              <TextField label="Image URL" value={item.imageUrl} onChange={(value) => updateArrayItem('testimonials', 'items', index, { imageUrl: value })} />
              <div className="field">
                <label>Image visibility</label>
                <ToggleField label="Show photo or logo" checked={item.showImage} onChange={(value) => updateArrayItem('testimonials', 'items', index, { showImage: value })} />
              </div>
              <TextArea label="Quote" value={item.quote} onChange={(value) => updateArrayItem('testimonials', 'items', index, { quote: value })} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('testimonials', 'items', emptyTestimonial)}>Add Testimonial</button>
      </SectionPanel>

      {/* Consultation CTA */}
      <SectionPanel title="Consultation CTA" section={content.consultation} onToggle={(enabled) => updateSection('consultation', { enabled })}>
        <div className="field-grid md:grid-cols-2">
          <TextField label="Title" value={content.consultation.title} onChange={(value) => updateSection('consultation', { title: value })} />
          <TextField label="Button label" value={content.consultation.cta} onChange={(value) => updateSection('consultation', { cta: value })} />
          <TextField label="Button URL" value={content.consultation.ctaUrl} onChange={(value) => updateSection('consultation', { ctaUrl: value })} />
          <TextArea label="Description" value={content.consultation.description} onChange={(value) => updateSection('consultation', { description: value })} />
        </div>
      </SectionPanel>

      {/* FAQ */}
      <SectionPanel title="FAQ" section={content.faq} onToggle={(enabled) => updateSection('faq', { enabled })}>
        <HeadingFields section={content.faq} onChange={(updates) => updateSection('faq', updates)} />
        {content.faq.items.map((item, index) => (
          <div className="glass-card" key={`faq-${index}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <h4 className="text-xl font-black text-white">Question {index + 1}</h4>
              <button type="button" className="btn-secondary" onClick={() => removeArrayItem('faq', 'items', index)}>Remove</button>
            </div>
            <div className="field-grid md:grid-cols-2">
              <TextField label="Question" value={item.question} onChange={(value) => updateArrayItem('faq', 'items', index, { question: value })} />
              <TextArea label="Answer" value={item.answer} onChange={(value) => updateArrayItem('faq', 'items', index, { answer: value })} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => addArrayItem('faq', 'items', emptyFaq)}>Add FAQ</button>
      </SectionPanel>

      <div className="button-group">
        <button type="submit" className="btn-action" disabled={saving}>
          {saving ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </form>
  );
}

export default ManageContent;
