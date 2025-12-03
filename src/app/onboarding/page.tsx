'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  type: 'choice' | 'multiple' | 'upload' | 'form';
  title: string;
  shortTitle: string;
  subtitle: string;
  options?: { label: string; value: string }[];
  maxPhotos?: number;
  fields?: { name: string; label: string; type: string; required: boolean }[];
}

interface Photo {
  file: File;
  preview: string;
}

export default function DiagnosticPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const questions: Question[] = [
    {
      id: 'surface',
      type: 'choice',
      title: 'Quelle est la surface totale de votre pelouse (en m²)',
      shortTitle: 'Surface',
      subtitle: 'Si vous ne la connaissez pas précisément, vous pouvez utiliser Google Maps ou Google Earth pour estimer la surface avec leurs outils de mesure.',
      options: [
        { label: 'Moins de 100 m²', value: 'small' },
        { label: 'Entre 100 et 500 m²', value: 'medium' },
        { label: 'Plus de 500 m²', value: 'large' },
        { label: 'Je ne sais pas, je le préciserai plus tard', value: 'unknown' }
      ]
    },
    {
      id: 'usage',
      type: 'choice',
      title: "Quel est l'usage principal de votre pelouse ?",
      shortTitle: 'Usage',
      subtitle: 'Cela nous aidera à recommander les bonnes semences et le bon entretien.',
      options: [
        { label: 'Jardin familial avec enfants/animaux', value: 'family' },
        { label: 'Jardin décoratif', value: 'decorative' },
        { label: 'Pelouse sportive', value: 'sport' },
        { label: 'Autre usage', value: 'other' }
      ]
    },
    {
      id: 'problems',
      type: 'multiple',
      title: 'Quels sont les problèmes actuels de votre pelouse ?',
      shortTitle: 'Problèmes',
      subtitle: 'Vous pouvez sélectionner plusieurs réponses.',
      options: [
        { label: 'Zones dégarnies/trous', value: 'bare_spots' },
        { label: 'Jaunissement', value: 'yellowing' },
        { label: 'Mousse', value: 'moss' },
        { label: 'Mauvaises herbes', value: 'weeds' },
        { label: 'Sol compacté', value: 'compacted' },
        { label: 'Manque de densité', value: 'thin' },
        { label: 'Pas de problème particulier', value: 'none' }
      ]
    },
    {
      id: 'sun_exposure',
      type: 'choice',
      title: "Quelle est l'exposition au soleil de votre pelouse ?",
      shortTitle: 'Exposition',
      subtitle: "L'ensoleillement influence le choix des semences.",
      options: [
        { label: 'Plein soleil toute la journée', value: 'full_sun' },
        { label: 'Mi-ombre (4-6h de soleil)', value: 'partial_shade' },
        { label: 'Ombre importante', value: 'shade' },
        { label: 'Exposition mixte', value: 'mixed' }
      ]
    },
    {
      id: 'budget',
      type: 'choice',
      title: 'Quel budget souhaitez-vous consacrer à la rénovation ?',
      shortTitle: 'Budget',
      subtitle: 'Cela nous permettra de vous proposer des solutions adaptées.',
      options: [
        { label: 'Moins de 200€', value: 'low' },
        { label: 'Entre 200€ et 500€', value: 'medium' },
        { label: 'Entre 500€ et 1000€', value: 'high' },
        { label: 'Plus de 1000€', value: 'premium' },
        { label: 'Je ne sais pas', value: 'unknown' }
      ]
    },
    {
      id: 'timeline',
      type: 'choice',
      title: 'Quand souhaitez-vous commencer les travaux ?',
      shortTitle: 'Calendrier',
      subtitle: "Certaines périodes sont plus favorables que d'autres.",
      options: [
        { label: 'Dès maintenant', value: 'now' },
        { label: 'Dans le mois prochain', value: 'next_month' },
        { label: 'Dans les 3 prochains mois', value: 'quarter' },
        { label: 'Je ne sais pas encore', value: 'flexible' }
      ]
    },
    {
      id: 'photos',
      type: 'upload',
      title: 'Prenez votre pelouse en photo',
      shortTitle: 'Photos',
      subtitle: 'Ajoutez 3 à 5 photos de votre pelouse pour un diagnostic précis. Montrez-nous les différentes zones, en particulier les zones problématiques.',
      maxPhotos: 5
    },
    {
      id: 'contact',
      type: 'form',
      title: 'Vos coordonnées',
      shortTitle: 'Contact',
      subtitle: 'Pour vous envoyer votre diagnostic personnalisé sous 48h.',
      fields: [
        { name: 'firstName', label: 'Prénom', type: 'text', required: true },
        { name: 'lastName', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Téléphone', type: 'tel', required: false }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === 'multiple') {
      const currentAnswers = answers[currentQuestion.id] || [];
      if (currentAnswers.includes(value)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter((v: string) => v !== value)
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, value]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: value
      });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentQuestion.type === 'upload') {
      return photos.length >= 3;
    }
    if (currentQuestion.type === 'form') {
      const formData = answers[currentQuestion.id] || {};
      return currentQuestion.fields!
        .filter(f => f.required)
        .every(f => formData[f.name] && formData[f.name].trim() !== '');
    }
    if (currentQuestion.type === 'multiple') {
      return (answers[currentQuestion.id] || []).length > 0;
    }
    return answers[currentQuestion.id] !== undefined;
  };

  const handleFormChange = (fieldName: string, value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        ...(answers[currentQuestion.id] || {}),
        [fieldName]: value
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length <= (currentQuestion.maxPhotos || 5)) {
      const newPhotos = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (isComplete) {
    return <CompletePage />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF9F7',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Formes organiques de fond */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50% 60% 50% 60%', background: '#FFF9C4', opacity: 0.3, zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '100px', right: '-50px', width: '400px', height: '400px', borderRadius: '60% 50% 60% 50%', background: '#AED581', opacity: 0.2, zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-50px', right: '200px', width: '200px', height: '200px', borderRadius: '50% 60% 50% 60%', background: '#FFCCBC', opacity: 0.25, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '60% 50% 60% 50%', background: '#E1BEE7', opacity: 0.2, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '100px', left: '-80px', width: '300px', height: '300px', borderRadius: '50% 60% 50% 60%', background: '#B3E5FC', opacity: 0.25, zIndex: 0 }} />

      {/* Progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: '#E8E5DF',
        zIndex: 100
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#2D5016',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Steps navigation */}
      <div style={{
        position: 'fixed',
        top: '4px',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #E8E5DF',
        padding: '1rem 2rem',
        zIndex: 99,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid #E8E5DF',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ChevronLeft size={20} color="#1A1A1A" />
          </button>

          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            overflow: 'auto',
            padding: '0 1rem'
          }}>
            {questions.map((question, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => setCurrentStep(index)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.5rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#2D5016' : isCurrent ? '#E8F2E6' : '#F5F3EF',
                      border: isCurrent ? '2px solid #2D5016' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: isCompleted ? 'white' : '#1A1A1A'
                    }}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent ? '#2D5016' : '#666666',
                      whiteSpace: 'nowrap'
                    }}>
                      {question.shortTitle}
                    </span>
                  </button>

                  {index < questions.length - 1 && (
                    <div style={{
                      width: '20px',
                      height: '2px',
                      backgroundColor: index < currentStep ? '#2D5016' : '#E8E5DF',
                      margin: '0 0.25rem',
                      marginBottom: '1.5rem'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: '#F5F3EF',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#666666',
            flexShrink: 0
          }}>
            {currentStep + 1} / {questions.length}
          </div>
        </div>
      </div>

      {/* Question content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '10rem 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          backgroundColor: '#2D5016',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '1.125rem',
          marginBottom: '2rem'
        }}>
          {currentStep + 1}
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#1A1A1A',
          lineHeight: 1.2
        }}>
          {currentQuestion.title}
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#666666',
          marginBottom: '3rem',
          lineHeight: 1.6
        }}>
          {currentQuestion.subtitle}
        </p>

        {/* Answer options */}
        {currentQuestion.type === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {currentQuestion.options!.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                style={{
                  padding: '1.5rem 2rem',
                  backgroundColor: answers[currentQuestion.id] === option.value ? '#E8F2E6' : 'rgba(255, 255, 255, 0.8)',
                  border: answers[currentQuestion.id] === option.value ? '2px solid #2D5016' : '2px solid #E8E5DF',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  color: '#1A1A1A',
                  fontWeight: answers[currentQuestion.id] === option.value ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#E8E5DF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#666666',
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                {option.label}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'multiple' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {currentQuestion.options!.map((option, index) => {
              const isSelected = (answers[currentQuestion.id] || []).includes(option.value);
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  style={{
                    padding: '1.5rem 2rem',
                    backgroundColor: isSelected ? '#E8F2E6' : 'rgba(255, 255, 255, 0.8)',
                    border: isSelected ? '2px solid #2D5016' : '2px solid #E8E5DF',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1.125rem',
                    color: '#1A1A1A',
                    fontWeight: isSelected ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#2D5016' : '#E8E5DF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: isSelected ? 'white' : '#666666',
                    flexShrink: 0
                  }}>
                    {isSelected ? '✓' : String.fromCharCode(65 + index)}
                  </div>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'upload' && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F5F3EF' }}>
                  <img
                    src={photo.preview}
                    alt={`Photo ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {photos.length < (currentQuestion.maxPhotos || 5) && (
                <label style={{
                  aspectRatio: '1',
                  border: '2px dashed #E8E5DF',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Plus size={32} color="#2D5016" style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.875rem', color: '#666666', textAlign: 'center', padding: '0 1rem' }}>
                    Ajouter une photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666666', textAlign: 'center' }}>
              {photos.length} / {currentQuestion.maxPhotos} photos • Minimum 3 photos requises
            </p>
          </div>
        )}

        {currentQuestion.type === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {currentQuestion.fields!.map((field, index) => (
              <div key={index}>
                <label style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#1A1A1A'
                }}>
                  {field.label} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={(answers[currentQuestion.id] || {})[field.name] || ''}
                  onChange={(e) => handleFormChange(field.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #E8E5DF',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1A1A1A',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                backgroundColor: 'white',
                color: '#2D5016',
                border: '2px solid #E8E5DF',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <ChevronLeft size={20} />
              Retour
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              backgroundColor: canProceed() ? '#2D5016' : '#E8E5DF',
              color: canProceed() ? 'white' : '#999999',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: canProceed() ? '0 4px 12px rgba(45, 80, 22, 0.3)' : 'none'
            }}
          >
            {currentStep < questions.length - 1 ? 'Suivant' : 'Envoyer'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF9F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50% 60% 50% 60%', background: '#C8E6C9', opacity: 0.3, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '60% 50% 60% 50%', background: '#AED581', opacity: 0.2, zIndex: 0 }} />

      <div style={{
        maxWidth: '700px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2D5016, #00C896)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 8px 24px rgba(45, 80, 22, 0.2)'
        }}>
          <CheckCircle size={64} color="white" />
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: '#1A1A1A'
        }}>
          Merci pour votre confiance !
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#666666',
          marginBottom: '3rem',
          lineHeight: 1.6
        }}>
          Votre diagnostic personnalisé vous sera envoyé par email <strong>sous 48 heures</strong>.
          Notre équipe d&apos;experts analyse vos réponses et photos pour vous proposer un plan d&apos;action sur-mesure.
        </p>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          border: '1px solid #E8E5DF'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#2D5016' }}>
            Et maintenant ?
          </h3>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <p style={{ margin: 0, color: '#666666' }}>
                Vous recevrez un email de confirmation avec votre numéro de diagnostic
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
              <p style={{ margin: 0, color: '#666666' }}>
                Notre équipe analyse en détail vos photos et vos réponses
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <p style={{ margin: 0, color: '#666666' }}>
                Vous recevrez votre plan d&apos;action personnalisé avec produits recommandés
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              backgroundColor: 'white',
              color: '#2D5016',
              border: '2px solid #2D5016',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
