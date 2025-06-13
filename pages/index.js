import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import CircularProgress from '@mui/material/CircularProgress';
import { ChevronDown, ChevronUp, ShoppingBag, Star, MapPin, ChevronRight, Globe, FileText, Users, ExternalLink, X, BookText, Newspaper, Contact, House, Clock9, Menu, University, BanknoteArrowUp, BanknoteArrowDown, Image as ImageIcon, Music, Book } from 'lucide-react';
import Slider from "react-slick";
import enTranslations from '../components/translations/en.js';
import roTranslations from '../components/translations/ro.js';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
};

const KEYWORD_URLS = [
  { phrase: "Timetable", url: "https://edu.info.uaic.ro/orar/" },
  { phrase: "Webmail", url: "https://webmail.info.uaic.ro/" },
  { phrase: "Educational Resources", url: "https://edu.info.uaic.ro/" },
  { phrase: "News", url: "https://www.info.uaic.ro/noutati/" },
  { phrase: "Contact", url: "https://www.info.uaic.ro/contact/" },
  { phrase: "Admission", url: "https://www.info.uaic.ro/admitere/" },
  { phrase: "Scholarships", url: "https://www.uaic.ro/studenti/burse/" },
  { phrase: "Accommodation", url: "https://www.uaic.ro/studenti/cazare/" },
  { phrase: "Canteens", url: "https://www.uaic.ro/studenti/cantinele-universitatii-alexandru-ioan-cuza/" },
  { phrase: "Fees", url: "https://plati-taxe.uaic.ro/" },
  { phrase: "Facilities", url: "https://www.info.uaic.ro/facilitati/" },
  { phrase: "Bachelor Admission", url: "https://www.info.uaic.ro/admitere-studii-de-licenta/" },
  { phrase: "Master Admission", url: "https://www.info.uaic.ro/admitere-studii-de-master/" },
  { phrase: "Bachelor Study Programs", url: "https://www.info.uaic.ro/programs/informatica-ro-en/" },
  { phrase: "Master Study Programs", url: "https://www.info.uaic.ro/studii-de-master/" },
  { phrase: "Doctoral School", url: "https://scdoc.info.uaic.ro/" },
  { phrase: "Academic Staff", url: "https://www.info.uaic.ro/personal-academic/" },
  { phrase: "Associate Staff", url: "https://www.info.uaic.ro/personal-asociat/" },
  { phrase: "Leadership", url: "https://www.info.uaic.ro/conducere/" },
  { phrase: "Technical and Administrative Staff", url: "https://www.info.uaic.ro/personal-tehnic-administrativ/" },
  { phrase: "Emeritus Professors", url: "https://www.info.uaic.ro/emeriti/" },
  { phrase: "Research at FII", url: "https://www.info.uaic.ro/cercetare/" },
  { phrase: "Student Research Activities", url: "https://www.info.uaic.ro/activitate-cercetare-studenti/" },
  { phrase: "UAIC Student Guide", url: "https://www.uaic.ro/studenti/ghidul-studentului-uaic/" },
  { phrase: "Student Documents and Forms", url: "https://www.info.uaic.ro/documente-formulare-studenti/" },
  { phrase: "Regulations", url: "https://www.info.uaic.ro/regulamente/" },
  { phrase: "3rd Year Internship", url: "https://www.info.uaic.ro/practica-anul-iii/" },
  { phrase: "Graduation", url: "https://absolvire.info.uaic.ro/" },
  { phrase: "Student Career Services and Alumni", url: "https://www.uaic.ro/studenti/cariera/" },
  { phrase: "Student Representation in Governance", url: "https://www.uaic.ro/studenti/reprezentarea-studentilor-structurile-de-conducere-2/" }
];


export default function Home() {
    const [userInput, setUserInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const resourcesRef = useRef(null);

    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const recordInterval = useRef(null);

    const messageListRef = useRef(null);
    const textAreaRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [language, setLanguage] = useState(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return true;
    });
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(storedLanguage);
  }, []);
  
  // Get translations
  const t = language === 'en' ? enTranslations : roTranslations;

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'en' ? 'ro' : 'en';
      localStorage.setItem('language', newLanguage);
      return newLanguage;
    });
  };


  const resources = [
    { id: 1, name: t.resources.schedule, icon: Clock9, url: 'https://edu.info.uaic.ro/orar/' },
    { id: 2, name: t.resources.courses, icon: BookText, url: 'https://edu.info.uaic.ro/' },
    { id: 3, name: t.resources.news, icon: Newspaper, url: 'https://www.info.uaic.ro/noutati/' },
    { id: 4, name: t.resources.contact, icon: Contact, url: 'https://www.info.uaic.ro/contact/' },
    { id: 5, name: t.resources.admission, icon: University, url: 'https://www.info.uaic.ro/admitere/' },
    { id: 6, name: t.resources.scholarship, icon: BanknoteArrowUp, url: 'https://www.uaic.ro/studenti/burse/' },
    { id: 7, name: t.resources.taxes, icon: BanknoteArrowDown, url: 'https://plati-taxe.uaic.ro/' },
    { id: 8, name: t.resources.housing, icon: House, url: 'https://www.uaic.ro/studenti/cazare/' }
  ];

  const CATEGORIES = [
  t.categories.admission,
  t.categories.academicLife,
  t.categories.studentServices,
  t.categories.universityResources
];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const facultyLinks = [
  {
    id: 1,
    title: "Academic staff",
    description: "Contact information for professors and staff including office locations, email addresses, and personal websites. Users may search for specific professors by name or department.",
    url: "https://www.info.uaic.ro/personal-academic",
    logo: "/FiiLogo.png",
    keywords: ["professor", "staff", "email", "office", "contact", "website", "person", "faculty", "mr", "mrs", "prof"]
  },
  {
    id: 2,
    title: "Canteens and cafes",
    description: "Complete information about campus dining options including: canteen locations, opening hours, menus, and prices. Users may refer to these as 'cafeteria', 'dining hall', or 'food court'.",
    url: "https://www.uaic.ro/studenti/cantinele-universitatii-alexandru-ioan-cuza/",
    logo: "/UaicLogo.jpg",
    keywords: ["canteen", "cafeteria", "food", "menu", "price", "hours", "opening", "eat", "cafe"]
  },
  {
    id: 3,
    title: "Master programs info",
    description: "Information about master programs, including websites and study plan link.",
    url: "https://www.info.uaic.ro/en/master-studies/",
    logo: "/FiiLogo.png",
    keywords: ["Software Engineering", "Computational Linguistics", "Computational Optimization", "Artificial Intelligence and Optimization",
                     "Information Security", "Advanced Studies in Computer Science", "MISS", "ISS", "MLC", "LC", "MIAO", "IAO", "MSD", "SD", "MSI", "SI", "MSAI", "SAI"]
  },
  {
    id: 4,
    title: "Scholarships",
    description: "Complete information about scholarship information, including contact persons information, social problems department location, scholarship categories.",
    url: "https://www.uaic.ro/studenti/burse/",
    logo: "/UaicLogo.jpg",
    keywords: ["scholarship", "grant", "financial", "bursary", "support", "tuition", "funding", "merit", "social problems", "social support", "erasmus", "social scholarship"]
  },
  {
    id: 5,
    title: "Student accommodation",
    description: "Complete information about student accommodation.",
    url: "https://www.uaic.ro/studenti/cazare/",
    logo: "/UaicLogo.jpg",
    keywords: ["dorm", "room", "bed", "accommodation", "titu", "codrescu", "targusor", "gaudeamus", "akademos", "buna vestire", "live",
                     "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C10", "C11", "C12", "Titu Maiorescu", "Târguşor-Copou"]
  },
  {
    id: 6,
    title: "Request for study interruption",
    description: "Form request for study interruption.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20intrerupere%20studii.docx",
    logo: "/FiiLogo.png",
    keywords: ["study interruption"]
  },
  {
    id: 7,
    title: "Request for academic transcript issuance",
    description: "Form request for academic transcript issuance.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20eliberare%20situatie%20scolara.docx",
    logo: "/FiiLogo.png",
    keywords: ["academic transcript issuance"]
  },
  {
    id: 8,
    title: "Request to borrow diploma",
    description: "Form request to borrow diploma.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/Cerere%20imprumut%20diploma.docx",
    logo: "/FiiLogo.png",
    keywords: ["borrow diploma"]
  },
  {
    id: 9,
    title: "Request for faculty withdrawal",
    description: "Form request for faculty withdrawal.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/cerere%20retragere_facultate.doc",
    logo: "/FiiLogo.png",
    keywords: ["faculty withdrawal"]
  },
  {
    id: 10,
    title: "Request for withdrawal submitted to the registry",
    description: "Form request for withdrawal submitted to the registry.",
    url: "https://profs.info.uaic.ro/~webdata/regulamente/cerere%20retragere_registratura.doc",
    logo: "/FiiLogo.png",
    keywords: ["withdrawal submitted to the registry"]
  },
  {
    id: 11,
    title: "Medical services",
    description: "Available medical resources",
    url: "https://www.uaic.ro/studenti/servicii-medicale/",
    logo: "/UaicLogo.jpg",
    keywords: ["medical services"]
  },
  {
    id: 12,
    title: "Student regulations",
    description: "Rules of the faculty",
    url: "https://www.info.uaic.ro/regulamente/",
    logo: "/FiiLogo.png",
    keywords: ["student regulations"]
  },
  {
    id: 13,
    title: "Study plans",
    description: "Study plans for the students",
    url: "https://edu.info.uaic.ro/fise-discipline/",
    logo: "/FiiLogo.png",
    keywords: ["study plans"]
  },
  {
    id: 14,
    title: "Schedule bachelor year 1 A",
    description: "Bachelor's program schedule for Year 1, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1A.html",
    logo: "/FiiLogo.png",
    keywords: ["1A", "first year A", "year 1 A"]
  },
  {
    id: 15,
    title: "Schedule bachelor year 1 B",
    description: "Bachelor's program schedule for Year 1, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1B.html",
    logo: "/FiiLogo.png",
    keywords: ["1B", "first year B", "year 1 B"]
  },
  {
    id: 16,
    title: "Schedule bachelor year 1 E",
    description: "Bachelor's program schedule for Year 1, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I1E.html",
    logo: "/FiiLogo.png",
    keywords: ["1E", "first year E", "year 1 E"]
  },
  {
    id: 17,
    title: "Schedule bachelor year 2 A",
    description: "Bachelor's program schedule for Year 2, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2A.html",
    logo: "/FiiLogo.png",
    keywords: ["2A", "second year A", "year 2 A"]
  },
  {
    id: 18,
    title: "Schedule bachelor year 2 B",
    description: "Bachelor's program schedule for Year 2, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2B.html",
    logo: "/FiiLogo.png",
    keywords: ["2B", "second year B", "year 2 B"]
  },
  {
    id: 19, 
    title: "Schedule bachelor year 2 E",
    description: "Bachelor's program schedule for Year 2, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I2E.html",
    logo: "/FiiLogo.png",
    keywords: ["2E", "second year E", "year 2 E"]
  },
  {
    id: 20,
    title: "Schedule bachelor year 3 A",
    description: "Bachelor's program schedule for Year 3, Semigroup A.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3A.html",
    logo: "/FiiLogo.png",
    keywords: ["3A", "third year A", "year 3 A"]
  },
  {
    id: 21,
    title: "Schedule bachelor year 3 B",
    description: "Bachelor's program schedule for Year 3, Semigroup B.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3B.html",
    logo: "/FiiLogo.png",
    keywords: ["3B", "third year B", "year 3 B"]
  },
  {
    id: 22,
    title: "Schedule bachelor year 3 E",
    description: "Bachelor's program schedule for Year 3, Semigroup E.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_I3E.html",
    logo: "/FiiLogo.png",
    keywords: ["3E", "third year E", "year 3 E"]
  },
  {
    id: 23,
    title: "Schedule master IAO year 1",
    description: "Artificial Intelligence and Optimization master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MIAO1.html",
    logo: "/FiiLogo.png",
    keywords: ["MIAO1", "IAO1"]
  },
  {
    id: 24,
    title: "Schedule master IAO year 2",
    description: "Artificial Intelligence and Optimization master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MIAO2.html",
    logo: "/FiiLogo.png",
    keywords: ["MIAO2", "IAO2"]
  },
  {
    id: 25,
    title: "Schedule master LC year 1",
    description: "Computational Linguistics master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MLC1.html",
    logo: "/FiiLogo.png",
    keywords: ["MLC1", "LC1"]
  },
  {
    id: 26,
    title: "Schedule master LC year 2",
    description: "Computational Linguistics master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MLC2.html",
    logo: "/FiiLogo.png",
    keywords: ["MLC2", "LC2"]
  },
  {
    id: 27,
    title: "Schedule master SI year 1",
    description: "Information Security master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSI1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSI1", "SI1"]
  },
  {
    id: 28,
    title: "Schedule master SI year 2",
    description: "Information Security master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSI2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSI2", "SI2"]
  },
  {
    id: 29,
    title: "Schedule master SAI year 1",
    description: "Advanced Studies in Computer Science master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSAI1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSAI1", "SAI1"]
  },
  {
    id: 30,
    title: "Schedule master SAI year 2",
    description: "Advanced Studies in Computer Science master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSAI2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSAI2", "SAI2"]
  },
  {
    id: 31,
    title: "Schedule master SD year 1",
    description: "Distributed Systems master's program schedule for Year 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSD1.html",
    logo: "/FiiLogo.png",
    keywords: ["MSD1", "SD1"]
  },
  {
    id: 32,
    title: "Schedule master SD year 2",
    description: "Distributed Systems master's program schedule for Year 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MSD2.html",
    logo: "/FiiLogo.png",
    keywords: ["MSD2", "SD2"]
  },
  {
    id: 33,
    title: "Schedule master ISS1 year 1",
    description: "Software Engineering master's program schedule for Year 1 Group 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS11.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS11", "ISS11"]
  },
  {
    id: 34,
    title: "Schedule master ISS2 year 1",
    description: "Software Engineering master's program schedule for Year 1 Group 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS12.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS12", "ISS12"]
  },
  {
    id: 35,
    title: "Schedule master ISS1 year 2",
    description: "Software Engineering master's program schedule for Year 2 Group 1.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS21.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS21", "ISS21"]
  },
  {
    id: 36,
    title: "Schedule master ISS2 year 2",
    description: "Software Engineering master's program schedule for Year 2 Group 2.",
    url: "https://edu.info.uaic.ro/orar/participanti/orar_MISS22.html",
    logo: "/FiiLogo.png",
    keywords: ["MISS22", "ISS22"]
  }
];

const imagesLinks = [
  {
    id: 1,
    logo: "/Akademos1.jpg",
    keywords: ["campus", "campus Akademos", "Akademos campus"]
  },
  {
    id: 2,
    logo: "/AlexandruIoanCuzaUniversity1.png",
    keywords: ["Alexandru Ioan Cuza university", "Alexandru Ioan Cuza University", "Universitatea Alexandru Ioan Cuza", "universitatea Alexandru Ioan Cuza", "universitate", "university"]
  },
  {
    id: 3,
    logo: "/AlexandruIoanCuzaUniversity2.png",
    keywords: ["Alexandru Ioan Cuza university", "Alexandru Ioan Cuza University", "Universitatea Alexandru Ioan Cuza", "universitatea Alexandru Ioan Cuza", "universitate", "university"]
  },
  {
    id: 4,
    logo: "/BunaVestire1.jpg",
    keywords: ["campus", "campus Buna Vestire", "Buna Vestire campus"]
  },
  {
    id: 5,
    logo: "/BunaVestire2.jpg",
    keywords: ["campus", "campus Buna Vestire", "Buna Vestire campus"]
  },
  {
    id: 6,
    logo: "/Codrescu1.jpg",
    keywords: ["campus", "campus Codrescu", "Codrescu campus"]
  },
  {
    id: 7,
    logo: "/ErasmusCafeteria1.jpg",
    keywords: ["Erasmus cafeteria", "cafenea Erasmus", "erasmus cafeteria", "cafenea erasmus", "cafeteria", "cafenea"]
  },
  {
    id: 8,
    logo: "/ErasmusCafeteria2.jpg",
    keywords: ["Erasmus cafeteria", "cafenea Erasmus", "erasmus cafeteria", "cafenea erasmus", "cafeteria", "cafenea"]
  },
  {
    id: 9,
    logo: "/FacultyOfComputerScience1.png",
    keywords: ["Faculty of Computer Science", "Faculty of computer science", "faculty of computer science", "faculty", "facultate", "Facultatea de Informatică", "Facultatea de Informatica", "Facultatea de informatică", "facultatea de informatică"]
  },
  {
    id: 10,
    logo: "/Gaudeamus1.jpg",
    keywords: ["campus", "campus Gaudeamus", "Gaudeamus campus"]
  },
  {
    id: 11,
    logo: "/GaudeamusCanteen1.jpg",
    keywords: ["Gaudeamus canteen", "cantina Gaudeamus", "canteen", "cantină"]
  },
  {
    id: 12,
    logo: "/TargusorCopou1.jpg",
    keywords: ["Târgușor Copou", "campus Târgușor Copou", "Târgușor Copou campus", "Targusor Copou", "campus Targusor Copou", "Targusor Copou campus"]
  },
  {
    id: 13,
    logo: "/TituMaiorescuCampus1.jpeg",
    keywords: ["campus", "Titu Maiorescu campus", "campus Titu Maiorescu"]
  },
  {
    id: 14,
    logo: "/TituMaiorescuCampus2.jpeg",
    keywords: ["campus", "Titu Maiorescu campus", "campus Titu Maiorescu"]
  },
  {
    id: 15,
    logo: "/TituMaiorescuCampus3.jpeg",
    keywords: ["campus", "Titu Maiorescu campus", "campus Titu Maiorescu"]
  },
  {
    id: 16,
    logo: "/TituMaiorescuCampus4.jpg",
    keywords: ["campus", "Titu Maiorescu campus", "campus Titu Maiorescu"]
  },
  {
    id: 17,
    logo: "/TituMaiorescuCanteen1.jpeg",
    keywords: ["canteen", "Titu Maiorescu canteen", "cantină", "cantina Titu Maiorescu"]
  },
  {
    id: 18,
    logo: "/TituMaiorescuCanteen2.jpg",
    keywords: ["canteen", "Titu Maiorescu canteen", "cantină", "cantina Titu Maiorescu"]
  },
]

const mapsLinks = [
  {
    id: 1,
    name: "Akademos campus",
    mapsLink: "https://www.google.com/maps/place/Akademos/@47.1691284,27.5747013,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb64ed96f26f:0xfe832f20fd7e01da!8m2!3d47.1691284!4d27.5747013!16s%2Fg%2F1tqcjqp3?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["campus", "campus Akademos", "Akademos campus"]
  },
  {
    id: 2,
    name: "Alexandru Ioan Cuza University",
    mapsLink: "https://www.google.com/maps/place/Universitatea+%E2%80%9EAlexandru+Ioan+Cuza%E2%80%9D/@47.1743589,27.571504,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb61af5ef507:0x95f1e37c73c23e74!8m2!3d47.1743589!4d27.571504!16zL20vMDk0NXEw?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["Alexandru Ioan Cuza university", "Alexandru Ioan Cuza University", "Universitatea Alexandru Ioan Cuza", "universitatea Alexandru Ioan Cuza", "universitate", "university"]
  },
  {
    id: 3,
    name: "Buna Vestire campus",
    mapsLink: "https://www.google.com/maps/place/Camin+%22Buna+Vestire%22,+Universitatea+A.+I.+Cuza/@47.1621475,27.5811882,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb7d74b113db:0x3418cd7ed5a56e32!8m2!3d47.1621475!4d27.5811882!16s%2Fg%2F11j48g0srt?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["campus", "campus Buna Vestire", "Buna Vestire campus"]
  },
  {
    id: 4,
    name: "Codrescu campus",
    mapsLink: "https://www.google.com/maps/place/Campus+Codrescu/@47.1771235,27.5551043,14z/data=!4m10!1m2!2m1!1scodrescu!3m6!1s0x40cafc9fcf1c33ef:0x25167f5b9d7cf226!8m2!3d47.1771235!4d27.5726138!15sCghjb2RyZXNjdZIBFnN0dWRlbnRfaG91c2luZ19jZW50ZXKqAT8QASoMIghjb2RyZXNjdSgWMh8QASIbMz6dCs2cctm3wDzdSVGm66b1cf2Y4XXCYcvgMgwQAiIIY29kcmVzY3XgAQA!16s%2Fg%2F1hm36f0yw?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["campus", "campus Codrescu", "Codrescu campus"]
  },
  {
    id: 5,
    name: "Erasmus cafeteria",
    mapsLink: "https://www.google.com/maps/place/Erasmus+Cafe+(La+Balen%C4%83)/@47.1758303,27.5706437,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb603f1988cb:0x90fceeba026e4e56!8m2!3d47.1758303!4d27.5706437!16s%2Fg%2F1pp2x5sgj?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["Erasmus cafeteria", "cafenea Erasmus", "erasmus cafeteria", "cafenea erasmus", "cafeteria", "cafenea"]
  },
  {
    id: 6,
    name: "Faculty of Computer Science",
    mapsLink: "https://www.google.com/maps/place/Facultatea+de+Informatic%C4%83/@47.1737831,27.5747212,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb6227e846bd:0x193e4b6864504e2c!8m2!3d47.1737831!4d27.5747212!16s%2Fg%2F1pp2wydwb?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["Faculty of Computer Science", "Faculty of computer science", "faculty of computer science", "faculty", "facultate", "Facultatea de Informatică", "Facultatea de Informatica", "Facultatea de informatică", "facultatea de informatică"]
  },
  {
    id: 7,
    name: "Gaudeamus campus",
    mapsLink: "https://www.google.com/maps/place/C%C4%83minul+de+studen%C8%9Bi+Gaudeamus/@47.1777044,27.5725253,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafc9fc05c488f:0x6904d15a27ccde0b!8m2!3d47.1777044!4d27.5725253!16s%2Fg%2F1ptz4p2c2?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["campus", "campus Gaudeamus", "Gaudeamus campus"]
  },
  {
    id: 8,
    name: "Gaudeamus canteen",
    mapsLink: "https://www.google.com/maps/place/C%C4%83minul+de+studen%C8%9Bi+Gaudeamus/@47.1777044,27.5725253,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafc9fc05c488f:0x6904d15a27ccde0b!8m2!3d47.1777044!4d27.5725253!16s%2Fg%2F1ptz4p2c2?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["Gaudeamus canteen", "cantina Gaudeamus", "canteen", "cantină"]
  },
  {
    id: 9,
    name: "Targusor Copou campus",
    mapsLink: "https://www.google.com/maps/place/Campus+T%C3%A2rgu%C8%99or+Copou/@47.188576,27.561715,17z/data=!4m6!3m5!1s0x40cafcafe6378489:0x10fa553f7a947109!8m2!3d47.1886999!4d27.5631312!16s%2Fg%2F1hm3bvbjm?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["Târgușor Copou", "campus Târgușor Copou", "Târgușor Copou campus", "Targusor Copou", "campus Targusor Copou", "Targusor Copou campus"]
  },
  {
    id: 10,
    name: "Titu Maiorescu campus",
    mapsLink: "https://www.google.com/maps/place/Campus+Titu+Maiorescu/@47.1754484,27.5692032,16.84z/data=!4m6!3m5!1s0x40cafb005ba06131:0x7d8b241b413f4f4f!8m2!3d47.1759135!4d27.5710146!16s%2Fg%2F11ltr1x3mg?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["campus", "Titu Maiorescu campus", "campus Titu Maiorescu"]
  },
  {
    id: 11,
    name: "Titu Maiorescu canteen",
    mapsLink: "https://www.google.com/maps/place/Cantina+Titu+Maiorescu/@47.174586,27.5698253,17z/data=!3m1!4b1!4m6!3m5!1s0x40cafb60f7c6a295:0x33b3c2d5d5a08fe!8m2!3d47.174586!4d27.5698253!16s%2Fg%2F1pp2x66k9?entry=ttu&g_ep=EgoyMDI1MDYwOC4wIKXMDSoASAFQAw%3D%3D",
    keywords: ["canteen", "Titu Maiorescu canteen", "cantină", "cantina Titu Maiorescu"]
  }
]

const GoogleMapsButtons = ({ message = "" }) => {
  const findRelevantLinks = (message) => {
    if (!message || typeof message !== 'string') return [];
    
    const messageLower = message.toLowerCase();
    const relevantLinks = [];
    
    mapsLinks.forEach(link => {
      const hasKeyword = link.keywords.some(keyword => 
        messageLower.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        relevantLinks.push(link);
      }
    });
    
    return relevantLinks;
  };

  // Get relevant links based on the message
  const relevantLinks = findRelevantLinks(message);

  // Don't render anything if no relevant links found
  if (relevantLinks.length === 0) {
    return null;
  }

  // Create buttons for relevant links
  const createMapButtons = () => {
    return relevantLinks.map((link) => (
      <a
        key={link.id}
        href={link.mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="google-maps-button"
      >
        <div className="button-content">
          <div className="maps-icon">📍</div>
          <span className="button-text">{link.name}</span>
        </div>
      </a>
    ));
  };

  return (
    <div className="maps-buttons-container">
      {createMapButtons()}
    </div>
  );
};

  const ImageGallery = ({ images, message }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleImageError = (imageId) => {
    setImageLoadErrors(prev => ({ ...prev, [imageId]: true }));
  };

  const handleImageLoad = (imageId) => {
    setImageLoadErrors(prev => ({ ...prev, [imageId]: false }));
  };

  const styles = {
    messageContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    imageGallery: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '20px',
      alignItems: 'flex-start',
      marginLeft: '-0px'
    },
    imageWrapper: {
      position: 'relative',
      width: '180px',
      height: '180px',
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      background: '#f8f9fa',
      flexShrink: 0,
      border: '1px solid #e9ecef'
    },
    imageWrapperHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transition: 'transform 0.3s ease',
      background: '#f8f9fa',
      display: 'block'
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      color: '#6c757d'
    },
    placeholderContent: {
      textAlign: 'center'
    },
    placeholderIcon: {
      display: 'block',
      fontSize: '32px',
      marginBottom: '8px'
    },
    placeholderText: {
      margin: 0,
      fontSize: '12px',
      fontWeight: 500,
      maxWidth: '140px',
      lineHeight: 1.3
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%)',
      color: 'white',
      padding: '16px 12px 12px',
      transform: 'translateY(100%)',
      transition: 'transform 0.3s ease'
    },
    imageOverlayVisible: {
      transform: 'translateY(0)'
    },
    imageTitle: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: 1.3,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
    },
    chatbotMessage: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
      borderLeft: '4px solid #007bff',
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#333',
      marginLeft: '0px'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      position: 'relative',
      maxWidth: '90vw',
      maxHeight: '90vh',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    modalClose: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(0, 0, 0, 0.5)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      zIndex: 1001,
      transition: 'background 0.2s ease'
    },
    modalImage: {
      width: '100%',
      maxHeight: '60vh',
      objectFit: 'contain',
      background: '#f8f9fa'
    },
    modalInfo: {
      padding: '20px'
    },
    modalTitle: {
      margin: '0 0 10px 0',
      fontSize: '24px',
      color: '#333'
    },
    modalDescription: {
      margin: 0,
      color: '#666',
      lineHeight: 1.6
    }
  };

  // Responsive adjustments based on screen size
  const getResponsiveStyles = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    if (screenWidth <= 360) {
      return {
        imageWrapper: { ...styles.imageWrapper, width: '105px', height: '105px' },
        imageTitle: { ...styles.imageTitle, fontSize: '8px' },
        messageContainer: { ...styles.messageContainer, padding: '10px' },
        imageGallery: { ...styles.imageGallery, gap: '8px' },
        chatbotMessage: { ...styles.chatbotMessage, fontSize: '14px', padding: '12px' }
      };
    } else if (screenWidth <= 480) {
      return {
        imageWrapper: { ...styles.imageWrapper, width: '115px', height: '115px' },
        imageTitle: { ...styles.imageTitle, fontSize: '9px' },
        messageContainer: { ...styles.messageContainer, padding: '10px' },
        imageGallery: { ...styles.imageGallery, gap: '8px' },
        chatbotMessage: { ...styles.chatbotMessage, fontSize: '14px', padding: '12px' }
      };
    } else if (screenWidth <= 600) {
      return {
        imageWrapper: { ...styles.imageWrapper, width: '125px', height: '125px' },
        imageTitle: { ...styles.imageTitle, fontSize: '10px' },
        messageContainer: { ...styles.messageContainer, padding: '15px' },
        imageGallery: { ...styles.imageGallery, gap: '10px' }
      };
    } else if (screenWidth <= 620) {
      return {
        imageWrapper: { ...styles.imageWrapper, width: '135px', height: '135px' },
        imageTitle: { ...styles.imageTitle, fontSize: '10px' },
        imageGallery: { ...styles.imageGallery, gap: '10px' }
      };
    } else if (screenWidth <= 768) {
      return {
        imageWrapper: { ...styles.imageWrapper, width: '150px', height: '150px' },
        imageTitle: { ...styles.imageTitle, fontSize: '11px' },
        messageContainer: { ...styles.messageContainer, padding: '15px' },
        chatbotMessage: { ...styles.chatbotMessage, fontSize: '15px', padding: '15px' }
      };
    }
    
    return {};
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const responsiveStyles = getResponsiveStyles();
  const [hoveredImage, setHoveredImage] = useState(null);

  return (
    <div style={{ ...styles.messageContainer, ...responsiveStyles.messageContainer }}>
      {/* Image Gallery - Only show if there are images */}
      {images && images.length > 0 && (
        <div style={{ ...styles.imageGallery, ...responsiveStyles.imageGallery }}>
          {images.map((image, index) => (
            <div
              key={image.id || index}
              style={{
                ...styles.imageWrapper,
                ...responsiveStyles.imageWrapper,
                ...(hoveredImage === image.id ? styles.imageWrapperHover : {})
              }}
              onClick={() => openModal(image)}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              {imageLoadErrors[image.id] ? (
                <div style={styles.imagePlaceholder}>
                  <div style={styles.placeholderContent}>
                    <span style={styles.placeholderIcon}>📷</span>
                    <p style={styles.placeholderText}>{image.title}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={image.logo}
                  alt={image.title}
                  style={{
                    ...styles.galleryImage,
                    ...(hoveredImage === image.id ? { transform: 'scale(1.05)' } : {})
                  }}
                  onError={() => handleImageError(image.id)}
                  onLoad={() => handleImageLoad(image.id)}
                />
              )}
              <div style={{
                ...styles.imageOverlay,
                ...(hoveredImage === image.id ? styles.imageOverlayVisible : {})
              }}>
                <div style={{ ...styles.imageTitle, ...responsiveStyles.imageTitle }}>
                  {image.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.modalClose} 
              onClick={closeModal}
              onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
            >
              <X size={24} />
            </button>
            {imageLoadErrors[selectedImage.id] ? (
              <div style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa',
                color: '#6c757d'
              }}>
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>📷</span>
                <p>Image could not be loaded</p>
              </div>
            ) : (
              <img
                src={selectedImage.logo}
                style={styles.modalImage}
                onError={() => handleImageError(selectedImage.id)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

  const getMatchingImages = (message, facultyLinks) => {
    if (!message || !facultyLinks) return [];
    
    const messageLower = message.toLowerCase();
    const matchingImages = [];
    
    facultyLinks.forEach(link => {
      const hasMatch = link.keywords.some(keyword => 
        messageLower.includes(keyword.toLowerCase())
      );
      if (hasMatch) {
        matchingImages.push(link);
      }
    });
    
    return matchingImages;
  };

  const filteredLinks = (message) => {
    if(message.length) {
      const messageLower = message.toLowerCase();
      const result = facultyLinks.filter(link => {
        return link.keywords && link.keywords.some(keyword =>
          messageLower.includes(keyword.toLowerCase())
        );
      });
      return result;
    }
  };

  const FacultySidebar = ({ isOpen, onClose, links }) => {
    if (!isOpen) return null;
    console.log(links);
    return (
      <>
        <div 
          className={styles.sidebarOverlay}
          onClick={onClose}
        />
        
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Faculty links</h3>
            <button 
              className={styles.closeButton}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.sidebarContent}>
            {links.map((link) => (
              <div key={link.id} className={styles.facultyResource}>
                <div className={styles.facultyResourceHeader}>
                  <img src={link.logo} className={styles.facultyLogo} />
                </div>
                
                <h4 className={styles.facultyResourceTitle}>{link.title}</h4>
                <p className={styles.facultyResourceDescription}>{link.description}</p>
                
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.facultyButton}
                  onClick={onClose}
                >
                  Click here
                </a>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //       if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
  //           setResourcesOpen(false);
  //       }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //   }
  // }, [resourcesRef]);
  useEffect(() => {
  function handleResize() {
    setIsMobile(window.innerWidth < 768); // Typical breakpoint for mobile
  }
  
  // Set initial value
  handleResize();
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  function handleClickOutside(event) {
    if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
      setResourcesOpen(false);
    }
  }

  // Only add listener if mobile and menu is open
  if (isMobile && resourcesOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }
}, [resourcesRef, resourcesOpen, isMobile]);

const handleResourceSelect = (resource) => {
  setResourcesOpen(false);

  if(resource.url) {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  }
};

  // useEffect(() => {
  //   const messageList = messageListRef.current;
  //   messageList.scrollTop = messageList.scrollHeight;
  // }, [messages]);
  useEffect(() => {
  if (messageListRef.current) {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }
}, [messages]);


    useEffect(() => {
        if(textAreaRef.current) textAreaRef.current.focus();
    }, [messages]);

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, [messages]);

    const handleInput = () => {
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
            el.scrollTop = el.scrollHeight;
        }
    };

    useEffect(() => {
        handleInput();

        window.addEventListener("resize", handleInput);
        return () => {
            window.removeEventListener("resize", handleInput);
        };
    }, []);

    const handleError = () => {
        setMessages((prevMessages) => [...prevMessages, {
            "message": t.messages.error,
            "type": "apiMessage"
        }]);
        setLoading(false);
        setUserInput("");
        const el = textAreaRef.current;
        if (el) {
            el.style.height = "auto";
            el.rows = 1;
        }
    }

    const handleSubmit = async (e) => {
        if(e) e.preventDefault();

        if (userInput.trim() === "") {
            return;
        }

        setLoading(true);
        setMessages((prevMessages) => [...prevMessages, { "message": userInput, "type": "userMessage" }]);

        const response = await fetch("http://localhost:5000/api/post_question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userInput}),
        });

        if (!response.ok) {
          handleError();
          return;
        }

        const data = await response.json();

        if (data.error) {
            handleError();
            return;
        }

        setMessages((prevMessages) => [...prevMessages, { "message": data.answer, "type": "apiMessage" }]);
        setUserInput("")
        setLoading(false);

         const links = extractRelevantLinks(data.answer);
         setRelevantLinks(links);
          
         // Auto-open sidebar if there are relevant links
         if (links.length > 0) {
           setSidebarOpen(true);
         }
    };

    const handleQuickQuestionClick = async (question) => {
        // Add the question to messages immediately as a user message
        setMessages((prevMessages) => [...prevMessages, { "message": question, "type": "userMessage" }]);
        
        // Show loading state
        setLoading(true);
        
        // Send the question to the backend
        try {
          const response = await fetch("http://localhost:5000/api/post_question", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: question }),
          });
          
          if (!response.ok) {
            handleError();
            return;
          }
          
          const data = await response.json();
          
          if (data.error) {
            handleError();
            return;
          }
          
          // Add the response to messages
          setMessages((prevMessages) => [...prevMessages, { "message": data.answer, "type": "apiMessage" }]);
          setLoading(false);
        } catch (error) {
          console.error(t.messages.errorQuickQuestion, error);
          handleError();
        }
    };
     
    const processKeywords = (text) => {
        const sortedKeywords = [...KEYWORD_URLS].sort((a, b) => b.phrase.length - a.phrase.length);
          
        let processedText = text;
          
        sortedKeywords.forEach(({ phrase, url }) => {
          const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
          processedText = processedText.replace(
            regex,
            `[${phrase}](${url})`
          );
        });
          
        return processedText;
    };

    const handleEnter = (e) => {
        if (e.key === "Enter" && userInput) {
            if (!e.shiftKey && userInput) {
                handleSubmit(e);
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    // const handleResourceSelect = (resource) => {
    //     setResourcesOpen(false);

    //     if(resource.url) {
    //       window.open(resource.url, '_blank', 'noopener,noreferrer');
    //     }
    // };

    const handleSidebarResourceClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        if (messages.length >= 3) {
          setHistory([[messages[messages.length - 2].message, messages[messages.length - 1].message]]);
        }
    }, [messages]);

    useEffect(() => {
        return () => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
          }
          clearInterval(recordInterval.current);
        };
    }, []);

    const handleRecord = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            clearInterval(recordInterval.current);
            setIsRecording(false);
            setRecordTime(0);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            
            const audioChunks = [];
            
            // Store references to event listeners for cleanup
            const dataAvailableHandler = (event) => audioChunks.push(event.data);
            const stopHandler = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                
                setMessages(prev => [...prev, {
                    "message": audioUrl,
                    "type": "userMessage",
                    "isAudio": true
                }]);
                
                // Clean up
                stream.getTracks().forEach(track => track.stop());
                mediaRecorder.removeEventListener("dataavailable", dataAvailableHandler);
                mediaRecorder.removeEventListener("stop", stopHandler);
            };

            mediaRecorder.addEventListener("dataavailable", dataAvailableHandler);
            mediaRecorder.addEventListener("stop", stopHandler);

            mediaRecorder.start();

            // Start timer
            setIsRecording(true);
            setRecordTime(0);
            recordInterval.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Recording error:", error);
            setIsRecording(false);
            setMessages(prev => [...prev, {
                "message": error.message.includes('permission') ? 
                    t.audioRecorder.audioPermissionError :
                    t.audioRecorder.audioError,
                "type": "apiMessage"
            }]);
        }
    };

    if (language === null) return null;

return (
  <>
    <Head>
      <title>FIIHelp</title>
    </Head>
    <div className={isDarkMode ? styles.dark : styles.light}>
      <div className={styles.topnav}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem 0 0' }}>
          <Image src="/logo.png" alt="App Logo" width={50} height={50} />
        </a>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem 0 0' }}>
          <Image src="/logoFii.png" alt="Fii Logo" width={50} height={50} />
        </a>
        
        {/* Desktop Navigation Items */}
        {!isMobile && (
          <div className={styles.desktopNavItems}>
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <a
                  key={resource.id}
                  onClick={() => handleResourceSelect(resource)}
                  className={styles.desktopNavLink}
                >
                  {IconComponent && <IconComponent size={16} className={styles.resourceIcon} />}
                  <span>{resource.name}</span>
                </a>
              );
            })}
          </div>
        )}
        
        {/* Mobile Menu Button and Dropdown */}
        {isMobile && (
          <div className={styles.resourcesContainer} ref={resourcesRef}>
            <button 
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className={styles.resourcesButton}
            >           
              <Menu />
            </button>
            
            {resourcesOpen && (
              <div className={styles.resourcesDropdown}>
                <ul>
                  {resources.map((resource) => {
                    const IconComponent = resource.icon;
                    return (
                      <li key={resource.id}>
                        <button 
                          onClick={() => handleResourceSelect(resource)}
                          className={styles.resourceItem}
                        >
                          {IconComponent && <IconComponent size={16} className={styles.resourceIcon} />}
                          <span>{resource.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Language and Theme Toggle (should be outside mobile menu) */}
        <div className={styles.navlinks}>
          <button 
            onClick={toggleLanguage}
            className={styles.languageButton}
          >
            {language === 'en' ? 'RO' : 'EN'}
          </button>
          <label className={styles["theme-toggle"]}>
            <input
              type="checkbox"
              checked={!isDarkMode}
              onChange={() => {
                setIsDarkMode((prev) => {
                  const newTheme = !prev;
                  localStorage.setItem("theme", newTheme ? "dark" : "light");
                  return newTheme;
                });
              }}
            />
            <span className={styles.slider}>
              <span className={`${styles.icon} ${styles.sun}`}>🌙</span>
              <span className={`${styles.icon} ${styles.moon}`}>☀️</span>
            </span>
          </label>
        </div>
      </div>
        <main className={styles.main}>
          <div className = {styles.cloud}>
            <div ref={messageListRef} className = {styles.messagelist}>
              {messages.length === 0 ? (
                <div className={styles.welcomeContainer}>
                  <div className={styles.description}>
                    <h1>{t.welcome.title}</h1>
                    <p>{t.welcome.description}</p>
                  </div>
                  <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit} className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    rows={1}
                    onInput={handleInput}
                    type="text"
                    id="userInput"
                    name="userInput"
                    placeholder={loading ? t.messages.waitResponse : t.messages.inputPlaceholder}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.textarea}
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRecord}
                    className={styles.recordButton}
                  >
                    {isRecording ? t.audioRecorder.stop : t.audioRecorder.start}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <CircularProgress color="inherit" size={20}/>
                      </div>
                    ) : (
                      <svg viewBox="0 0 20 20" className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
              {isRecording && (
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingDot}></div>
                  ⏱️ {t.audioRecorder.recording}: {recordTime}s
                </div>
              )}
            </div>
          </div>
                  <div className={styles.categoriesContainer}>
                    {CATEGORIES.map((category) => (
                      <div 
                        key={category.name} 
                        className={styles.categoryBox}
                        onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                      >
                        <h3>{category.name}</h3>
                        {activeCategory === category.name && (
                          <div className={styles.questionsList}>
                            {category.questions.map((question, index) => (
                              <div 
                                key={index} 
                                className={styles.questionItem}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickQuestionClick(question);
                                }}
                              >
                                {question}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                <div className={styles.slideshowParent}>
                  <div className={styles.slideshowContainer}>
                    <div className={styles.sliderWrapper}>
                      <Slider {...settings}>
                        <div className={styles.slide}>
                          <img src="/BCU1.jpg" alt="Central University Library" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.bcu}</p>
                            <a href="http://site-vechi.bcu-iasi.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/BCU3.jpg" alt="Central University Library" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.bcu}</p>
                            <a href="http://site-vechi.bcu-iasi.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica1.png" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.botanicalGarden}</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica2.jpg" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.botanicalGarden}</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/GradinaBotanica4.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.botanicalGarden}</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                         <div className={styles.slide}>
                          <img src="/GradinaBotanica6.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.botanicalGarden}</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/GradinaBotanica9.webp" alt="Botanical Garden Anastasie Fatu" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.botanicalGarden}</p>
                            <a href="https://www.botanica.uaic.ro/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/informatica1.jpg" alt="Studenti" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.fiifaculty}</p>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/informatica2.jpg" alt="Studenti" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.fiifaculty}</p>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/Gaudeamus.webp" alt="Gaudeamus Canteen" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.canteen}</p>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/muzeuluniversitatii.jpg" alt="University Museum" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.museum}</p>
                            <a href="https://www.uaic.ro/muzeul-universitatii-alexandru-ioan-cuza/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                        <div className={styles.slide}>
                          <img src="/salaPasilorPierduti1.jpg" alt="Sala Pasilor Pierduti" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.hall}</p>
                            <a href="https://www.uaic.ro/despre-uaic/prezentare-sala-pasilor-pierduti/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                          <div className={styles.slide}>
                          <img src="/sala_pasilor_pierduti.jpg" alt="Sala Pasilor Pierduti" />
                          <div className={styles.descriptionBox}>
                            <p>{t.slideShowMessages.titles.hall}</p>
                            <a href="https://www.uaic.ro/despre-uaic/prezentare-sala-pasilor-pierduti/" target="_blank" rel="noopener noreferrer">{t.slideShowMessages.exploreMessage}</a>
                          </div>
                        </div>
                      </Slider>
                    </div>
                  </div>
                </div>

                <footer className={styles.footer}>
                  <div className={styles.footerLogos}>
                    <div className={styles.logoContainer}>
                      <img src="/logo_uaic.png" alt="Logo 1" className={styles.footerLogo} />
                      <span className={styles.universityName}>Universitatea "Alexandru Ioan Cuza" din Iași</span>
                    </div>
                    <div className={styles.logoContainer}>
                      <img src="/logo_faculty.png" alt="Logo 2" className={styles.footerLogo} />
                      <span className={styles.facultyName}>Facultatea de Informatică</span>
                    </div>
                  </div>
                  <div className={styles.footerText}>
                    <p>{t.footer.aboutUs}</p>
                    <p>{t.footer.contact}: fiihelpuaicassistant@gmail.com</p>
                  </div>
                </footer>
                </div>
              ) : (
                messages.reduce((acc, message, index) => {
                  if(message.type === "apiMessage" && getMatchingImages(message.message, imagesLinks).length > 0) {
                      acc.push(
                          <ImageGallery
                            images={getMatchingImages(message.message, imagesLinks)}
                          />
                      );
                  }
                  acc.push(
                  <div 
                     key={index}
                     className={message.type === "apiMessage" ? styles.botText : styles.userBubble}
                  >
                    <div className={styles.markdownanswer}>
                      {message.isAudio ? (
                        <audio controls src={message.message} className='styles.audioPlayer' />
                      ) : (
                        <ReactMarkdown 
                          linkTarget="_blank"
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} style={{color: '#0066cc', textDecoration: 'underline'}} />
                            )
                          }}
                        >
                          {processKeywords(message.message)}
                        </ReactMarkdown>
                      )}
                      </div>
                    </div>
                  );
                        if(message.type === "apiMessage" && filteredLinks(message.message).length > 0) {
                        acc.push(
                        <div key={`faculty-${index}`} className={styles.facultyResourceContainer}>
                          <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={styles.facultyResourceButton}
                          >
                            Resources
                          </button>
                        </div>
                      );
                    }
                        if(message.type === "apiMessage") {
                          acc.push(
                              <GoogleMapsButtons message={message.message} />
                          );
                        }
                    return acc;
                 }, []) 
                )
              }
            </div>
          </div>
          
          {messages.length > 0 && (
          <div className={styles.center}>
            <div className={styles.cloudform}>
              <form onSubmit={handleSubmit} className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <textarea
                    disabled={loading}
                    onKeyDown={handleEnter}
                    ref={textAreaRef}
                    rows={1}
                    onInput={handleInput}
                    type="text"
                    id="userInput"
                    name="userInput"
                    placeholder={loading ? t.messages.waitResponse : t.messages.inputPlaceholder}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.textarea}
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRecord}
                    className={styles.recordButton}
                  >
                    {isRecording ? t.audioRecorder.stop : t.audioRecorder.start}
                  </button>

                  <button
                      type="submit"
                      disabled={loading}
                      className={styles.generatebutton}
                  >
                    {loading ? (
                        <div className={styles.loadingwheel}>
                          <CircularProgress color="inherit" size={20}/>
                        </div>
                    ) : (
                        ">"
                    )}
                  </button>
                </div>
              </form>
              {isRecording && (
                <div className={styles.recordingIndicator}>
                  <div className={styles.recordingDot}></div>
                  ⏱️ {t.audioRecorder.recording}: {recordTime}s
                </div>
              )}
            </div>
          </div>  
          )}                     
        </main>
          <FacultySidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            links={messages.length > 0 ? filteredLinks(messages[messages.length - 1].message) : []}
          />
      </div>
    </>
  );
}