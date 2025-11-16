
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Stepper from './components/Stepper';
import UploadStep from './components/UploadStep';
import RequirementStep from './components/RequirementStep';
import EditorStep from './components/EditorStep';
import HomePageContent from './components/HomePageContent';
import Features from './components/Features';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import DisclaimerPage from './components/DisclaimerPage';
import { Step, DocType } from './types';
import { REQUIREMENTS } from './constants';
import { useLanguage } from './LanguageContext';


const MainContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Upload);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [docType, setDocType] = useState<DocType>(DocType.None);
  const { t } = useLanguage();

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setImageSrc(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    setCurrentStep(Step.Requirement);
  };

  const handleNextStep = () => {
    if (currentStep === Step.Requirement) {
      if (docType === DocType.None) {
        alert(t('pleaseSelectDocType'));
        return;
      }
      setCurrentStep(Step.Editor);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === Step.Requirement) {
      setCurrentStep(Step.Upload);
      setUploadedFile(null);
      setImageSrc('');
      setDocType(DocType.None);
    } else if (currentStep === Step.Editor) {
      setCurrentStep(Step.Requirement);
    }
  };
  
  const selectedRequirement = useMemo(() => {
    return REQUIREMENTS[docType];
  }, [docType]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case Step.Upload:
        return <UploadStep onFileSelect={handleFileSelect} />;
      case Step.Requirement:
        return <RequirementStep docType={docType} onDocTypeChange={setDocType} />;
      case Step.Editor:
        if (imageSrc && docType !== DocType.None && selectedRequirement) {
          return <EditorStep imageSrc={imageSrc} docType={docType} requirements={selectedRequirement} />;
        }
        // Fallback if state is inconsistent
        setCurrentStep(Step.Upload);
        return null;
      default:
        return <UploadStep onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('mainTitle')}</h1>
        <p className="text-gray-600 mb-6">{t('mainSubtitle')}</p>
        <hr className="mb-6"/>
        <Stepper currentStep={currentStep} />
        <div className="min-h-[300px]">
          {renderCurrentStep()}
        </div>
        
        {(currentStep === Step.Requirement || currentStep === Step.Editor) && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              &lt; {t('previous')}
            </button>
            {currentStep === Step.Requirement && (
               <button
                onClick={handleNextStep}
                disabled={docType === DocType.None}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
               >
                 {t('next')} &gt;
               </button>
            )}
          </div>
        )}
      </div>
      
      <HomePageContent />
      <Features />
    </div>
  );
};


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    // Manually setting the hash will trigger the 'hashchange' listener
    window.location.hash = hash;
  };

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    switch(route) {
      case '#contact':
        return <ContactPage />;
      case '#privacy':
        return <PrivacyPolicyPage />;
      case '#disclaimer':
        return <DisclaimerPage />;
      default:
        return <MainContent />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavClick={handleNavClick} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <Footer onNavClick={handleNavClick} />
    </div>
  );
};

export default App;