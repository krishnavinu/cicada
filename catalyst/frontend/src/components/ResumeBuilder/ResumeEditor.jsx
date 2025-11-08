import { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DraggableSection from './DraggableSection';

function ResumeEditor({ resumeData, onUpdate }) {
  const sections = resumeData?.sections || {};

  // Move item in array (for drag and drop)
  const moveItem = (sectionName, dragIndex, hoverIndex) => {
    const items = [...(sections[sectionName] || [])];
    const draggedItem = items[dragIndex];
    items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, draggedItem);
    onUpdate(sectionName, items);
  };

  const updatePersonalInfo = (field, value) => {
    onUpdate('personalInfo', {
      ...sections.personalInfo,
      [field]: value
    });
  };

  const addEducation = () => {
    const education = sections.education || [];
    onUpdate('education', [
      ...education,
      { degree: '', institution: '', year: '', gpa: '', achievements: [] }
    ]);
  };

  const updateEducation = (index, field, value) => {
    const education = [...(sections.education || [])];
    education[index] = { ...education[index], [field]: value };
    onUpdate('education', education);
  };

  const removeEducation = (index) => {
    const education = [...(sections.education || [])];
    education.splice(index, 1);
    onUpdate('education', education);
  };

  const addExperience = () => {
    const experience = sections.experience || [];
    onUpdate('experience', [
      ...experience,
      { title: '', company: '', duration: '', description: '', achievements: [] }
    ]);
  };

  const updateExperience = (index, field, value) => {
    const experience = [...(sections.experience || [])];
    experience[index] = { ...experience[index], [field]: value };
    onUpdate('experience', experience);
  };

  const removeExperience = (index) => {
    const experience = [...(sections.experience || [])];
    experience.splice(index, 1);
    onUpdate('experience', experience);
  };

  const addSkill = () => {
    const skills = sections.skills || [];
    onUpdate('skills', [
      ...skills,
      { category: '', items: [] }
    ]);
  };

  const updateSkill = (index, field, value) => {
    const skills = [...(sections.skills || [])];
    if (field === 'items') {
      skills[index] = { ...skills[index], items: value.split(',').map(s => s.trim()) };
    } else {
      skills[index] = { ...skills[index], [field]: value };
    }
    onUpdate('skills', skills);
  };

  const removeSkill = (index) => {
    const skills = [...(sections.skills || [])];
    skills.splice(index, 1);
    onUpdate('skills', skills);
  };

  return (
    <div 
      className="resume-editor p-4 rounded-lg shadow-lg backdrop-blur-xl border-2"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      <h2 
        className="text-2xl font-bold mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        Resume Editor
      </h2>

      {/* Personal Information */}
      <div className="mb-6">
        <h3 
          className="text-xl font-semibold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabel label="Full Name">
            <Form.Control
              type="text"
              value={sections.personalInfo?.fullName || ''}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="Email">
            <Form.Control
              type="email"
              value={sections.personalInfo?.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="Phone">
            <Form.Control
              type="tel"
              value={sections.personalInfo?.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="Address">
            <Form.Control
              type="text"
              value={sections.personalInfo?.address || ''}
              onChange={(e) => updatePersonalInfo('address', e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="LinkedIn (optional)">
            <Form.Control
              type="url"
              value={sections.personalInfo?.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="GitHub (optional)">
            <Form.Control
              type="url"
              value={sections.personalInfo?.github || ''}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
            />
          </FloatingLabel>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 
          className="text-xl font-semibold mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          Professional Summary
        </h3>
        <Form.Control
          as="textarea"
          rows={4}
          value={sections.summary || ''}
          onChange={(e) => onUpdate('summary', e.target.value)}
          placeholder="Write a brief summary about yourself..."
        />
      </div>

      {/* Education */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 
            className="text-xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Education
          </h3>
          <Button variant="primary" size="sm" onClick={addEducation}>
            <i className="fa-solid fa-plus"></i> Add Education
          </Button>
        </div>
        {(sections.education || []).map((edu, index) => (
          <DraggableSection
            key={index}
            id={`edu-${index}`}
            index={index}
            type="education"
            moveItem={(dragIndex, hoverIndex) => moveItem('education', dragIndex, hoverIndex)}
            onRemove={() => removeEducation(index)}
          >
            <div className="grid grid-cols-2 gap-4">
              <FloatingLabel label="Degree">
                <Form.Control
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Institution">
                <Form.Control
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Year">
                <Form.Control
                  type="text"
                  value={edu.year || ''}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="GPA">
                <Form.Control
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                />
              </FloatingLabel>
            </div>
          </DraggableSection>
        ))}
      </div>

      {/* Experience */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 
            className="text-xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Experience
          </h3>
          <Button variant="primary" size="sm" onClick={addExperience}>
            <i className="fa-solid fa-plus"></i> Add Experience
          </Button>
        </div>
        {(sections.experience || []).map((exp, index) => (
          <DraggableSection
            key={index}
            id={`exp-${index}`}
            index={index}
            type="experience"
            moveItem={(dragIndex, hoverIndex) => moveItem('experience', dragIndex, hoverIndex)}
            onRemove={() => removeExperience(index)}
          >
            <div className="grid grid-cols-2 gap-4 mb-2">
              <FloatingLabel label="Job Title">
                <Form.Control
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Company">
                <Form.Control
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </FloatingLabel>
              <FloatingLabel label="Duration">
                <Form.Control
                  type="text"
                  value={exp.duration || ''}
                  onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                  placeholder="e.g., Jan 2023 - Dec 2023"
                />
              </FloatingLabel>
            </div>
            <FloatingLabel label="Description" className="mb-2">
              <Form.Control
                as="textarea"
                rows={3}
                value={exp.description || ''}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
              />
            </FloatingLabel>
          </DraggableSection>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 
            className="text-xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Skills
          </h3>
          <Button variant="primary" size="sm" onClick={addSkill}>
            <i className="fa-solid fa-plus"></i> Add Skill Category
          </Button>
        </div>
        {(sections.skills || []).map((skill, index) => (
          <DraggableSection
            key={index}
            id={`skill-${index}`}
            index={index}
            type="skills"
            moveItem={(dragIndex, hoverIndex) => moveItem('skills', dragIndex, hoverIndex)}
            onRemove={() => removeSkill(index)}
          >
            <div className="grid grid-cols-2 gap-4">
              <FloatingLabel label="Category">
                <Form.Control
                  type="text"
                  value={skill.category || ''}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  placeholder="e.g., Programming Languages"
                />
              </FloatingLabel>
              <FloatingLabel label="Skills (comma separated)">
                <Form.Control
                  type="text"
                  value={skill.items?.join(', ') || ''}
                  onChange={(e) => updateSkill(index, 'items', e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                />
              </FloatingLabel>
            </div>
          </DraggableSection>
        ))}
      </div>
    </div>
  );
}

export default ResumeEditor;

