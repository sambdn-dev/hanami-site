'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

const steps = [
  { id: 1, name: 'Surface', label: 'Surface' },
  { id: 2, name: 'Usage', label: 'Usage' },
  { id: 3, name: 'Problèmes', label: 'Problèmes' },
  { id: 4, name: 'Exposition', label: 'Exposition' },
  { id: 5, name: 'Budget', label: 'Budget' },
  { id: 6, name: 'Calendrier', label: 'Calendrier' },
  { id: 7, name: 'Photos', label: 'Photos' },
  { id: 8, name: 'Contact', label: 'Contact' },
];

const questions: Record<number, {
  title: string;
  subtitle?: string;
  options: { key: string; label: string }[];
}> = {
  1: {
    title: 'Quelle est la surface totale de votre pelouse (en m²)',
    subtitle: 'Si vous ne la connaissez pas précisément, vous pouvez utiliser Google Maps ou Google Earth pour estimer la surface avec leurs outils de mesure.',
    options: [
      { key: 'A', label: 'Moins de 100 m²' },
      { key: 'B', label: 'Entre 100 et 500 m²' },
      { key: 'C', label: 'Plus de 500 m²' },
      { key: 'D', label: 'Je ne sais pas, je le préciserai plus tard' },
    ],
  },
  2: {
    title: 'Quel est l\'usage principal de votre pelouse ?',
    subtitle: 'Cela nous aide à comprendre le niveau de résistance nécessaire.',
    options: [
      { key: 'A', label: 'Ornementale (peu de passage)' },
      { key: 'B', label: 'Familiale (enfants, animaux)' },
      { key: 'C', label: 'Sportive (jeux réguliers)' },
      { key: 'D', label: 'Mixte' },
    ],
  },
  3: {
    title: 'Quels problèmes rencontrez-vous actuellement ?',
    subtitle: 'Sélectionnez le problème principal.',
    options: [
      { key: 'A', label: 'Zones dégarnies ou clairsemées' },
      { key: 'B', label: 'Mousse ou mauvaises herbes' },
      { key: 'C', label: 'Jaunissement ou stress hydrique' },
      { key: 'D', label: 'Aucun problème particulier' },
    ],
  },
  4: {
    title: 'Quelle est l\'exposition de votre pelouse ?',
    subtitle: 'L\'ensoleillement influence le choix des semences.',
    options: [
      { key: 'A', label: 'Plein soleil (+ de 6h/jour)' },
      { key: 'B', label: 'Mi-ombre (3-6h/jour)' },
      { key: 'C', label: 'Ombre (- de 3h/jour)' },
      { key: 'D', label: 'Variable selon les zones' },
    ],
  },
  5: {
    title: 'Quel est votre budget pour l\'entretien ?',
    subtitle: 'Cela nous aide à vous proposer les produits adaptés.',
    options: [
      { key: 'A', label: 'Économique (moins de 50€)' },
      { key: 'B', label: 'Modéré (50-150€)' },
      { key: 'C', label: 'Confortable (150-300€)' },
      { key: 'D', label: 'Pas de limite' },
    ],
  },
  6: {
    title: 'Quand souhaitez-vous commencer ?',
    subtitle: 'Le timing peut influencer nos recommandations.',
    options: [
      { key: 'A', label: 'Immédiatement' },
      { key: 'B', label: 'Dans les 2 semaines' },
      { key: 'C', label: 'Dans le mois' },
      { key: 'D', label: 'Je me renseigne pour plus tard' },
    ],
  },
  7: {
    title: 'Avez-vous des photos de votre pelouse ?',
    subtitle: 'Les photos nous aident à mieux diagnostiquer.',
    options: [
      { key: 'A', label: 'Oui, je peux en envoyer' },
      { key: 'B', label: 'Non, mais je peux en prendre' },
      { key: 'C', label: 'Non, je préfère ne pas en envoyer' },
    ],
  },
  8: {
    title: 'Comment souhaitez-vous être contacté ?',
    subtitle: 'Nous vous recontacterons avec nos recommandations.',
    options: [
      { key: 'A', label: 'Par email' },
      { key: 'B', label: 'Par téléphone' },
      { key: 'C', label: 'Par WhatsApp' },
      { key: 'D', label: 'Pas de contact, je veux juste les recommandations' },
    ],
  },
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const question = questions[currentStep];
  const selectedAnswer = answers[currentStep];

  const handleSelect = (key: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: key }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(45, 80, 22, 0.08)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '200px',
        right: '100px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 200, 180, 0.3)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(200, 230, 255, 0.4)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '100px',
        right: '-50px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(255, 230, 200, 0.3)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '-80px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(200, 255, 220, 0.3)',
        zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Back button */}
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid #E8E5DF',
            backgroundColor: 'white',
            cursor: currentStep === 1 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={20} color="#1A1A1A" />
        </button>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: step.id === currentStep ? '#2D5016' : step.id < currentStep ? '#2D5016' : 'white',
                  border: step.id <= currentStep ? 'none' : '1px solid #E8E5DF',
                  color: step.id <= currentStep ? 'white' : '#666666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {step.id}
                </div>
                <span style={{
                  fontSize: '0.625rem',
                  color: step.id === currentStep ? '#2D5016' : '#666666',
                  fontWeight: step.id === currentStep ? 600 : 400,
                }}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={{
                  width: '24px',
                  height: '1px',
                  backgroundColor: step.id < currentStep ? '#2D5016' : '#E8E5DF',
                  marginBottom: '1rem',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step counter */}
        <div style={{
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid #E8E5DF',
          backgroundColor: 'white',
          fontSize: '0.875rem',
          color: '#666666',
        }}>
          {currentStep} / {steps.length}
        </div>
      </header>

      {/* Home button */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem 0',
        position: 'relative',
        zIndex: 10,
      }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'white',
            border: '1px solid #E8E5DF',
            borderRadius: '8px',
            color: '#2D5016',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.2s ease',
          }}
        >
          <Home size={18} />
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Main content */}
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 5,
      }}>
        {/* Step number badge */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: '#2D5016',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
        }}>
          {currentStep}
        </div>

        {/* Question */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          {question.title}
        </h1>

        {question.subtitle && (
          <p style={{
            fontSize: '1rem',
            color: '#666666',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}>
            {question.subtitle}
          </p>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {question.options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: selectedAnswer === option.key ? '#E8F2E6' : 'white',
                border: selectedAnswer === option.key ? '2px solid #2D5016' : '1px solid #E8E5DF',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: selectedAnswer === option.key ? '#2D5016' : '#F5F3EF',
                color: selectedAnswer === option.key ? 'white' : '#666666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {option.key}
              </span>
              <span style={{
                fontSize: '1rem',
                color: '#1A1A1A',
                fontWeight: selectedAnswer === option.key ? 600 : 400,
              }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 2rem',
            backgroundColor: selectedAnswer ? '#2D5016' : '#E8E5DF',
            color: selectedAnswer ? 'white' : '#999999',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: selectedAnswer ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          Suivant
          <ChevronRight size={20} />
        </button>
      </main>
    </div>
  );
}
