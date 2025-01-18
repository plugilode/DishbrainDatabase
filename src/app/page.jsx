"use client";
import React from "react";
import ItemInventoryManager from "../components/item-inventory-manager";
import PaymentRemindersModule from "../components/payment-reminders-module";
import TaxCalculationModule from "../components/tax-calculation-module";
import Component3DButtonDesign from "../components/component-3-d-button-design";
import PayrollManager from "../components/payroll-manager";
import { useVirtualizer } from '@tanstack/react-virtual';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, memo, useCallback } from 'react';
import { loadExpertsInChunks, loadMoreExperts } from '../utils/dataLoader';
import { LoadingState } from '../components/loading-state';
import { debounce } from 'lodash';

// Add this helper function at the top of your file, outside the components
const formatUrl = (url) => {
  if (!url) return '';
  // Remove localhost if present
  if (url.includes('localhost:3001/')) {
    url = url.split('localhost:3001/')[1];
  }
  // Add https:// if no protocol is present
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
};

// Memoize child components
const ExpertCard = memo(({ expert, onViewProfile }) => {
  // Update the image source to use a default if the expert image is not found
  const imgSrc = expert?.personalInfo?.image || '/default-avatar.png';
  
  return (
    <div 
      className="border border-black rounded p-4 hover:shadow-lg transition-shadow"
      role="article"
      aria-label={`Expert profile for ${expert?.personalInfo?.fullName}`}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onViewProfile(expert)}
    >
      <div className="flex items-center mb-3">
        <img
          src={imgSrc}
          alt={expert?.personalInfo?.fullName || 'Expert'}
          className="w-12 h-12 rounded-full mr-3 object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/default-avatar.png';
          }}
        />
        <div>
          <h4 className="font-medium">{expert?.personalInfo?.fullName || 'Unknown Expert'}</h4>
          <p className="text-sm text-gray-600">{expert?.institution?.name || 'Institution not specified'}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {expert?.currentRole?.title && (
          <p><strong>Position:</strong> {expert.currentRole.title}</p>
        )}
        {expert?.expertise?.primary && expert.expertise.primary.length > 0 && (
          <p><strong>Expertise:</strong> {expert.expertise.primary.join(', ')}</p>
        )}
        {expert?.academicMetrics?.publications?.total && (
          <p><strong>Publications:</strong> {expert.academicMetrics.publications.total}</p>
        )}
      </div>
      <Component3DButtonDesign 
        onClick={() => onViewProfile(expert)}
        className="mt-3 w-full"
      >
        Profil anzeigen
      </Component3DButtonDesign>
    </div>
  );
});

// Create loading components
const LoadingCard = () => (
  <div className="border border-black rounded p-4 animate-pulse">
    <div className="h-12 bg-gray-200 rounded mb-3"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
  </div>
);

// Create error fallback
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="text-center p-4" role="alert">
    <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
    <pre className="text-sm text-red-500">{error.message}</pre>
    <Component3DButtonDesign onClick={resetErrorBoundary}>Try again</Component3DButtonDesign>
  </div>
);

function MainComponent() {
  const [activeModule, setActiveModule] = React.useState("dashboard");
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [employeeName, setEmployeeName] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [accounts, setAccounts] = React.useState([
    { name: "KI-Entwicklung", balance: 15000 },
    { name: "Personalentwicklung", balance: 8000 },
    { name: "Forschung & Innovation", balance: 12000 },
  ]);
  const [companies] = React.useState([
    {
      name: "DeepMind Deutschland GmbH",
      location: "Berlin",
      focus: "Künstliche Intelligenz & Deep Learning",
      employees: 250,
      founded: 2018,
      projects: "AlphaFold, Robotik-Steuerung",
      logo: "/company1.jpg",
    },
    {
      name: "AI Solutions AG",
      location: "München",
      focus: "Machine Learning & Predictive Analytics",
      employees: 120,
      founded: 2015,
      projects: "Industrieautomatisierung, Smart City",
      logo: "/company2.jpg",
    },
    {
      name: "Neural Systems GmbH",
      location: "Hamburg",
      focus: "Neuronale Netze & Computer Vision",
      employees: 80,
      founded: 2019,
      projects: "Bildverarbeitung, Qualitätskontrolle",
      logo: "/company3.jpg",
    },
    {
      name: "KI Innovationen AG",
      location: "Frankfurt",
      focus: "Natural Language Processing",
      employees: 150,
      founded: 2017,
      projects: "Chatbots, Sprachassistenten",
      logo: "/company4.jpg",
    },
    {
      name: "Quantum AI Labs",
      location: "Stuttgart",
      focus: "Quantum Computing & KI",
      employees: 45,
      founded: 2020,
      projects: "Quantenalgorithmen, Optimierung",
      logo: "/company5.jpg",
    },
    {
      name: "RoboTech Solutions",
      location: "Dresden",
      focus: "Robotik & KI",
      employees: 95,
      founded: 2016,
      projects: "Industrieroboter, Autonome Systeme",
      logo: "/company6.jpg",
    },
    {
      name: "Smart Analytics GmbH",
      location: "Köln",
      focus: "Business Intelligence & KI",
      employees: 75,
      founded: 2018,
      projects: "Datenanalyse, Prozessoptimierung",
      logo: "/company7.jpg",
    },
    {
      name: "AI Health Tech",
      location: "Heidelberg",
      focus: "KI in der Medizin",
      employees: 60,
      founded: 2019,
      projects: "Diagnose-KI, Medizinische Bildgebung",
      logo: "/company8.jpg",
    },
    {
      name: "Future Mobility AI",
      location: "München",
      focus: "Autonomes Fahren",
      employees: 180,
      founded: 2017,
      projects: "Fahrzeugsteuerung, Verkehrsanalyse",
      logo: "/company9.jpg",
    },
    {
      name: "Green AI Solutions",
      location: "Berlin",
      focus: "Nachhaltige KI",
      employees: 40,
      founded: 2021,
      projects: "Energieoptimierung, CO2-Reduktion",
      logo: "/company10.jpg",
    },
  ]);
  const [gateways, setGateways] = React.useState([
    {
      name: "KI-Experten Interface",
      apiKey: "ai_expert_4eC39HqLyjWDarjtT1zdp7dc",
    },
    {
      name: "Personal API",
      apiKey: "hr_21AAK-4kE7gQv5_your_example_key_here",
    },
  ]);
  const [aiSuggestions, setAiSuggestions] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState({
    expertise: [],
    availability: "all",
    location: "all"
  });
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [aiNews, setAiNews] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showAddPersonalModal, setShowAddPersonalModal] = React.useState(false);
  const [showAiAgentModal, setShowAiAgentModal] = React.useState(false);
  const [selectedExpert, setSelectedExpert] = React.useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = React.useState(false);
  const [showQuickFilterDropdown, setShowQuickFilterDropdown] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState(null);
  const [newExpert, setNewExpert] = React.useState({
    title: '',
    firstName: '',
    lastName: '',
    institution: '',
    department: '',
    specialization: '',
    research: '',
    publications: '',
    hIndex: '',
    email: '',
    phone: '',
    availability: 'available',
    image: null,
    tags: [],
    sourcesFound: {
      linkedin: '',
      googleScholar: '',
      researchGate: '',
      orcid: '',
      universityProfile: ''
    },
    academicMetrics: {
      publications: {
        count: '',
        sources: {
          googleScholar: '',
          scopus: '',
          webOfScience: ''
        }
      },
      hIndex: {
        value: '',
        sources: {
          googleScholar: '',
          scopus: ''
        }
      },
      citations: {
        total: '',
        lastFiveYears: ''
      }
    },
    expertise: {
      primary: [],
      secondary: []
    },
    companyConnections: {
      current: [],
      previous: [],
      collaborations: []
    },
    industryTags: [],
    projectTags: [],
    collaborationTags: []
  });
  const [imagePreview, setImagePreview] = React.useState(null);
  const modules = [
    { name: "dashboard", displayName: "Dashboard", icon: "fa-brain" },
    { name: "personal", displayName: "Personal", icon: "fa-users" },
    { name: "kompetenzen", displayName: "Kompetenzen", icon: "fa-graduation-cap" },
    { name: "ai-firmen", displayName: "AI Firmen", icon: "fa-building" },
    { name: "entwicklung", displayName: "Entwicklung", icon: "fa-user-cog" },
    { name: "projekte", displayName: "Projekte", icon: "fa-tasks" },
    { name: "training", displayName: "Training", icon: "fa-chalkboard-teacher" },
    { name: "bewertungen", displayName: "Bewertungen", icon: "fa-star" },
    { name: "dokumente", displayName: "Dokumente", icon: "fa-file-alt" },
    { name: "berichte", displayName: "Berichte", icon: "fa-chart-bar" },
    { name: "api", displayName: "API", icon: "fa-code" },
    { name: "integrationen", displayName: "Integrationen", icon: "fa-plug" },
    { name: "einstellungen", displayName: "Einstellungen", icon: "fa-cog" },
    { name: "benachrichtigungen", displayName: "Benachrichtigungen", icon: "fa-bell" },
  ];

  // Add new state for experts data
  const [expertsData, setExpertsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadedExperts, setLoadedExperts] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isEnriching, setIsEnriching] = React.useState(false);
  
  // Add state for news
  const [newsItems, setNewsItems] = React.useState([]);
  const [isLoadingNews, setIsLoadingNews] = React.useState(false);

  // Add state for photo loading
  const [isLoadingPhoto, setIsLoadingPhoto] = React.useState(false);

  // Initial load
  React.useEffect(() => {
    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const { initialChunk, total } = await loadExpertsInChunks(20);
        setLoadedExperts(initialChunk);
        setHasMore(initialChunk.length < total);
        setSearchResults(initialChunk); // Initialize search results
      } catch (error) {
        console.error('Error loading experts:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Load more function
  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    try {
      const moreExperts = await loadMoreExperts(loadedExperts.length);
      if (moreExperts.length === 0) {
        setHasMore(false);
        return;
      }
      setLoadedExperts(prev => [...prev, ...moreExperts]);
    } catch (error) {
      console.error('Error loading more experts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 60000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const initializeCompaniesTable = async () => {
      try {
        await fetch("/api/db/aiexpert-firmen", {
          method: "POST",
          body: JSON.stringify({
            query:
              "INSERT INTO `ai_companies` (name, location, focus, employees, founded_year, projects, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            values: [
              "DeepMind Deutschland GmbH",
              "Berlin",
              "Künstliche Intelligenz & Deep Learning",
              250,
              2018,
              "AlphaFold, Robotik-Steuerung",
              "/company1.jpg",
            ],
          }),
        });
      } catch (error) {
        console.error("Fehler beim Initialisieren der Firmendatenbank:", error);
      }
    };

    initializeCompaniesTable();
  }, []);

  const fetchRealTimeData = () => {
    simulateAPICall().then((data) => {
      updateModuleData(data);
      checkForNotifications(data);
    });
  };
  const simulateAPICall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          inventory: { lowStock: ["Item A", "Item B"] },
          financials: { cashFlow: 15000, revenueChange: 5 },
          crm: { newLeads: 3 },
        });
      }, 1000);
    });
  };
  const updateModuleData = async (data) => {
    try {
      const response = await fetch("/api/db/aiexpert-firmen", {
        method: "POST",
        body: JSON.stringify({
          query: "SELECT * FROM `ai_companies` ORDER BY name ASC",
        }),
      });
      const companies = await response.json();
      setCompanies(companies);
    } catch (error) {
      console.error("Fehler beim Laden der Firmendaten:", error);
    }
  };
  const checkForNotifications = (data) => {
    let newNotifications = [];
    if (data.inventory && data.inventory.lowStock.length > 0) {
      newNotifications.push(
        `Low stock alert for ${data.inventory.lowStock.join(", ")}`
      );
    }
    if (data.financials && data.financials.cashFlow < 10000) {
      newNotifications.push("Cash flow below threshold");
    }
    if (data.crm && data.crm.newLeads > 0) {
      newNotifications.push(`${data.crm.newLeads} new leads received`);
    }
    setNotifications((prev) => [...prev, ...newNotifications]);
  };
  const handleAddItem = () => {
    getAiSuggestions("inventory");
  };
  const handleAddCustomer = () => {
    getAiSuggestions("crm");
  };
  const handleNameChange = (e) => setCustomerName(e.target.value);
  const handleEmailChange = (e) => setCustomerEmail(e.target.value);
  const handleProjectNameChange = (e) => setProjectName(e.target.value);
  const handleDeadlineChange = (e) => setDeadline(e.target.value);
  const handleAddProject = () => {
    getAiSuggestions("projects");
  };
  const handleAddSupplier = () => {
    getAiSuggestions("supply chain");
  };
  const handleUpdateAccount = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
    getAiSuggestions("general ledger");
  };
  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    getAiSuggestions("general ledger");
  };
  const handleAddGateway = (newGateway) => {
    setGateways([...gateways, newGateway]);
    getAiSuggestions("payment gateways");
  };
  const handleLogin = () => {
    setUser({ name: "John Doe", role: "Admin" });
  };
  const handleLogout = () => {
    setUser(null);
  };
  const getAiSuggestions = (module) => {
    const suggestions = [
      "Optimieren Sie Ihre Bestandsebenen basierend auf Verkaufstrends.",
      "Implementieren Sie ein Treueprogramm für Stammkunden.",
      "Nutzen Sie prädiktive Analytik für Projektzeitleisten.",
      "Automatisieren Sie Mitarbeiter-Onboarding-Prozesse.",
      "Implementieren Sie Just-in-Time Bestandsmanagement.",
      "Analysieren Sie Cashflow-Muster für bessere Finanzplanung.",
      "Richten Sie automatische Zahlungserinnerungen ein.",
      "Optimieren Sie Steuerabzüge basierend auf Geschäftsausgaben.",
      "Integrieren Sie mehrere Zahlungsgateways für Kundenkomfort.",
      "Nutzen Sie KI zur Vorhersage potenzieller Zahlungsverzögerungen.",
    ];
    setAiSuggestions(suggestions.slice(0, 3));
  };
  const handleAddEmployee = async () => {
    if (employeeName && designation) {
      try {
        await fetch("/api/db/aiexpert-firmen", {
          method: "POST",
          body: JSON.stringify({
            query:
              "INSERT INTO `employees` (name, designation, created_at) VALUES (?, ?, NOW())",
            values: [employeeName, designation],
          }),
        });

        setEmployeeName("");
        setDesignation("");
        getAiSuggestions("hr");
      } catch (error) {
        console.error("Fehler beim Hinzufügen des Mitarbeiters:", error);
      }
    }
  };
  const handleSearchExperts = () => {
    console.log("Suche nach Experten");
    getAiSuggestions("experts");
  };
  const handleSearchByExpertise = () => {
    console.log("Suche nach Expertise");
    getAiSuggestions("expertise");
  };
  const handleSearchByExperience = () => {
    console.log("Suche nach Erfahrung");
    getAiSuggestions("experience");
  };
  const handleSearchByLocation = () => {
    console.log("Suche nach Standort");
    getAiSuggestions("location");
  };
  const handleViewProfile = (expert) => {
    setSelectedProfile(expert);
    setShowProfileModal(true);
    fetchExpertNews(expert);
    findProfilePhoto(expert);
  };
  const handleContactCompany = (company) => {
    console.log("Kontaktiere Firma:", company);
    getAiSuggestions("company");
  };
  const handleMoreInfo = (company) => {
    console.log("Mehr Informationen zu:", company);
    getAiSuggestions("company_info");
  };
  const handleGenerateApiKey = () => {
    console.log("Generiere neuen API-Schlüssel");
    getAiSuggestions("api");
  };
  const handleTestApi = () => {
    console.log("Teste API-Anfrage");
    getAiSuggestions("api_test");
  };
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      // Get all expert files and parse them
      const expertFiles = await fetch('/api/experts').then(res => res.json());
      
      const results = expertFiles.filter(expert => {
        const searchLower = searchQuery.toLowerCase();
        
        // Search through various expert fields
        const matchesName = expert.personalInfo.fullName.toLowerCase().includes(searchLower);
        const matchesExpertise = expert.expertise.primary.some(exp => 
          exp.toLowerCase().includes(searchLower)
        );
        const matchesInstitution = expert.institution.name.toLowerCase().includes(searchLower);
        const matchesPosition = expert.currentRole.title.toLowerCase().includes(searchLower);

        // Check against active filters
        const matchesExpertiseFilter = activeFilters.expertise.length === 0 || 
          expert.expertise.primary.some(exp => activeFilters.expertise.includes(exp));

        const matchesLocationFilter = activeFilters.location === "all" || 
          expert.institution.name.includes(activeFilters.location);

        return (matchesName || matchesExpertise || matchesInstitution || matchesPosition) 
          && matchesExpertiseFilter 
          && matchesLocationFilter;
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching experts:', error);
      // You may want to show an error notification here
    } finally {
      setIsSearching(false);
    }
  };
  const handleFilter = () => {
    setShowFilterModal(true);
  };
  const applyFilters = (newFilters) => {
    setActiveFilters(newFilters);
    setShowFilterModal(false);
    handleSearch();
  };

  const fetchAiNews = () => {
    const newsData = [
      {
        title: "Ray2 von Luma Labs: Die Zukunft der Text-zu-Video-KI",
        date: "16. Jan 2025",
        author: "Silas",
        category: "Top News 2024"
      },
      {
        title: "Vatikan startet in die KI-Zukunft mit Ethik-Regeln",
        date: "16. Jan 2025",
        author: "Caramba",
        category: "Top Beitraege 2024"
      },
      {
        title: "Microsoft integriert KI-Rendering in DirectX",
        date: "16. Jan 2025",
        author: "Caramba",
        category: "Top News 2024"
      },
      {
        title: "Meta will Programmierer durch KI ersetzen",
        date: "16. Jan 2025",
        author: "Branda",
        category: "News 2024"
      },
      {
        title: 'ChatGPT Plus mit "Tasks": So plant die KI deinen Alltag',
        date: "15. Jan 2025",
        author: "Caramba",
        category: "Top News 2024"
      }
    ];
    setAiNews(newsData);
  };

  React.useEffect(() => {
    fetchAiNews();
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-panel')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleQuickFilter = (filterType) => {
    switch(filterType) {
      case 'available':
        setActiveFilters({...activeFilters, availability: 'immediate'});
        break;
      case 'new':
        // Filter for experts added in the last 30 days
        break;
      case 'active':
        // Filter for experts currently assigned to projects
        break;
    }
    handleSearch();
  };

  const handleAddExpert = (expertData) => {
    // Add new expert to the database/state
    setExperts([...experts, expertData]);
    setShowAddPersonalModal(false);
  };

  const handleEditExpert = (expertData) => {
    // Update expert in the database/state
    const updatedExperts = experts.map(expert => 
      expert.id === expertData.id ? expertData : expert
    );
    setExperts(updatedExperts);
    setShowEditModal(false);
  };

  const handleAddNewExpert = () => {
    // Validation
    if (!newExpert.firstName || !newExpert.lastName || !newExpert.institution || !newExpert.specialization) {
      alert("Bitte füllen Sie alle Pflichtfelder aus (Vorname, Nachname, Institution, Spezialgebiet)");
      return;
    }

    try {
      const fullName = `${newExpert.title} ${newExpert.firstName} ${newExpert.lastName}`.trim();
      const expertData = {
        name: fullName,
        institution: newExpert.institution,
        specialization: newExpert.specialization,
        publications: parseInt(newExpert.publications) || 0,
        hIndex: parseInt(newExpert.hIndex) || 0,
        research: newExpert.research || '',
        image: newExpert.image || '/default-expert.jpg',
        availability: newExpert.availability,
        department: newExpert.department || '',
        email: newExpert.email || '',
        phone: newExpert.phone || '',
        companyConnections: newExpert.companyConnections,
        industryTags: newExpert.industryTags,
        projectTags: newExpert.projectTags,
        collaborationTags: newExpert.collaborationTags
      };

      // Add to experts array
      const updatedExperts = [...experts, expertData];
      setExperts(updatedExperts);

      // Reset form
      setNewExpert({
        title: '',
        firstName: '',
        lastName: '',
        institution: '',
        department: '',
        specialization: '',
        research: '',
        publications: '',
        hIndex: '',
        email: '',
        phone: '',
        availability: 'available',
        image: null,
        companyConnections: {
          current: [],
          previous: [],
          collaborations: []
        },
        industryTags: [],
        projectTags: [],
        collaborationTags: []
      });

      // Close modal
      setShowAddPersonalModal(false);

      // Show success message
      alert("Experte wurde erfolgreich hinzugefügt!");

    } catch (error) {
      console.error("Fehler beim Hinzufügen des Experten:", error);
      alert("Fehler beim Hinzufügen des Experten. Bitte versuchen Sie es erneut.");
    }
  };

  // Update the getProfileImage function to simply return the image path
  const getProfileImage = (expert) => {
    // Just return the image path or default avatar
    return expert?.personalInfo?.image || '/default-avatar.png';
  };

  // Update the enrichExpertProfile function to use the state
  const enrichExpertProfile = async (expert) => {
    if (!expert.profiles?.linkedin || isEnriching) {
      console.log('Skipping enrichment:', !expert.profiles?.linkedin ? 'No LinkedIn URL' : 'Already enriching');
      return;
    }
    
    setIsEnriching(true);
    try {
      const response = await fetch('/api/enrich-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedInUrl: expert.profiles.linkedin
        })
      });
      
      if (response.ok) {
        const enrichedData = await response.json();
        console.log('Enriched data received:', enrichedData);
        
        setSelectedProfile(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            title: enrichedData.title || prev.personalInfo.title,
            image: enrichedData.profilePicture || prev.personalInfo.image,
            location: enrichedData.location,
            languages: enrichedData.languages || prev.personalInfo.languages
          },
          currentRole: {
            ...prev.currentRole,
            title: enrichedData.currentRole?.title || prev.currentRole.title,
            organization: enrichedData.currentRole?.company || prev.currentRole.organization,
            description: enrichedData.currentRole?.description
          },
          experience: enrichedData.experience || [],
          education: enrichedData.education || [],
          skills: enrichedData.skills || [],
          connections: enrichedData.connections,
          lastUpdated: new Date().toISOString()
        }));
      } else {
        console.error('Error response:', await response.text());
      }
    } catch (error) {
      console.error('Error enriching profile:', error);
    } finally {
      setIsEnriching(false);
    }
  };

  // Optimize search with debounce
  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 300),
    []
  );

  // Virtualize expert list
  const parentRef = React.useRef();
  const rowVirtualizer = useVirtualizer({
    count: searchResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5
  });

  // Optimize expert card rendering
  const renderExpertCard = useCallback((expert) => (
    <ExpertCard 
      expert={expert}
      onViewProfile={handleViewProfile}
    />
  ), [handleViewProfile]);

  // Update the expert list rendering
  const renderExpertList = () => (
    <div 
      ref={parentRef}
      className="h-[600px] overflow-auto"
      onScroll={(e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
          loadMore();
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadedExperts.map((expert, index) => (
          <ExpertCard 
            key={expert.id || index}
            expert={expert}
            onViewProfile={handleViewProfile}
          />
        ))}
        {isLoading && (
          <div className="col-span-full text-center py-4">
            <LoadingCard />
          </div>
        )}
      </div>
    </div>
  );

  // First, add a function to handle navigation to AI Firmen section
  const navigateToAIFirmen = () => {
    setActiveModule("ai-firmen");
    setShowProfileModal(false);
  };

  // First, let's add a helper function to process tags
  const processKeywords = (tags) => {
    if (!tags) return [];
    // Take only first 5 tags and ensure they're single keywords
    return tags
      .map(tag => tag.split(/\s+/)[0]) // Take only the first word of each tag
      .slice(0, 5); // Limit to 5 tags
  };

  // Add this helper function to process and display fields
  const renderExpertFields = (expert) => {
    const fieldGroups = [
      {
        title: "Persönliche Informationen",
        fields: {
          "Name": expert?.personalInfo?.fullName,
          "Titel": expert?.personalInfo?.title,
          "Email": expert?.personalInfo?.email,
          "Telefon": expert?.personalInfo?.phone,
          "Sprachen": expert?.personalInfo?.languages?.join(", ")
        }
      },
      {
        title: "Institution & Position",
        fields: {
          "Institution": expert?.institution?.name,
          "Position": expert?.institution?.position,
          "Abteilung": expert?.institution?.department
        }
      },
      {
        title: "Expertise",
        fields: {
          "Primäre Expertise": expert?.expertise?.primary?.join(", "),
          "Sekundäre Expertise": expert?.expertise?.secondary?.join(", "),
          "Industrien": expert?.expertise?.industries?.join(", ")
        }
      },
      {
        title: "Aktuelle Rolle",
        fields: {
          "Titel": expert?.currentRole?.title,
          "Organisation": expert?.currentRole?.organization,
          "Fokus": expert?.currentRole?.focus
        }
      }
    ];

    return fieldGroups.map((group, groupIndex) => (
      <div key={groupIndex} className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-gray-800">{group.title}</h3>
        <div className="space-y-3">
          {Object.entries(group.fields).map(([label, value], fieldIndex) => (
            value && (
              <div key={fieldIndex} className="border-b border-gray-200 pb-2">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <p className="text-base text-gray-800">{value}</p>
              </div>
            )
          ))}
        </div>
      </div>
    ));
  };

  // Add function to fetch news
  const fetchExpertNews = async (expert) => {
    setIsLoadingNews(true);
    try {
      const response = await fetch('/api/news-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: expert.personalInfo.fullName,
          company: expert.currentRole?.organization || expert.institution?.name,
          linkedinUrl: expert.profiles?.linkedin
        })
      });
      
      if (response.ok) {
        const news = await response.json();
        setNewsItems(news);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Add function to find profile photo
  const findProfilePhoto = async (expert) => {
    if (expert?.personalInfo?.image && expert.personalInfo.image !== '/default-avatar.png') {
      return; // Already has a custom image
    }
    
    setIsLoadingPhoto(true);
    try {
      const response = await fetch('/api/profile-photo-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: expert.personalInfo.fullName,
          company: expert.currentRole?.organization || expert.institution?.name,
          email: expert.personalInfo.email // Add this line
        })
      });
      
      if (response.ok) {
        const { imageUrl } = await response.json();
        if (imageUrl && imageUrl !== '/default-avatar.png') {
          setSelectedProfile(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              image: imageUrl
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error finding profile photo:', error);
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  return (
    <div className="font-cabin min-h-screen flex flex-col">
      {isInitialLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <LoadingState />
        </div>
      ) : (
        <>
          <nav className="bg-white shadow-md p-4 border-b border-black">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-black">Dishbrain AI Expert</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    className="text-black hover:text-gray-600 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="fas fa-bell"></i>
                    {aiNews.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {aiNews.length}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white border border-black rounded-lg shadow-lg z-50 notifications-panel">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-3">KI News</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {aiNews.map((news, index) => (
                            <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                              <h4 className="font-medium text-sm">{news.title}</h4>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{news.date}</span>
                                <span>{news.category}</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Von: {news.author}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-center">
                          <Component3DButtonDesign 
                            onClick={() => window.open('https://www.all-ai.de', '_blank')}
                            className="text-sm"
                          >
                            Alle News anzeigen
                          </Component3DButtonDesign>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-black">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-black hover:text-gray-600"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="text-black hover:text-gray-600"
                  >
                    <i className="fas fa-user-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </nav>
          <div className="flex-grow flex">
            <aside className="bg-[#A0C0DE] w-64 p-6 border-r border-black hidden md:block">
              <nav>
                <ul className="space-y-2">
                  {modules.map((module) => (
                    <li key={module.name}>
                      <button
                        onClick={() => setActiveModule(module.name)}
                        className={`w-full text-left p-2 rounded transition-colors ${
                          activeModule === module.name
                            ? "bg-white text-black"
                            : "text-black hover:bg-white hover:bg-opacity-50"
                        } border border-black`}
                      >
                        <i className={`fas ${module.icon} mr-2`}></i>
                        {module.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            <main className="flex-grow bg-[#F5F5F5] p-6 overflow-y-auto">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<LoadingCard />}>
                  {activeModule === "dashboard" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">KI-Experten Statistiken</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Expertise-Level:</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">98%</span>
                                <span className="text-green-500 text-sm">↑ 5%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Projektabschlüsse:</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">85%</span>
                                <span className="text-green-500 text-sm">↑ 3%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Team-Effizienz:</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">92%</span>
                                <span className="text-green-500 text-sm">↑ 7%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Kundenzufriedenheit:</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">95%</span>
                                <span className="text-green-500 text-sm">↑ 4%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>KI-Modell Performance:</span>
                              <div className="flex items-center">
                                <span className="font-bold mr-2">96%</span>
                                <span className="text-green-500 text-sm">↑ 2%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">Aktuelle Projekte</h3>
                          <div className="space-y-4">
                            <div className="border-b pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">KI-gestützte Personalauswahl</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Aktiv</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Fortschritt: 75%</span>
                                <span>Deadline: 15.05.2024</span>
                              </div>
                            </div>
                            <div className="border-b pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Kompetenzanalyse-System</span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">In Planung</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Fortschritt: 30%</span>
                                <span>Deadline: 01.06.2024</span>
                              </div>
                            </div>
                            <div className="border-b pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Talent-Mapping</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">In Entwicklung</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Fortschritt: 45%</span>
                                <span>Deadline: 20.06.2024</span>
                              </div>
                            </div>
                            <div className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Weiterbildungsprogramm</span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Neu</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Fortschritt: 15%</span>
                                <span>Deadline: 10.07.2024</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">Team-Status</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Teamauslastung</span>
                                <span className="font-medium">85%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">23 aktive Teammitglieder</p>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Projektfortschritt</span>
                                <span className="font-medium">92%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">4 von 5 Meilensteinen erreicht</p>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Mitarbeiterzufriedenheit</span>
                                <span className="font-medium">88%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "88%" }}></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">Basierend auf letzter Umfrage</p>
                            </div>
                            <div className="mt-4">
                              <h4 className="font-medium mb-2">Team Verfügbarkeit</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <span>Verfügbar (15)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                  <span>In Meeting (5)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                  <span>Beschäftigt (2)</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                  <span>Abwesend (1)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-black">
                        <h3 className="text-xl font-semibold mb-4">KI-Experten Suchmaschine</h3>
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <input
                              type="text"
                              placeholder="Suchen Sie nach KI-Experten..."
                              className="flex-grow p-3 border border-black rounded"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <div className="flex gap-2">
                              <Component3DButtonDesign onClick={handleSearch}>
                                <i className="fas fa-search mr-2"></i>
                                Suchen
                              </Component3DButtonDesign>
                              <Component3DButtonDesign onClick={handleFilter}>
                                <i className="fas fa-filter mr-2"></i>
                                Filter
                              </Component3DButtonDesign>
                            </div>
                          </div>
                          
                          {isSearching ? (
                            <div className="text-center py-4">
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Suche läuft...
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div 
                              ref={parentRef} 
                              className="h-[600px] overflow-auto"
                              role="region"
                              aria-label="Search results"
                            >
                              <div
                                style={{
                                  height: `${rowVirtualizer.getTotalSize()}px`,
                                  width: '100%',
                                  position: 'relative',
                                }}
                              >
                                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                                  <div
                                    key={virtualRow.index}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: `${virtualRow.size}px`,
                                      transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                  >
                                    {renderExpertCard(searchResults[virtualRow.index])}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : searchQuery && (
                            <div className="text-center py-4 text-gray-600">
                              Keine Experten gefunden für "{searchQuery}"
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-black rounded p-4">
                              <h4 className="font-medium mb-2">Top Expertise</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Machine Learning</span>
                                  <span className="text-green-600">45 Experten</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Deep Learning</span>
                                  <span className="text-green-600">38 Experten</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Computer Vision</span>
                                  <span className="text-green-600">32 Experten</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-black rounded p-4">
                              <h4 className="font-medium mb-2">Verfügbare Experten</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Sofort verfügbar</span>
                                  <span className="text-green-600">15</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Diese Woche</span>
                                  <span className="text-yellow-600">28</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Nächster Monat</span>
                                  <span className="text-blue-600">42</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-black rounded p-4">
                              <h4 className="font-medium mb-2">Standorte</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Berlin</span>
                                  <span>32 Experten</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>München</span>
                                  <span>28 Experten</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Hamburg</span>
                                  <span>25 Experten</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeModule === "personal" && (
                    <div 
                      role="region" 
                      aria-label="Personal management"
                      className="space-y-6"
                    >
                      <div className="flex flex-wrap gap-6">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
                          {expertsData
                            .slice((currentPage - 1) * 6, currentPage * 6)
                            .map((expert, index) => (
                              <div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-md border border-black"
                                onClick={() => setSelectedExpert(expert)}
                              >
                                <div className="flex flex-col items-center mb-3">
                                  <h3 className="font-bold text-lg mb-1">
                                    {expert?.personalInfo?.fullName || 'Unknown Expert'}
                                  </h3>
                                  <img
                                    src={expert?.personalInfo?.image || '/default-avatar.png'}
                                    alt={expert?.personalInfo?.fullName || 'Expert'}
                                    className="w-20 h-20 rounded-full mb-2"
                                  />
                                  <p className="text-sm text-gray-600">
                                    {expert?.institution?.name || 'Institution not specified'}
                                  </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                  {expert?.currentRole?.title && (
                                    <p><strong>Position:</strong><br/>{expert.currentRole.title}</p>
                                  )}
                                  {expert?.expertise?.primary && expert.expertise.primary.length > 0 && (
                                    <p><strong>Expertise:</strong><br/>{expert.expertise.primary.join(', ')}</p>
                                  )}
                                  {expert?.academicMetrics?.publications?.total && (
                                    <p><strong>Publikationen:</strong> {expert.academicMetrics.publications.total}</p>
                                  )}
                                </div>
                                <div className="mt-4">
                                  <Component3DButtonDesign 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewProfile(expert);
                                    }}
                                    className="w-full bg-[#F2D4BA] hover:bg-[#E5C4A8] transform hover:scale-105 transition-transform"
                                    style={{
                                      boxShadow: '0 2px 0 #000000',
                                    }}
                                  >
                                    Profil anzeigen
                                  </Component3DButtonDesign>
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="w-64 space-y-4">
                          <div className="bg-white p-4 rounded-lg shadow-md border border-black relative">
                            <div 
                              className="bg-[#F2D4BA] hover:bg-[#E5C4A8] p-3 rounded-lg cursor-pointer transform transition-transform hover:scale-105 shadow-lg border-2 border-black relative"
                              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                              style={{
                                boxShadow: '0 4px 0 #000000',
                                transform: showActionsDropdown ? 'translateY(4px)' : 'translateY(0)',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Aktionen</h3>
                                <i className={`fas fa-chevron-${showActionsDropdown ? 'up' : 'down'}`}></i>
                              </div>
                            </div>
                            
                            {showActionsDropdown && (
                              <div 
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-black z-10 overflow-hidden"
                                style={{
                                  transform: 'translateY(8px)',
                                  animation: 'dropDown 0.3s ease-out'
                                }}
                              >
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors border-b-2 border-black flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    setShowAddPersonalModal(true);
                                    setShowActionsDropdown(false);
                                  }}
                                >
                                  <i className="fas fa-plus-circle"></i>
                                  <span>Experte hinzufügen</span>
                                </button>
                                
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors border-b-2 border-black flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    if (selectedExpert) {
                                      setShowEditModal(true);
                                      setShowActionsDropdown(false);
                                    }
                                  }}
                                  disabled={!selectedExpert}
                                >
                                  <i className="fas fa-edit"></i>
                                  <span>Experte bearbeiten</span>
                                </button>
                                
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    setShowAiAgentModal(true);
                                    setShowActionsDropdown(false);
                                  }}
                                >
                                  <i className="fas fa-robot"></i>
                                  <span>KI-Agent fragen</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-md border border-black relative">
                            <div 
                              className="bg-[#F2D4BA] hover:bg-[#E5C4A8] p-3 rounded-lg cursor-pointer transform transition-transform hover:scale-105 shadow-lg border-2 border-black relative"
                              onClick={() => setShowQuickFilterDropdown(!showQuickFilterDropdown)}
                              style={{
                                boxShadow: '0 4px 0 #000000',
                                transform: showQuickFilterDropdown ? 'translateY(4px)' : 'translateY(0)',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Schnellfilter</h3>
                                <i className={`fas fa-chevron-${showQuickFilterDropdown ? 'up' : 'down'}`}></i>
                              </div>
                            </div>
                            
                            {showQuickFilterDropdown && (
                              <div 
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-black z-10 overflow-hidden"
                                style={{
                                  transform: 'translateY(8px)',
                                  animation: 'dropDown 0.3s ease-out'
                                }}
                              >
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors border-b-2 border-black flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    handleQuickFilter('available');
                                    setShowQuickFilterDropdown(false);
                                  }}
                                >
                                  <i className="fas fa-check-circle text-green-500"></i>
                                  <span>Verfügbar</span>
                                </button>
                                
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors border-b-2 border-black flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    handleQuickFilter('new');
                                    setShowQuickFilterDropdown(false);
                                  }}
                                >
                                  <i className="fas fa-star text-yellow-500"></i>
                                  <span>Neu hinzugefügt</span>
                                </button>
                                
                                <button 
                                  className="w-full p-3 text-left hover:bg-[#F2D4BA] transition-colors flex items-center gap-2 transform hover:translate-x-2 duration-200"
                                  onClick={() => {
                                    handleQuickFilter('active');
                                    setShowQuickFilterDropdown(false);
                                  }}
                                >
                                  <i className="fas fa-circle text-blue-500"></i>
                                  <span>Aktiv im Projekt</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <Component3DButtonDesign
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                        >
                          Vorherige
                        </Component3DButtonDesign>
                        <span>Seite {currentPage} von {Math.ceil(expertsData.length / 6)}</span>
                        <Component3DButtonDesign
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(expertsData.length / 6)))}
                          disabled={currentPage === Math.ceil(expertsData.length / 6)}
                          className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                        >
                          Nächste
                        </Component3DButtonDesign>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md border border-black">
                        <h3 className="font-bold text-lg mb-3">Erweiterte Expertensuche</h3>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            placeholder="Name oder Institution"
                            className="flex-grow p-2 border border-black rounded"
                          />
                          <select className="p-2 border border-black rounded">
                            <option>Alle Fach</option>
                            <option>Machine Learning</option>
                            <option>Deep Learning</option>
                            <option>Computer Vision</option>
                          </select>
                          <select className="p-2 border border-black rounded">
                            <option>Alle Region</option>
                            <option>Berlin</option>
                            <option>München</option>
                            <option>Hamburg</option>
                          </select>
                          <Component3DButtonDesign 
                            onClick={handleSearch}
                            className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                          >
                            Experten finden
                          </Component3DButtonDesign>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeModule === "kompetenzen" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">
                            KI-Kernkompetenzen
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Machine Learning</span>
                                <span>95%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded">
                                <div
                                  className="bg-blue-500 h-2 rounded"
                                  style={{ width: "95%" }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Deep Learning</span>
                                <span>90%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded">
                                <div
                                  className="bg-blue-500 h-2 rounded"
                                  style={{ width: "90%" }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span>Natural Language Processing</span>
                                <span>88%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded">
                                <div
                                  className="bg-blue-500 h-2 rounded"
                                  style={{ width: "88%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">
                            Zertifizierungen
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-center">
                              <i className="fas fa-certificate text-yellow-500 mr-2"></i>
                              <span>ISO 27001 KI-Sicherheit</span>
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-certificate text-yellow-500 mr-2"></i>
                              <span>TÜV KI-Qualitätsstandard</span>
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-certificate text-yellow-500 mr-2"></i>
                              <span>GDPR KI-Compliance</span>
                            </li>
                            <li className="flex items-center">
                              <i className="fas fa-certificate text-yellow-500 mr-2"></i>
                              <span>AI Ethics Certification</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">
                            Spezialisierungen
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <i className="fas fa-brain text-blue-500 mr-2"></i>
                              <span>Neuronale Netze & Deep Learning</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-robot text-blue-500 mr-2"></i>
                              <span>Robotik & Automatisierung</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-microchip text-blue-500 mr-2"></i>
                              <span>Edge Computing & IoT</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fas fa-chart-network text-blue-500 mr-2"></i>
                              <span>Verteilte KI-Systeme</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">
                            Aktuelle Projekte
                          </h3>
                          <div className="space-y-4">
                            {[
                              { name: "KI-gestützte Prozessoptimierung", progress: 75 },
                              { name: "Predictive Maintenance System", progress: 60 },
                              { name: "Autonome Qualitätskontrolle", progress: 90 },
                              {
                                name: "KI-basierte Entscheidungsfindung",
                                progress: 45,
                              },
                            ].map((project, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span>{project.name}</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded">
                                  <div
                                    className="bg-green-500 h-2 rounded"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-black">
                          <h3 className="text-xl font-semibold mb-4">Weiterbildung</h3>
                          <div className="space-y-4">
                            <Component3DButtonDesign onClick={() => handleTraining()}>
                              <i className="fas fa-graduation-cap mr-2"></i>
                              Verfügbare KI-Kurse
                            </Component3DButtonDesign>
                            <Component3DButtonDesign onClick={() => handleCertification()}>
                              <i className="fas fa-certificate mr-2"></i>
                              Neue Zertifizierungen
                            </Component3DButtonDesign>
                            <Component3DButtonDesign onClick={() => handleDevelopment()}>
                              <i className="fas fa-road mr-2"></i>
                              Entwicklungsplan erstellen
                            </Component3DButtonDesign>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Add other module sections here */}
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
          <footer className="bg-black text-white p-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2025 Dishbrain. Alle Rechte vorbehalten.</p>
            </div>
          </footer>
          <style jsx global>{`
            nav.bg-white,
            footer,
            aside {
              background-color: #FFFFFF;
              color: #000000;
            }
            .border {
              border-width: 1px;
              border-color: #000000;
            }
            nav, footer, aside {
              background-color: #FFFFFF;
            }
            :root {
              --card-bg: #FFFFFF;
              --bg-primary: #A0C0DE;
              --bg-secondary: #F5F5F5;
            }
            @keyframes dropDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(8px);
              }
            }
            
            .hover\:scale-105:hover {
              transform: scale(1.05);
            }
            
            .hover\:translate-x-2:hover {
              transform: translateX(0.5rem);
            }
          `}</style>
          {showFilterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md border border-black w-96">
                <h3 className="text-xl font-semibold mb-4">Filter</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Expertise</label>
                    <select 
                      className="w-full p-2 border border-black rounded"
                      value={activeFilters.expertise}
                      onChange={(e) => setActiveFilters({...activeFilters, expertise: e.target.value})}
                    >
                      <option value="">Alle Expertisen</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Deep Learning">Deep Learning</option>
                      <option value="Computer Vision">Computer Vision</option>
                      <option value="NLP">Natural Language Processing</option>
                      <option value="Robotik">Robotik & KI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Verfügbarkeit</label>
                    <select 
                      className="w-full p-2 border border-black rounded"
                      value={activeFilters.availability}
                      onChange={(e) => setActiveFilters({...activeFilters, availability: e.target.value})}
                    >
                      <option value="all">Alle</option>
                      <option value="immediate">Sofort verfügbar</option>
                      <option value="this_week">Diese Woche</option>
                      <option value="next_month">Nächster Monat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2">Standort</label>
                    <select 
                      className="w-full p-2 border border-black rounded"
                      value={activeFilters.location}
                      onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
                    >
                      <option value="all">Alle Standorte</option>
                      <option value="Berlin">Berlin</option>
                      <option value="München">München</option>
                      <option value="Hamburg">Hamburg</option>
                      <option value="Frankfurt">Frankfurt</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Component3DButtonDesign onClick={() => setShowFilterModal(false)}>
                    Abbrechen
                  </Component3DButtonDesign>
                  <Component3DButtonDesign onClick={() => {
                    handleSearch();
                    setShowFilterModal(false);
                  }}>
                    Anwenden
                  </Component3DButtonDesign>
                </div>
              </div>
            </div>
          )}
          {showProfileModal && selectedProfile && (
            <div 
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto relative">
                {/* Close button */}
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
                  aria-label="Close profile"
                >
                  <span className="text-2xl font-bold text-gray-600 hover:text-gray-800">×</span>
                </button>

                {/* Header */}
                <div className="flex items-start mb-8">
                  <div className="flex items-center gap-6">
                    <img
                      src={selectedProfile?.personalInfo?.image || '/default-avatar.png'}
                      alt={selectedProfile?.personalInfo?.fullName || 'Expert'}
                      className={`w-28 h-28 rounded-full object-cover shadow-lg ${
                        isLoadingPhoto ? 'animate-pulse' : ''
                      }`}
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">{selectedProfile?.personalInfo?.fullName || 'Unknown Expert'}</h2>
                      <p className="text-xl text-gray-600">{selectedProfile?.institution?.name || 'Institution not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    {renderExpertFields(selectedProfile)}
                  </div>
                  <div className="space-y-6">
                    {/* Keywords section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-800">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {processKeywords(selectedProfile?.tags).map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-[#F2D4BA] px-4 py-1.5 rounded-full text-sm font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* News section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-800">Aktuelle News</h3>
                      {isLoadingNews ? (
                        <div className="animate-pulse space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded"></div>
                          ))}
                        </div>
                      ) : newsItems.length > 0 ? (
                        <div className="space-y-4">
                          {newsItems.map((news, index) => (
                            <a
                              key={index}
                              href={news.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <h4 className="font-medium text-blue-600 hover:underline mb-1">
                                {news.title}
                              </h4>
                              {news.date && (
                                <p className="text-sm text-gray-500 mb-1">{news.date}</p>
                              )}
                              {news.snippet && (
                                <p className="text-sm text-gray-600 line-clamp-2">{news.snippet}</p>
                              )}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Keine aktuellen News gefunden.</p>
                      )}
                    </div>

                    {/* Source section */}
                    {selectedProfile?.source && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">TAG Source:</span>
                        <a 
                          href={formatUrl(selectedProfile.source)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline inline-flex items-center"
                        >
                          <i className="fas fa-link mr-1"></i> Quelle
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-8 flex justify-end space-x-4">
                  <Component3DButtonDesign 
                    onClick={() => console.log('Kontakt aufnehmen mit:', selectedProfile.name)}
                    className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Kontakt aufnehmen
                  </Component3DButtonDesign>
                  <Component3DButtonDesign 
                    onClick={() => console.log('Termin vereinbaren mit:', selectedProfile.name)}
                    className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                  >
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Termin vereinbaren
                  </Component3DButtonDesign>
                </div>

                {isEnriching && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 px-4 py-2 rounded">
                    Enriching profile data...
                  </div>
                )}
              </div>
            </div>
          )}
          {showAddPersonalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md border border-black w-[800px] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Neuen Experten hinzufügen</h2>
                  <button 
                    onClick={() => setShowAddPersonalModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-3">Persönliche Informationen</h3>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-sm mb-1">Titel</label>
                          <select
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.title}
                            onChange={(e) => setNewExpert({...newExpert, title: e.target.value})}
                          >
                            <option value="">Auswählen</option>
                            <option value="Prof. Dr.">Prof. Dr.</option>
                            <option value="Prof.">Prof.</option>
                            <option value="Dr.">Dr.</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Vorname</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.firstName}
                            onChange={(e) => setNewExpert({...newExpert, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Nachname</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.lastName}
                            onChange={(e) => setNewExpert({...newExpert, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">Institution</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.institution}
                            onChange={(e) => setNewExpert({...newExpert, institution: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Abteilung</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.department}
                            onChange={(e) => setNewExpert({...newExpert, department: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Kontaktdaten</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">Email</label>
                          <input
                            type="email"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.email}
                            onChange={(e) => setNewExpert({...newExpert, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Telefon</label>
                          <input
                            type="tel"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.phone}
                            onChange={(e) => setNewExpert({...newExpert, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold mb-3">Fachliche Expertise</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">Spezialgebiet</label>
                          <input
                            type="text"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.specialization}
                            onChange={(e) => setNewExpert({...newExpert, specialization: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Aktuelle Forschung</label>
                          <textarea
                            className="w-full p-2 border border-black rounded"
                            rows="3"
                            value={newExpert.research}
                            onChange={(e) => setNewExpert({...newExpert, research: e.target.value})}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Akademische Metriken</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm mb-1">Publikationen</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.publications}
                            onChange={(e) => setNewExpert({...newExpert, publications: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">H-Index</label>
                          <input
                            type="number"
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.hIndex}
                            onChange={(e) => setNewExpert({...newExpert, hIndex: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Verfügbarkeit & Bild</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">Verfügbarkeit</label>
                          <select
                            className="w-full p-2 border border-black rounded"
                            value={newExpert.availability}
                            onChange={(e) => setNewExpert({...newExpert, availability: e.target.value})}
                          >
                            <option value="available">Sofort verfügbar</option>
                            <option value="this_week">Diese Woche</option>
                            <option value="next_month">Nächster Monat</option>
                            <option value="unavailable">Nicht verfügbar</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Profilbild</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border border-black rounded"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 5000000) { // 5MB limit
                                  alert("Bild ist zu groß. Maximale Größe ist 5MB.");
                                  return;
                                }
                                
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImagePreview(reader.result);
                                  setNewExpert({...newExpert, image: reader.result});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Component3DButtonDesign 
                    onClick={() => setShowAddPersonalModal(false)}
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    Abbrechen
                  </Component3DButtonDesign>
                  <Component3DButtonDesign 
                    onClick={handleAddNewExpert}
                    className="bg-[#F2D4BA] hover:bg-[#E5C4A8]"
                  >
                    Experten hinzufügen
                  </Component3DButtonDesign>
                </div>
              </div>
            </div>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Vorschau"
                className="w-20 h-20 rounded-full object-cover border-2 border-black"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Add prop types
MainComponent.propTypes = {
  // ... define prop types
};

export default memo(MainComponent);