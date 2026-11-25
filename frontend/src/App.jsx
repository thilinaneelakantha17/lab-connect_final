import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  MapPin,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Users,
  Building2,
  BarChart3,
  Bell,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  SlidersHorizontal,
  Smartphone,
  Monitor,
  Server,
  ChevronRight,
  Download,
  Wrench,
  FileText,
  QrCode,
  ArrowUpRight,
  Check,
  X,
  Menu,
  Eye,
  RefreshCw,
  Award,
  Layers,
  Activity,
  Lock,
  Sparkles,
  Navigation,
  Phone,
  Info,
  Mail,
  UserRound,
  EyeOff,
  LogIn,
  UserPlus,
  KeyRound,
  LogOut
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { PROVINCES, getDistricts, getZones } from './slGeoData';

// ---------------------------------------------------------------------------
// INITIAL DATA STORE (Simulates Express.js + PostgreSQL / MongoDB State)
// ---------------------------------------------------------------------------

const INITIAL_LABS = [
  {
    id: 'LAB-CMB-01',
    name: 'Advanced Chemistry & Instrumentation Lab',
    hostSchool: 'Royal College, Colombo 07',
    province: 'Western',
    district: 'Colombo',
    zone: 'Colombo',
    subjects: ['Chemistry', 'Physics'],
    capacity: 40,
    benches: 10,
    utilization: 86,
    distanceKm: 5.8,
    manager: 'Mr. K. Jayawardena',
    phone: '011-2691029',
    rating: 4.9,
    image: '/lab-images/chemistry-lab.svg',
    coords: { x: 30, y: 76 },
    availableSlots: ['Mon 08:30-11:30', 'Wed 12:30-15:30', 'Fri 08:30-11:30'],
    equipmentHighlights: [
      'UV-Vis Digital Spectrophotometer',
      '24x Burette & Pipette Titration Stations',
      'Dual Extraction Fume Hoods',
      'Analytical Balances (0.001g)'
    ],
    safetyRules: [
      'Laboratory coats and closed-toe shoes are mandatory for all visiting students.',
      'Concentrated acid handling must take place strictly inside the extraction fume hoods.',
      'Visiting science teacher must brief students on eye-wash and fire extinguisher locations prior to starting.',
      'All glassware breakages or chemical spills must be logged immediately in the Lab Connect Incident Registry.'
    ]
  },
  {
    id: 'LAB-KDY-02',
    name: 'Central Province Life Sciences & Microscopy Hub',
    hostSchool: 'Dharmaraja College, Kandy',
    province: 'Central',
    district: 'Kandy',
    zone: 'Kandy',
    subjects: ['Biology', 'Chemistry'],
    capacity: 36,
    benches: 9,
    utilization: 79,
    distanceKm: 11.4,
    manager: 'Mrs. S. Ratnayake',
    phone: '081-2224491',
    rating: 4.8,
    image: '/lab-images/microscopy-lab.svg',
    coords: { x: 50, y: 62 },
    availableSlots: ['Tue 08:30-11:30', 'Thu 08:30-11:30', 'Fri 12:30-15:30'],
    equipmentHighlights: [
      '20x Binocular Compound Microscopes',
      'Autoclave Sterilizer & Incubator',
      'High-Speed Micro-Centrifuge Units',
      'Human Anatomy & Botanical Models'
    ],
    safetyRules: [
      'Biological staining reagents and slides must be cleaned and returned to slide trays.',
      'Microscope oil-immersion objectives (100x) require lens tissue cleaning after use.',
      'Bio-waste disposal bins must be used for plant/animal tissue samples.'
    ]
  },
  {
    id: 'LAB-GLE-03',
    name: 'Southern Physics, Optics & Electronics Lab',
    hostSchool: 'Richmond College, Galle',
    province: 'Southern',
    district: 'Galle',
    zone: 'Galle',
    subjects: ['Physics', 'Electronics'],
    capacity: 32,
    benches: 8,
    utilization: 74,
    distanceKm: 9.2,
    manager: 'Mr. D. Wickramasinghe',
    phone: '091-2234812',
    rating: 4.9,
    image: '/lab-images/physics-lab.svg',
    coords: { x: 36, y: 92 },
    availableSlots: ['Mon 12:30-15:30', 'Wed 08:30-11:30', 'Thu 12:30-15:30'],
    equipmentHighlights: [
      '10x Dual-Trace Digital Oscilloscopes',
      'Laser Optics & Spectrometer Benches',
      'Logic Gate & Operational Amplifier Trainers',
      '25x True-RMS Digital Multimeters'
    ],
    safetyRules: [
      'Do not energize DC/AC bench power supplies before circuit inspection by the Lab Manager.',
      'Class-2 optical lasers must remain below eye level on optical rails at all times.',
      'Return multimeter leads and breadboard jumper kits to indexed trays before checkout.'
    ]
  },
  {
    id: 'LAB-JAF-04',
    name: 'Northern Zonal STEM & Physical Science Center',
    hostSchool: 'Jaffna Hindu College, Jaffna',
    province: 'Northern',
    district: 'Jaffna',
    zone: 'Jaffna',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    capacity: 38,
    benches: 10,
    utilization: 81,
    distanceKm: 7.5,
    manager: 'Mr. V. Sivakumar',
    phone: '021-2222351',
    rating: 4.7,
    image: '/lab-images/physics-lab.svg',
    coords: { x: 44, y: 14 },
    availableSlots: ['Tue 12:30-15:30', 'Wed 08:30-11:30', 'Fri 08:30-11:30'],
    equipmentHighlights: [
      'Potentiometer & Wheatstone Bridge Sets',
      'Semimicro Qualitative Analysis Kits',
      'Digital pH & Conductivity Meters',
      '15x Student Compound Microscopes'
    ],
    safetyRules: [
      'Students must wear safety goggles during all qualitative salt analysis heating tests.',
      'Ensure gas taps are fully locked after extinguishing Bunsen burners.'
    ]
  },
  {
    id: 'LAB-BAD-05',
    name: 'Uva Regional Integrated Science Facility',
    hostSchool: 'Badulla Central College, Badulla',
    province: 'Uva',
    district: 'Badulla',
    zone: 'Badulla',
    subjects: ['Chemistry', 'Biology', 'Physics'],
    capacity: 34,
    benches: 8,
    utilization: 69,
    distanceKm: 16.0,
    manager: 'Mrs. P. Dissanayake',
    phone: '055-2222419',
    rating: 4.8,
    image: '/lab-images/microscopy-lab.svg',
    coords: { x: 64, y: 68 },
    availableSlots: ['Mon 08:30-11:30', 'Thu 08:30-11:30', 'Fri 08:30-11:30'],
    equipmentHighlights: [
      '16x Light Microscopes & Slide Kits',
      'Standard Titration Glassware Sets',
      'Simple Harmonic Motion & Acoustic Kits',
      'Distilled Water Plant'
    ],
    safetyRules: [
      'Rural school batches must check in at the Main Gate Security Desk 15 minutes prior to slot.',
      'All reusable glassware must be rinsed with distilled water at the end of the session.'
    ]
  },
  {
    id: 'LAB-PAD-01',
    name: 'Padukka School Science Laboratory',
    hostSchool: 'Padukka Siri Piyarathana Vidyalaya',
    province: 'Western',
    district: 'Colombo',
    zone: 'Homagama',
    subjects: ['Chemistry', 'Biology'],
    capacity: 28,
    benches: 7,
    utilization: 61,
    distanceKm: 12,
    manager: 'Mr. P. Kumara',
    phone: '011-2854000',
    rating: 4.5,
    image: '/lab-images/chemistry-lab.svg',
    coords: { x: 30, y: 76 },
    availableSlots: ['Tue 08:30-11:30', 'Thu 12:30-15:30'],
    equipmentHighlights: ['Student Chemistry Glassware', 'Compound Microscopes', 'Digital Balances'],
    safetyRules: ['Follow teacher safety instructions at all times.']
  }
];

const canonicalZone = (zone) => ({
  'Colombo Central': 'Colombo',
  'Kandy Education Zone': 'Kandy',
  'Galle Education Zone': 'Galle',
  'Jaffna Education Zone': 'Jaffna',
  'Badulla Education Zone': 'Badulla'
}[zone] || zone);

const INITIAL_BOOKINGS = [
  {
    id: 'BK-2401',
    labId: 'LAB-CMB-01',
    labName: 'Advanced Chemistry & Instrumentation Lab',
    hostSchool: 'Royal College, Colombo 07',
    visitingSchool: 'Padukka Siri Piyarathana Vidyalaya',
    teacherName: 'Mrs. N. Bandara',
    grade: 'GCE A/L Grade 12',
    subject: 'Chemistry',
    practicalUnit: 'Unit 04: Redox Titration (KMnO4 vs Fe2+ Ammonium Sulfate)',
    date: '2026-11-10',
    slot: '08:30 - 11:30',
    studentsCount: 30,
    attendedCount: null,
    attendanceVerified: false,
    status: 'Pending',
    equipmentRequested: ['24x Burette Stations', 'Analytical Balance', '0.02M KMnO4 Solution'],
    notes: 'Students have completed theoretical stoichiometry calculations; need 15 titration pairs.'
  },
  {
    id: 'BK-2402',
    labId: 'LAB-KDY-02',
    labName: 'Central Province Life Sciences & Microscopy Hub',
    hostSchool: 'Dharmaraja College, Kandy',
    visitingSchool: 'Hasalaka Gamini Maha Vidyalaya',
    teacherName: 'Mr. T. Herath',
    grade: 'GCE A/L Grade 13',
    subject: 'Biology',
    practicalUnit: 'Unit 02: Mitosis in Onion Root Tip & Stomatal Density',
    date: '2026-11-08',
    slot: '08:30 - 11:30',
    studentsCount: 26,
    attendedCount: 26,
    attendanceVerified: false,
    status: 'Approved',
    equipmentRequested: ['18x Binocular Microscopes', 'Acetocarmine Stain', 'Microscope Slides & Coverslips'],
    notes: 'School bus arriving via Mahiyanganaya-Kandy route at 08:15 AM.'
  },
  {
    id: 'BK-2403',
    labId: 'LAB-GLE-03',
    labName: 'Southern Physics, Optics & Electronics Lab',
    hostSchool: 'Richmond College, Galle',
    visitingSchool: 'Neluwa National School',
    teacherName: 'Mrs. N. Bandara',
    grade: 'GCE A/L Grade 13',
    subject: 'Physics',
    practicalUnit: 'Unit 09: Cathode Ray Oscilloscope & Diode Rectifier Waveforms',
    date: '2026-11-03',
    slot: '12:30 - 15:30',
    studentsCount: 24,
    attendedCount: 23,
    attendanceVerified: true,
    status: 'Completed',
    equipmentRequested: ['8x Dual-Trace Oscilloscopes', 'Signal Generators', 'Rectifier Breadboard Kits'],
    notes: 'Completed all waveform traces and peak-to-peak voltage measurements.'
  },
  {
    id: 'BK-2404',
    labId: 'LAB-BAD-05',
    labName: 'Uva Regional Integrated Science Facility',
    hostSchool: 'Badulla Central College, Badulla',
    visitingSchool: 'Monaragala Ethimale Secondary School',
    teacherName: 'Mr. A. Senanayake',
    grade: 'GCE O/L Grade 11',
    subject: 'Chemistry',
    practicalUnit: 'O/L Unit 07: Acids, Bases & Exothermic Neutralization Enthalpy',
    date: '2026-11-12',
    slot: '08:30 - 11:30',
    studentsCount: 32,
    attendedCount: null,
    attendanceVerified: false,
    status: 'Pending',
    equipmentRequested: ['16x Polystyrene Calorimeters', 'Thermometers (0.1°C)', 'NaOH & HCl Solutions'],
    notes: 'First laboratory visit for this O/L batch prior to December mock examination.'
  }
];

const INITIAL_EQUIPMENT = [
  {
    id: 'EQ-101',
    name: 'Binocular Compound Microscope (Olympus CX23)',
    category: 'Optics & Biology',
    labId: 'LAB-KDY-02',
    totalQty: 20,
    availableQty: 19,
    condition: 'Operational',
    lastCalibrated: '2026-09-18'
  },
  {
    id: 'EQ-102',
    name: 'Class-A Borosilicate Burette 50mL with PTFE Stopcock',
    category: 'Volumetric Glassware',
    labId: 'LAB-CMB-01',
    totalQty: 30,
    availableQty: 27,
    condition: 'Operational',
    lastCalibrated: '2026-10-02'
  },
  {
    id: 'EQ-103',
    name: 'Dual-Trace Digital Storage Oscilloscope (50MHz)',
    category: 'Physics & Electronics',
    labId: 'LAB-GLE-03',
    totalQty: 10,
    availableQty: 8,
    condition: 'Low Stock',
    lastCalibrated: '2026-08-25'
  },
  {
    id: 'EQ-104',
    name: 'Digital Analytical Balance (0.001g Precision)',
    category: 'Instrumentation',
    labId: 'LAB-CMB-01',
    totalQty: 4,
    availableQty: 3,
    condition: 'Repair Needed',
    lastCalibrated: '2026-06-11'
  },
  {
    id: 'EQ-105',
    name: 'UV-Vis Single Beam Spectrophotometer',
    category: 'Instrumentation',
    labId: 'LAB-CMB-01',
    totalQty: 2,
    availableQty: 2,
    condition: 'Operational',
    lastCalibrated: '2026-10-19'
  },
  {
    id: 'EQ-106',
    name: 'Optical Spectrometer & Prism Vernier Table',
    category: 'Physics & Electronics',
    labId: 'LAB-GLE-03',
    totalQty: 8,
    availableQty: 8,
    condition: 'Operational',
    lastCalibrated: '2026-09-30'
  }
];

const INITIAL_SYLLABUS = [
  {
    code: 'PHY-AL-01',
    grade: 'GCE A/L',
    subject: 'Physics',
    title: 'Vernier Calipers, Micrometer Screw Gauge & Spherometer Precision',
    requiredHours: 3,
    completedHours: 3,
    status: 'Completed',
    lastLab: 'Richmond College, Galle'
  },
  {
    code: 'PHY-AL-09',
    grade: 'GCE A/L',
    subject: 'Physics',
    title: 'CRO Waveform Analysis & Full-Wave Bridge Rectifier Characteristics',
    requiredHours: 4,
    completedHours: 4,
    status: 'Completed',
    lastLab: 'Richmond College, Galle'
  },
  {
    code: 'CHM-AL-04',
    grade: 'GCE A/L',
    subject: 'Chemistry',
    title: 'Redox Titration: Standardization of KMnO4 using Ferrous Ammonium Sulfate',
    requiredHours: 4,
    completedHours: 2,
    status: 'In Progress',
    lastLab: 'Royal College, Colombo 07'
  },
  {
    code: 'CHM-AL-08',
    grade: 'GCE A/L',
    subject: 'Chemistry',
    title: 'Qualitative Analysis of Cations (d-Block) & Organic Functional Groups',
    requiredHours: 6,
    completedHours: 0,
    status: 'Pending',
    lastLab: 'Not Scheduled'
  },
  {
    code: 'BIO-AL-02',
    grade: 'GCE A/L',
    subject: 'Biology',
    title: 'Microscopic Preparation of Onion Root Tip Mitosis & Stomatal Index',
    requiredHours: 3,
    completedHours: 3,
    status: 'Completed',
    lastLab: 'Dharmaraja College, Kandy'
  },
  {
    code: 'SCI-OL-07',
    grade: 'GCE O/L',
    subject: 'Chemistry',
    title: 'Enthalpy of Neutralization & Indicators in Acid-Base Reactions',
    requiredHours: 3,
    completedHours: 1.5,
    status: 'In Progress',
    lastLab: 'Badulla Central College'
  }
];

const INITIAL_DAMAGE_REPORTS = [
  {
    id: 'DMG-301',
    itemName: '50mL Borosilicate Burette Stopcock Tip',
    labName: 'Advanced Chemistry & Instrumentation Lab',
    reportedBy: 'Mrs. N. Bandara (Padukka Vidyalaya)',
    date: '2026-10-29',
    severity: 'Minor',
    qtyAffected: 2,
    description: 'Chipped burette nozzle while clamping to retort stand on Bench #4.',
    status: 'Resolved'
  },
  {
    id: 'DMG-302',
    itemName: 'Analytical Balance Draft Shield Door (EQ-104)',
    labName: 'Advanced Chemistry & Instrumentation Lab',
    reportedBy: 'Mr. K. Jayawardena (Lab Manager)',
    date: '2026-11-02',
    severity: 'Moderate',
    qtyAffected: 1,
    description: 'Sliding glass track misaligned; requires calibration technician visit.',
    status: 'Open'
  }
];

const INITIAL_SCHOOLS = [
  {
    id: 'SCH-101',
    censusId: 'MOE-WP-0112',
    name: 'Royal College',
    type: '1AB Host School',
    province: 'Western',
    district: 'Colombo',
    zone: 'Colombo Central',
    labsCount: 4,
    status: 'Verified',
    coordinator: 'Mr. K. Jayawardena'
  },
  {
    id: 'SCH-102',
    censusId: 'MOE-WP-0481',
    name: 'Padukka Siri Piyarathana Vidyalaya',
    type: 'Type 1C Visiting School',
    province: 'Western',
    district: 'Colombo',
    zone: 'Homagama',
    labsCount: 1,
    status: 'Verified',
    coordinator: 'Mr. P. Kumara'
  },
  {
    id: 'SCH-103',
    censusId: 'MOE-CP-0234',
    name: 'Dharmaraja College',
    type: '1AB Host School',
    province: 'Central',
    district: 'Kandy',
    zone: 'Kandy',
    labsCount: 3,
    status: 'Verified',
    coordinator: 'Mrs. S. Ratnayake'
  },
  {
    id: 'SCH-104',
    censusId: 'MOE-CP-0891',
    name: 'Hasalaka Gamini Maha Vidyalaya',
    type: 'Type 2 Rural School',
    province: 'Central',
    district: 'Kandy',
    zone: 'Teldeniya',
    labsCount: 0,
    status: 'Verified',
    coordinator: 'Mr. T. Herath'
  },
  {
    id: 'SCH-105',
    censusId: 'MOE-SP-0341',
    name: 'Richmond College',
    type: '1AB Host School',
    province: 'Southern',
    district: 'Galle',
    zone: 'Galle',
    labsCount: 3,
    status: 'Verified',
    coordinator: 'Mr. D. Wickramasinghe'
  }
];

const INITIAL_USERS = [
  ['USR-001', 'Mr. S. Alwis', 's.alwis@moe.gov.lk', 'Teacher', 'Royal College', 'Western', 'Colombo Central'],
  ['USR-002', 'Mrs. N. Bandara', 'n.bandara@moe.gov.lk', 'Teacher', 'Padukka Siri Piyarathana Vidyalaya', 'Western', 'Homagama'],
  ['USR-003', 'Mr. A. B. Dissanayake', 'a.dissanayake@moe.gov.lk', 'Teacher', 'Dharmaraja College', 'Central', 'Kandy'],
  ['USR-004', 'Mr. T. Herath', 't.herath@moe.gov.lk', 'Teacher', 'Hasalaka Gamini Maha Vidyalaya', 'Central', 'Teldeniya'],
  ['USR-005', 'Mrs. M. K. Fernando', 'm.fernando@moe.gov.lk', 'Teacher', 'Richmond College', 'Southern', 'Galle'],
  ['USR-006', 'Mr. K. Jayawardena', 'k.jayawardena@moe.gov.lk', 'Lab Manager', 'Royal College', 'Western', 'Colombo Central'],
  ['USR-007', 'Mr. P. Kumara', 'p.kumara@moe.gov.lk', 'Lab Manager', 'Padukka Siri Piyarathana Vidyalaya', 'Western', 'Homagama'],
  ['USR-008', 'Mrs. S. Ratnayake', 's.ratnayake@moe.gov.lk', 'Lab Manager', 'Dharmaraja College', 'Central', 'Kandy'],
  ['USR-009', 'Mr. D. Wickramasinghe', 'd.wickramasinghe@moe.gov.lk', 'Lab Manager', 'Richmond College', 'Southern', 'Galle'],
  ['USR-010', 'Dr. Ruwan Wijesinghe', 'r.wijesinghe@moe.gov.lk', 'System Admin', 'Royal College', 'Western', 'Colombo Central']
].map(([id, name, email, role, school, province, zone]) => ({
  id, name, email, role, school, province, zone, active: true
}));

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-9041',
    timestamp: '2026-11-05 14:20',
    actor: 'Mr. K. Jayawardena',
    role: 'Host Lab Manager',
    action: 'PATCH /api/bookings/BK-2402/status -> Approved',
    target: 'Hasalaka Gamini MV (26 Students)',
    status: '200 OK'
  },
  {
    id: 'AUD-9040',
    timestamp: '2026-11-05 11:05',
    actor: 'Mrs. N. Bandara',
    role: 'Science Teacher',
    action: 'POST /api/bookings -> Created Request BK-2401',
    target: 'Royal College Advanced Chemistry Lab',
    status: '201 Created'
  },
  {
    id: 'AUD-9039',
    timestamp: '2026-11-04 16:12',
    actor: 'Dr. R. Wijesinghe',
    role: 'System Admin',
    action: 'PATCH /api/schools/SCH-103/verify -> Verified',
    target: 'Hasalaka Gamini Maha Vidyalaya',
    status: '200 OK'
  },
  {
    id: 'AUD-9038',
    timestamp: '2026-11-03 15:45',
    actor: 'Mrs. N. Bandara',
    role: 'Science Teacher',
    action: 'POST /api/sessions -> Logged 4.0 Practical Hours',
    target: 'PHY-AL-09 (CRO & Rectifier Waveforms)',
    status: '201 Created'
  }
];

// All 19 Screens Definition for Unified Navigation & Progress Visibility
const ALL_SCREENS = [
  // Teacher Workspace (6)
  { id: 'teacher-dashboard', code: '01', role: 'teacher', label: 'Teacher Dashboard', icon: Layers },
  { id: 'teacher-map', code: '02', role: 'teacher', label: 'Sri Lanka Lab Map & Finder', icon: MapPin },
  { id: 'teacher-lab-detail', code: '03', role: 'teacher', label: 'Host Lab Facility Profile', icon: FlaskConical },
  { id: 'teacher-booking', code: '04', role: 'teacher', label: 'Request Lab Booking', icon: Calendar },
  { id: 'teacher-session-log', code: '05', role: 'teacher', label: 'Practical & Damage Logger', icon: ClipboardCheck },
  { id: 'teacher-syllabus', code: '06', role: 'teacher', label: 'Syllabus & Hours Tracker', icon: BookOpen },
  // Lab Manager Workspace (6)
  { id: 'manager-dashboard', code: '07', role: 'manager', label: 'Lab Manager Dashboard', icon: Activity },
  { id: 'manager-approvals', code: '08', role: 'manager', label: 'Booking Approval Queue', icon: CheckCircle2 },
  { id: 'manager-calendar', code: '09', role: 'manager', label: 'Lab Schedule & Slots', icon: Calendar },
  { id: 'manager-inventory', code: '10', role: 'manager', label: 'Equipment Inventory', icon: Wrench },
  { id: 'manager-attendance', code: '11', role: 'manager', label: 'Attendance & Visit Logs', icon: Users },
  { id: 'manager-profile', code: '12', role: 'manager', label: 'Lab Profile & Safety Rules', icon: ShieldCheck },
  // System Admin Workspace (6)
  { id: 'admin-dashboard', code: '13', role: 'admin', label: 'National Admin Dashboard', icon: BarChart3 },
  { id: 'admin-schools', code: '14', role: 'admin', label: 'School Verification Queue', icon: Building2 },
  { id: 'admin-users', code: '15', role: 'admin', label: 'User & Role Permissions', icon: Lock },
  { id: 'admin-reference', code: '16', role: 'admin', label: 'NIE Reference & Syllabus', icon: FileText },
  { id: 'admin-audit', code: '17', role: 'admin', label: 'Security & API Audit Trail', icon: Server },
  { id: 'admin-analytics', code: '18', role: 'admin', label: 'Resource Sharing Analytics', icon: ArrowUpRight },
  // Shared Portal & Architecture Hub (1)
  { id: 'portal-overview', code: '19', role: 'shared', label: 'MoE Portal & 19-Screen Hub', icon: Sparkles }
];

function LabConnectLogo({ compact = false, light = false }) {
  return (
    <div className={`flex items-center gap-3 ${light ? 'text-white' : 'text-[#183653]'}`}>
      <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/15`}>
        <FlaskConical className={`${compact ? 'w-5 h-5' : 'w-8 h-8'} text-white`} />
      </div>
      <div>
        <div className={`${compact ? 'text-base' : 'text-2xl'} font-extrabold tracking-tight`}>Lab Connect</div>
        {!compact && <div className="text-[10px] font-medium leading-tight text-slate-500">Sri Lanka School Laboratory<br />Resource Sharing System</div>}
      </div>
    </div>
  );
}

function getHumanReadableMessage(payload, fallback) {
  const candidates = [
    payload?.message,
    payload?.error,
    payload?.data?.message,
    payload?.data?.error,
    payload?.data?.errors?.[0]?.message
  ];
  const message = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
  return message ? message.trim() : fallback;
}

async function requestJson(url, options, fallbackMessage) {
  const response = await fetch(url, options);
  const rawBody = await response.text();
  let payload = {};

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      if (!response.ok) {
        throw new Error(fallbackMessage);
      }
    }
  }

  const failed =
    !response.ok ||
    payload?.success === false ||
    payload?.data?.success === false;

  if (failed) {
    throw new Error(getHumanReadableMessage(payload, fallbackMessage));
  }

  return payload;
}

function AuthView({ view, setView, onAuthenticated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    province: '',
    district: '',
    zone: '',
    schoolName: '',
    secretCode: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const switchView = (nextView) => {
    setMessage('');
    setError('');
    setView(nextView);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (view === 'forgot') {
      if (!form.email.trim()) {
        setError('Enter your registered email address.');
        return;
      }
      setMessage('If an account exists for this email, a reset link has been sent.');
      return;
    }

    if (view === 'signup') {
      if (!form.name.trim() || !form.schoolName.trim() || !form.province || !form.district || !form.zone || !form.email.trim() || !form.role || !form.password) {
        setError('Complete all required fields to create your account.');
        return;
      }
      if (form.password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (form.role === 'admin' && form.secretCode !== '111111') {
        setError('System Admin accounts require the correct secret code.');
        return;
      }
      setIsSubmitting(true);
      try {
        const result = await requestJson('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            schoolName: form.schoolName.trim(),
            email: form.email.trim(),
            role: form.role,
            province: form.province,
            district: form.district,
            zone: form.zone,
            password: form.password,
            secretCode: form.secretCode
          })
        }, 'Unable to create account.');
        const registeredUser = result.data?.user || result.user || result.data;
        const token = result.token || result.accessToken || result.data?.token || result.data?.accessToken;
        if (token) {
          localStorage.setItem('labConnectToken', String(token));
        }
        if (registeredUser && typeof registeredUser === 'object' && !Array.isArray(registeredUser)) {
          localStorage.setItem('labConnectUser', JSON.stringify(registeredUser));
        }
        setMessage('Account created. You can now sign in.');
        setView('login');
      } catch (requestError) {
        setError(
          requestError instanceof Error && requestError.message
            ? requestError.message
            : 'Unable to create account.'
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!form.email.trim() || !form.password || !form.role) {
      setError('Enter your email, password, and select your role.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await requestJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          role: form.role
        })
      }, 'Unable to log in.');
      const user = result.data?.user || result.user || result.data;
      if (!user || typeof user !== 'object' || Array.isArray(user)) {
        throw new Error('Login succeeded, but the server returned no user details.');
      }

      const token = result.token || result.accessToken || result.data?.token || result.data?.accessToken;
      if (token) {
        localStorage.setItem('labConnectToken', String(token));
      }
      localStorage.setItem('labConnectUser', JSON.stringify(user));
      onAuthenticated(user);
    } catch (requestError) {
      setError(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : 'Unable to log in.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignup = view === 'signup';
  const isForgot = view === 'forgot';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-cyan-100 to-slate-100 text-slate-900 flex flex-col font-sans">
      <header className="h-16 px-5 sm:px-10 flex items-center justify-between border-b border-white/60 bg-white/30 backdrop-blur-md">
        <LabConnectLogo compact />
        <span className="hidden sm:block text-xs font-semibold text-slate-500">Ministry of Education • Sri Lanka</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <section className={`w-full ${isSignup ? 'max-w-xl' : 'max-w-md'} bg-white rounded-3xl shadow-2xl shadow-slate-500/20 border border-white p-6 sm:p-8`}>
          <LabConnectLogo />
          <div className="mt-7 mb-5">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              {isForgot ? <KeyRound className="w-5 h-5" /> : isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <h1 className="text-xl font-extrabold text-[#183653]">
              {isForgot ? 'Forgot password?' : isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isForgot ? 'Enter your email and we will send a secure reset link.' : isSignup ? 'Register to access the Lab Connect platform.' : 'Sign in to manage shared laboratory resources.'}
            </p>
          </div>

          {message && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs font-semibold text-emerald-700">{message}</div>}
          {error && <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2.5 text-xs font-semibold text-rose-700">{error}</div>}

          <form onSubmit={submit} className="space-y-3.5">
            {isSignup && (
              <>
                <AuthField label="Full name" icon={UserRound} value={form.name} onChange={update('name')} placeholder="Enter your full name" />
                <GeoSelect label="Province" value={form.province} options={PROVINCES} onChange={(event) => setForm((current) => ({ ...current, province: event.target.value, district: '', zone: '' }))} />
                <GeoSelect label="District" value={form.district} options={getDistricts(form.province).map((item) => item.name)} disabled={!form.province} onChange={(event) => setForm((current) => ({ ...current, district: event.target.value, zone: '' }))} />
                <GeoSelect label="Zonal Education Office" value={form.zone} options={getZones(form.province, form.district).map((item) => item.name)} disabled={!form.district} onChange={update('zone')} />
                <AuthField label="School Name" icon={Building2} value={form.schoolName} onChange={update('schoolName')} placeholder="Enter your school name" />
              </>
            )}
            <AuthField label="Email address" icon={Mail} value={form.email} onChange={update('email')} placeholder="Enter your email address" type="email" />
            {isSignup && (
              <label className="block text-xs font-semibold text-slate-700">
                Role
                <select value={form.role} onChange={update('role')} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select your role</option>
                  <option value="teacher">Guest / Visiting Teacher</option>
                  <option value="manager">Host School Lab Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </label>
            )}
            {!isSignup && !isForgot && (
              <label className="block text-xs font-semibold text-slate-700">
                Role
                <select value={form.role} onChange={update('role')} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select your role</option>
                  <option value="teacher">Guest / Visiting Teacher</option>
                  <option value="manager">Host School Lab Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </label>
            )}
            {isSignup && form.role === 'admin' && (
              <AuthField
                label="System Admin secret code"
                icon={KeyRound}
                value={form.secretCode}
                onChange={update('secretCode')}
                placeholder="Enter the secret code"
                type="password"
                inputMode="numeric"
                maxLength={6}
              />
            )}
            {!isForgot && (
              <AuthField label="Password" icon={Lock} value={form.password} onChange={update('password')} placeholder={isSignup ? 'Create a password' : 'Enter your password'} type={showPassword ? 'text' : 'password'} trailing={
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="text-slate-400 hover:text-blue-600" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              } />
            )}
            {isSignup && <AuthField label="Confirm password" icon={Lock} value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Re-enter your password" type="password" />}
            {!isSignup && !isForgot && <div className="text-right -mt-1"><button type="button" onClick={() => switchView('forgot')} className="text-xs font-semibold text-blue-700 hover:text-blue-900">Forgot password?</button></div>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#183653] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Please wait...' : isForgot ? 'Send reset link' : isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            {isForgot ? (
              <button type="button" onClick={() => switchView('login')} className="font-bold text-blue-700 hover:text-blue-900">← Back to log in</button>
            ) : isSignup ? (
              <>Already have an account? <button type="button" onClick={() => switchView('login')} className="font-bold text-blue-700">Log in</button></>
            ) : (
              <>New to Lab Connect? <button type="button" onClick={() => switchView('signup')} className="font-bold text-blue-700">Create an account</button></>
            )}
          </div>
        </section>
      </main>
      <footer className="px-5 sm:px-10 py-4 flex justify-between text-[11px] text-slate-500 border-t border-white/60">
        <span>© Ministry of Education</span>
        <span>Help & Support</span>
      </footer>
    </div>
  );
}

function AuthField({ label, icon: Icon, trailing, ...props }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label}
      <div className="mt-1.5 flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <Icon className="ml-3 w-4 h-4 text-slate-400" />
        <input {...props} className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-2.5 py-2.5 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400" />
        {trailing && <span className="mr-3">{trailing}</span>}
      </div>
    </label>
  );
}

function GeoSelect({ label, value, options, optionValues = options, disabled = false, onChange }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      {label}
      <select value={value} onChange={onChange} disabled={disabled} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option, index) => <option key={optionValues[index]} value={optionValues[index]}>{option}</option>)}
      </select>
    </label>
  );
}

function BookingQrCode({ booking, user, size = 128 }) {
  const payload = JSON.stringify({
    bookingRef: booking.id,
    userName: user?.name || booking.teacherName,
    userRole: user?.role || 'teacher',
    labName: booking.labName,
    slotDate: booking.date,
    timeSlot: booking.slot,
    status: booking.status
  });

  return (
    <div className="rounded-xl bg-white p-2" data-qr-pass={booking.id}>
      <QRCodeCanvas
        value={payload}
        size={size}
        level="H"
        includeMargin={true}
        bgColor="#ffffff"
        fgColor="#0f172a"
        aria-label={`QR code for booking ${booking.id}`}
      />
    </div>
  );
}

export default function App() {
  // Core Navigation & Role State
  const [authView, setAuthView] = useState('login');
  const [authUser, setAuthUser] = useState(null);
  const [activeRole, setActiveRole] = useState('teacher'); // 'teacher' | 'manager' | 'admin'
  const [activeScreen, setActiveScreen] = useState('teacher-dashboard');
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [mobileScreenTab, setMobileScreenTab] = useState('mob-finder'); // 4 Mobile Adaptations
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Application Data State
  const [labs, setLabs] = useState(INITIAL_LABS);
  const [selectedLabId, setSelectedLabId] = useState('LAB-CMB-01');
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [equipment, setEquipment] = useState(INITIAL_EQUIPMENT);
  const [syllabus, setSyllabus] = useState(INITIAL_SYLLABUS);
  const [damageReports, setDamageReports] = useState(INITIAL_DAMAGE_REPORTS);
  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState('All');

  // Supporting Modals & Drawers (3 Required States)
  const [selectedBookingModal, setSelectedBookingModal] = useState(null); // Modal 1: Booking & QR Pass
  const [damageModalOpen, setDamageModalOpen] = useState(false); // Modal 2: Equipment Damage Reporter
  const [apiDrawerOpen, setApiDrawerOpen] = useState(false); // Drawer 3: Notifications & Express API Inspector
  const [toastMessage, setToastMessage] = useState(null);

  // Form States
  const [bookingForm, setBookingForm] = useState({
    labId: 'LAB-CMB-01',
    grade: 'GCE A/L Grade 12',
    subject: 'Chemistry',
    practicalUnit: 'Unit 04: Redox Titration (KMnO4 vs Fe2+)',
    date: '2026-11-18',
    slot: '08:30 - 11:30',
    studentsCount: 28,
    equipmentRequested: '24x Burettes, Analytical Balance, Standard Flasks',
    notes: 'Visiting from Monaragala Rural Science Cluster; transport confirmed.'
  });

  const [sessionForm, setSessionForm] = useState({
    bookingId: 'BK-2402',
    syllabusCode: 'CHM-AL-04',
    hoursLogged: 3.5,
    studentsAttended: 28,
    outcomeSummary: 'All student pairs completed 3 concordant titre readings within 0.10 mL accuracy.'
  });

  const [damageForm, setDamageForm] = useState({
    itemName: '50mL Borosilicate Burette',
    labName: 'Advanced Chemistry & Instrumentation Lab',
    severity: 'Minor',
    qtyAffected: 1,
    description: 'Hairline crack noticed during rinsing at Bench #6.'
  });

  const [calendarSlots, setCalendarSlots] = useState([
    { id: 'SL-1', day: 'Monday', time: '08:30 - 11:30', type: 'Shared Rural Slot', school: 'Padukka Vidyalaya (G12 Chem)', color: 'blue' },
    { id: 'SL-2', day: 'Monday', time: '12:30 - 15:30', type: 'Host School Internal', school: 'Royal College 13-B Physics', color: 'slate' },
    { id: 'SL-3', day: 'Tuesday', time: '08:30 - 11:30', type: 'Shared Rural Slot', school: 'Hasalaka Gamini MV (G13 Bio)', color: 'emerald' },
    { id: 'SL-4', day: 'Wednesday', time: '08:30 - 11:30', type: 'Calibration & Maintenance', school: 'Spectrophotometer & Balance Check', color: 'amber' },
    { id: 'SL-5', day: 'Thursday', time: '08:30 - 11:30', type: 'Open for Rural Booking', school: 'Available Slot (Max 40 Students)', color: 'indigo' },
    { id: 'SL-6', day: 'Friday', time: '08:30 - 11:30', type: 'Shared Rural Slot', school: 'Monaragala Secondary (O/L Sci)', color: 'blue' }
  ]);

  const [newSchoolForm, setNewSchoolForm] = useState({
    name: '',
    censusId: 'MOE-NW-0912',
    type: 'Type 1C Visiting School',
    province: 'North Western',
    zone: 'Kurunegala Zone',
    coordinator: ''
  });

  // Helper to show non-blocking toast & log Express API call
  const triggerApiAction = (method, endpoint, actor, role, summary, status = '200 OK') => {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: '2026-11-05 15:42',
      actor,
      role,
      action: `${method} ${endpoint}`,
      target: summary,
      status
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setToastMessage({ title: `${method} ${endpoint}`, subtitle: summary });
    setTimeout(() => {
      setToastMessage((prev) => (prev && prev.subtitle === summary ? null : prev));
    }, 4200);
  };

  // Switch Role and jump to default workspace screen
  const handleRoleChange = (role) => {
    setActiveRole(role);
    if (role !== 'admin') setZoneFilter('All');
    if (role === 'teacher') setActiveScreen('teacher-dashboard');
    if (role === 'manager') setActiveScreen('manager-dashboard');
    if (role === 'admin') setActiveScreen('admin-dashboard');
  };

  const scopedLabs = useMemo(
    () => activeRole === 'admin'
      ? labs
      : !authUser?.zone ? labs : labs.filter((lab) => canonicalZone(lab.zone) === canonicalZone(authUser.zone)),
    [activeRole, authUser, labs]
  );
  const visibleBookings = useMemo(
    () => bookings.filter((booking) => {
      const lab = labs.find((item) => item.id === booking.labId);
      if (activeRole === 'admin') return zoneFilter === 'All' || canonicalZone(lab?.zone) === canonicalZone(zoneFilter);
      return !authUser?.zone || canonicalZone(lab?.zone) === canonicalZone(authUser.zone);
    }),
    [activeRole, authUser, bookings, labs, zoneFilter]
  );
  const visibleSchools = useMemo(
    () => activeRole === 'admin'
      ? (zoneFilter === 'All' ? schools : schools.filter((school) => school.zone === zoneFilter))
      : !authUser?.zone ? schools : schools.filter((school) => school.zone === authUser.zone),
    [activeRole, authUser, schools, zoneFilter]
  );
  const selectedLab = useMemo(
    () => scopedLabs.find((l) => l.id === selectedLabId) || scopedLabs[0] || labs[0],
    [labs, scopedLabs, selectedLabId]
  );
  const filteredLabs = useMemo(() => {
    return scopedLabs.filter((lab) => {
      const matchProvince = provinceFilter === 'All' || lab.province === provinceFilter;
      const matchZone = zoneFilter === 'All' || canonicalZone(lab.zone) === canonicalZone(zoneFilter);
      const matchSubject = subjectFilter === 'All' || lab.subjects.includes(subjectFilter);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lab.name.toLowerCase().includes(q) ||
        lab.hostSchool.toLowerCase().includes(q) ||
        lab.district.toLowerCase().includes(q) ||
        lab.zone.toLowerCase().includes(q) ||
        lab.equipmentHighlights.some((e) => e.toLowerCase().includes(q));
      return matchProvince && matchZone && matchSubject && matchSearch;
    });
  }, [scopedLabs, provinceFilter, zoneFilter, subjectFilter, searchQuery]);
  const selectedFilteredLab = useMemo(
    () => filteredLabs.find((lab) => lab.id === selectedLabId) || filteredLabs[0] || null,
    [filteredLabs, selectedLabId]
  );

  // Handlers for mutations
  const downloadQrPass = (bookingId) => {
    const canvas = document.querySelector(`[data-qr-pass="${bookingId}"] canvas`);
    if (!canvas) {
      setToastMessage({ title: 'QR pass unavailable', subtitle: 'Open the booking pass again and retry.' });
      return;
    }
    const link = document.createElement('a');
    link.download = `${bookingId}-qr-pass.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const targetLab = labs.find((l) => l.id === bookingForm.labId) || labs[0];
    const created = {
      id: `BK-${Math.floor(2500 + Math.random() * 900)}`,
      labId: targetLab.id,
      labName: targetLab.name,
      hostSchool: targetLab.hostSchool,
      visitingSchool: authUser.schoolName,
      teacherName: authUser.name,
      grade: bookingForm.grade,
      subject: bookingForm.subject,
      practicalUnit: bookingForm.practicalUnit,
      date: bookingForm.date,
      slot: bookingForm.slot,
      studentsCount: Number(bookingForm.studentsCount) || 25,
      attendedCount: null,
      attendanceVerified: false,
      status: 'Pending',
      equipmentRequested: bookingForm.equipmentRequested.split(',').map((s) => s.trim()).filter(Boolean),
      notes: bookingForm.notes
    };

    setBookings((prev) => [created, ...prev]);
    triggerApiAction(
      'POST',
      '/api/bookings',
      authUser.name,
      authUser.role === 'manager' ? 'Lab Manager' : 'Science Teacher',
      `Booked ${targetLab.hostSchool} (${created.id})`,
      '201 Created'
    );
    setSelectedBookingModal(created);
  };

  const handleBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    triggerApiAction(
      'PATCH',
      `/api/bookings/${bookingId}/status`,
      'Mr. K. Jayawardena',
      'Host Lab Manager',
      `Updated booking ${bookingId} to ${newStatus}`
    );
  };

  const handleVerifyAttendance = (bookingId, headcount) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'Completed', attendedCount: headcount, attendanceVerified: true }
          : b
      )
    );
    triggerApiAction(
      'PATCH',
      `/api/bookings/${bookingId}/attendance`,
      'Mr. K. Jayawardena',
      'Host Lab Manager',
      `Verified ${headcount} students attended for ${bookingId}`
    );
  };

  const handleLogSession = (e) => {
    e.preventDefault();
    setSyllabus((prev) =>
      prev.map((item) =>
        item.code === sessionForm.syllabusCode
          ? {
              ...item,
              completedHours: Math.min(item.requiredHours, item.completedHours + Number(sessionForm.hoursLogged)),
              status:
                item.completedHours + Number(sessionForm.hoursLogged) >= item.requiredHours
                  ? 'Completed'
                  : 'In Progress'
            }
          : item
      )
    );
    triggerApiAction(
      'POST',
      '/api/sessions',
      'Mrs. N. Bandara',
      'Science Teacher',
      `Logged ${sessionForm.hoursLogged} hrs for ${sessionForm.syllabusCode}`,
      '201 Created'
    );
  };

  const handleReportDamage = (e) => {
    e.preventDefault();
    const newReport = {
      id: `DMG-${Math.floor(400 + Math.random() * 500)}`,
      itemName: damageForm.itemName,
      labName: damageForm.labName,
      reportedBy: activeRole === 'teacher' ? 'Mrs. N. Bandara (Teacher)' : 'Mr. K. Jayawardena (Manager)',
      date: '2026-11-05',
      severity: damageForm.severity,
      qtyAffected: Number(damageForm.qtyAffected) || 1,
      description: damageForm.description,
      status: 'Open'
    };
    setDamageReports((prev) => [newReport, ...prev]);
    setDamageModalOpen(false);
    triggerApiAction(
      'POST',
      '/api/damage-reports',
      newReport.reportedBy,
      activeRole === 'teacher' ? 'Science Teacher' : 'Host Lab Manager',
      `Reported ${newReport.severity} damage: ${newReport.itemName}`,
      '201 Created'
    );
  };

  const handleAdjustEquipment = (eqId, delta, newCondition) => {
    setEquipment((prev) =>
      prev.map((item) => {
        if (item.id !== eqId) return item;
        const updatedQty = Math.max(0, Math.min(item.totalQty, item.availableQty + delta));
        return {
          ...item,
          availableQty: updatedQty,
          condition: newCondition || item.condition
        };
      })
    );
    triggerApiAction(
      'PATCH',
      `/api/equipment/${eqId}`,
      'Mr. K. Jayawardena',
      'Host Lab Manager',
      `Adjusted stock/status for equipment ${eqId}`
    );
  };

  const handleVerifySchool = (schoolId, nextStatus) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, status: nextStatus } : s))
    );
    triggerApiAction(
      'PATCH',
      `/api/schools/${schoolId}/verify`,
      'Dr. R. Wijesinghe',
      'System Admin',
      `School ${schoolId} marked as ${nextStatus}`
    );
  };

  const handleAddSchool = (e) => {
    e.preventDefault();
    if (!newSchoolForm.name.trim()) return;
    const created = {
      id: `SCH-${Math.floor(200 + Math.random() * 700)}`,
      censusId: newSchoolForm.censusId,
      name: newSchoolForm.name,
      type: newSchoolForm.type,
      province: newSchoolForm.province,
      zone: newSchoolForm.zone,
      labsCount: newSchoolForm.type.includes('Host') ? 2 : 0,
      status: 'Verified',
      coordinator: newSchoolForm.coordinator || 'Zonal Science Officer'
    };
    setSchools((prev) => [created, ...prev]);
    setNewSchoolForm({ ...newSchoolForm, name: '', coordinator: '' });
    triggerApiAction(
      'POST',
      '/api/schools',
      'Dr. R. Wijesinghe',
      'System Admin',
      `Registered ${created.name} (${created.censusId})`,
      '201 Created'
    );
  };

  // Status Badge Helper
  const renderBadge = (status) => {
    const styles = {
      Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Verified: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Operational: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Completed: 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
      'Pending Verification': 'bg-amber-100 text-amber-800 border-amber-200',
      'Low Stock': 'bg-amber-100 text-amber-800 border-amber-200',
      Open: 'bg-amber-100 text-amber-800 border-amber-200',
      Minor: 'bg-amber-100 text-amber-800 border-amber-200',
      Moderate: 'bg-orange-100 text-orange-800 border-orange-200',
      'Repair Needed': 'bg-rose-100 text-rose-800 border-rose-200',
      Declined: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        {status}
      </span>
    );
  };

  // Current role screens for sidebar
  const currentRoleScreens = useMemo(
    () => ALL_SCREENS.filter((s) => s.role === activeRole || s.role === 'shared'),
    [activeRole]
  );

  const activeScreenMeta = useMemo(
    () => ALL_SCREENS.find((s) => s.id === activeScreen) || ALL_SCREENS[0],
    [activeScreen]
  );

  if (!authUser) {
    return (
      <AuthView
        view={authView}
        setView={setAuthView}
        onAuthenticated={(user) => {
          setAuthUser(user);
          if (user.role === 'manager' || user.role === 'admin' || user.role === 'teacher') {
            handleRoleChange(user.role);
          }
        }}
      />
    );
  }

  // -------------------------------------------------------------------------
  // RENDER MOBILE VIEW ADAPTATIONS (4 Dedicated Mobile Views)
  // -------------------------------------------------------------------------
  const renderMobileAdaptationView = () => {
    return (
      <div className="py-4 px-2 sm:px-6 flex flex-col items-center">
        {/* Mobile Adaptation Selector Header */}
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Responsive Field Companion • 4 Mobile Adaptations
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Lab Connect Mobile Screens (Sri Lanka Field & Lab Bench Edition)
              </h2>
            </div>
            <button
              onClick={() => setViewportMode('desktop')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
            >
              <Monitor className="w-3.5 h-3.5" /> Return to Desktop Suite
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mob-finder', label: 'M1: Nearby Lab Map', role: 'Teacher' },
              { id: 'mob-pass', label: 'M2: QR Booking Pass', role: 'Teacher' },
              { id: 'mob-checkin', label: 'M3: Manager Attendance', role: 'Lab Manager' },
              { id: 'mob-damage', label: 'M4: Quick Bench Incident', role: 'All Roles' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMobileScreenTab(tab.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mobileScreenTab === tab.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">{tab.label}</div>
                <div className={`text-[11px] ${mobileScreenTab === tab.id ? 'text-blue-100' : 'text-slate-500'}`}>
                  {tab.role} View
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Smartphone Frame */}
        <div className="w-full max-w-[390px] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800">
          <div className="bg-[#F1F5F9] rounded-[30px] overflow-hidden min-h-[680px] flex flex-col justify-between">
            {/* Mobile Status & Navy App Bar */}
            <div className="bg-[#0F172A] text-white px-4 pt-3 pb-3.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>SLT-Mobitel 4G • 15:40</span>
                <span>MoE Lab Connect LK</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">Lab Connect Mobile</div>
                    <div className="text-[11px] text-blue-300">
                      {mobileScreenTab === 'mob-finder' && 'M1 • Nearby Host Labs'}
                      {mobileScreenTab === 'mob-pass' && 'M2 • Digital Gate QR Pass'}
                      {mobileScreenTab === 'mob-checkin' && 'M3 • Host Manager Check-In'}
                      {mobileScreenTab === 'mob-damage' && 'M4 • Bench Damage Logger'}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                  Online
                </span>
              </div>
            </div>

            {/* Mobile Screen Body */}
            <div className="p-3.5 flex-1 space-y-3 overflow-y-auto max-h-[540px]">
              {mobileScreenTab === 'mob-finder' && (
                <>
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>GPS Zonal Radar • Western & Central</span>
                      <span className="text-blue-600">5 Host Labs</span>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 text-white flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-300">Closest Available Facility</div>
                        <div className="text-sm font-bold">Royal College Chemistry Lab</div>
                        <div className="text-[11px] text-emerald-400 mt-0.5">5.8 km away • 3 Slots Open</div>
                      </div>
                      <Navigation className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  {labs.slice(0, 3).map((lab) => (
                    <div key={lab.id} className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            {lab.province} • {lab.distanceKm} km
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{lab.name}</h4>
                          <p className="text-[11px] text-slate-500">{lab.hostSchool}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {lab.capacity} Seats
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-600">Next: {lab.availableSlots[0]}</span>
                        <button
                          onClick={() => setMobileScreenTab('mob-pass')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {mobileScreenTab === 'mob-pass' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Approved Gate Entry Pass
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dharmaraja College — Life Sciences Lab
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visiting: Hasalaka Gamini MV • 26 A/L Students
                  </p>
                  <div className="my-3 mx-auto w-36 h-36 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-3 shadow-inner">
                    <BookingQrCode
                      booking={{
                        id: 'BK-2402-MOE-LK',
                        labName: 'Central Province Life Sciences & Microscopy Hub',
                        hostSchool: 'Dharmaraja College',
                        visitingSchool: 'Hasalaka Gamini MV',
                        date: '2026-11-08',
                        slot: '08:30-11:30'
                      }}
                      user={authUser}
                      size={112}
                    />
                    <span className="text-[10px] font-mono mt-1 text-slate-300">BK-2402-MOE-LK</span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-2.5 text-left text-xs space-y-1 text-blue-950">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Date & Slot:</span>
                      <span className="font-bold">2026-11-08 (08:30-11:30)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Practical:</span>
                      <span className="font-bold">Onion Root Mitosis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Host Manager:</span>
                      <span className="font-bold">Mrs. S. Ratnayake</span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      triggerApiAction(
                        'GET',
                        '/api/bookings/BK-2402/qr-pass',
                        'Mr. T. Herath',
                        'Science Teacher',
                        'Downloaded Offline Gate QR Pass'
                      )
                    }
                    className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    Save Offline QR Pass to Phone
                  </button>
                </div>
              )}

              {mobileScreenTab === 'mob-checkin' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <div className="text-xs font-bold text-emerald-950">Host Gate & Bench Check-In</div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Verify visiting rural school arrival and confirm student headcount.
                    </p>
                  </div>
                  {bookings.slice(0, 2).map((b) => (
                    <div key={b.id} className="bg-white rounded-xl p-3 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-blue-600">{b.id}</span>
                        {renderBadge(b.status)}
                      </div>
                      <div className="text-xs font-bold text-slate-900">{b.visitingSchool}</div>
                      <div className="text-[11px] text-slate-600">
                        {b.grade} • {b.studentsCount} Students • {b.slot}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleVerifyAttendance(b.id, b.studentsCount)}
                          className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                        >
                          Verify {b.studentsCount} Present
                        </button>
                        <button
                          onClick={() => handleBookingStatus(b.id, 'Approved')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {mobileScreenTab === 'mob-damage' && (
                <form onSubmit={handleReportDamage} className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold">Instant Lab Bench Incident Log</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Apparatus / Item</label>
                    <input
                      type="text"
                      value={damageForm.itemName}
                      onChange={(e) => setDamageForm({ ...damageForm, itemName: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Severity</label>
                      <select
                        value={damageForm.severity}
                        onChange={(e) => setDamageForm({ ...damageForm, severity: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option>Minor</option>
                        <option>Moderate</option>
                        <option>Repair Needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={damageForm.qtyAffected}
                        onChange={(e) => setDamageForm({ ...damageForm, qtyAffected: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bench Incident Note</label>
                    <textarea
                      rows={2}
                      value={damageForm.description}
                      onChange={(e) => setDamageForm({ ...damageForm, description: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    Submit Report to Host Manager
                  </button>
                </form>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 grid grid-cols-4 gap-1 text-center">
              {[
                { id: 'mob-finder', label: 'Find Lab', icon: MapPin },
                { id: 'mob-pass', label: 'QR Pass', icon: QrCode },
                { id: 'mob-checkin', label: 'Check-In', icon: Users },
                { id: 'mob-damage', label: 'Incident', icon: AlertTriangle }
              ].map((nav) => {
                const Icon = nav.icon;
                const active = mobileScreenTab === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setMobileScreenTab(nav.id)}
                    className={`flex flex-col items-center py-1 rounded-lg ${
                      active ? 'text-blue-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] mt-0.5">{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // SCIENCE TEACHER WORKSPACE SCREENS (Screens 01 - 06)
  // -------------------------------------------------------------------------
  const renderTeacherWorkspace = () => {
    if (activeScreen === 'teacher-dashboard') {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#183653] p-5 text-white shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-200">Welcome back</div>
            <h2 className="mt-1 text-xl font-extrabold">{authUser.name}</h2>
            <p className="mt-1 text-xs text-blue-100">{authUser.schoolName} • {authUser.zone} Zone</p>
          </div>
          {/* Pastel KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Practical Hours Logged
                </span>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-blue-950 mt-2">42.5 / 60 hrs</div>
              <div className="text-xs text-blue-800 mt-1">GCE A/L & O/L 2026 Batch Target</div>
            </div>

            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  NIE Syllabus Coverage
                </span>
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-2">78.4%</div>
              <div className="text-xs text-emerald-800 mt-1">+14% since joining Lab Connect</div>
            </div>

            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Active Lab Bookings
                </span>
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-950 mt-2">
                {visibleBookings.filter((b) => b.status !== 'Completed').length} Scheduled
              </div>
              <div className="text-xs text-amber-800 mt-1">Next: Nov 08 • Dharmaraja College</div>
            </div>

            <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Nearby Urban Host Labs
                </span>
                <MapPin className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-950 mt-2">{scopedLabs.length} Facilities</div>
              <div className="text-xs text-indigo-800 mt-1">Within Zonal Transport Radius</div>
            </div>
          </div>

          {/* Quick Action Banner + Upcoming Visits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upcoming & Recent Host Laboratory Visits
                  </h3>
                  <p className="text-xs text-slate-500">
                    Coordinate transport, equipment prep lists, and gate QR passes for rural batches
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('teacher-booking')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Lab Booking
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                      <th className="py-2.5 px-2">Ref & Date</th>
                      <th className="py-2.5 px-2">Urban Host Laboratory</th>
                      <th className="py-2.5 px-2">Practical Unit</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Pass</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {visibleBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 px-2 font-semibold text-slate-900">
                          <div>{b.id}</div>
                          <div className="text-[11px] text-slate-500">{b.date}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-slate-800">{b.hostSchool}</div>
                          <div className="text-[11px] text-slate-500">{b.slot} • {b.studentsCount} Students</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-medium text-blue-700">{b.subject}:</span> {b.practicalUnit}
                        </td>
                        <td className="py-3 px-2">{renderBadge(b.status)}</td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => setSelectedBookingModal(b)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold"
                          >
                            <QrCode className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Syllabus Progress Breakdown Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Syllabus Practical Completion
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  2026 GCE A/L & O/L Science Practical Coverage
                </p>
                <div className="space-y-3.5">
                  {[
                    { subject: 'GCE A/L Physics (Units 1–10)', pct: 84, color: 'bg-blue-600' },
                    { subject: 'GCE A/L Chemistry (Volumetric/Organic)', pct: 72, color: 'bg-emerald-600' },
                    { subject: 'GCE A/L Biology (Microscopy/Anatomy)', pct: 88, color: 'bg-indigo-600' },
                    { subject: 'GCE O/L Integrated Science (G10–11)', pct: 69, color: 'bg-amber-500' }
                  ].map((s) => (
                    <div key={s.subject}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{s.subject}</span>
                        <span>{s.pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveScreen('teacher-map')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Explore Sri Lanka Lab Map <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDamageModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100"
                >
                  Report Breakage
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'teacher-map') {
      return (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by host school, district (e.g., Colombo, Kandy, Galle), or apparatus..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50"
              >
                <option value="All">All Provinces (Sri Lanka)</option>
                <option value="Western">Western Province</option>
                <option value="Central">Central Province</option>
                <option value="Southern">Southern Province</option>
                <option value="Northern">Northern Province</option>
                <option value="Uva">Uva Province</option>
              </select>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50"
              >
                <option value="All">All Zones</option>
                {[...new Set(scopedLabs.map((lab) => lab.zone))].sort().map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50"
              >
                <option value="All">All Science Subjects</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Sri Lanka Map Card */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    GIS Zonal Mapping • Ministry of Education
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                    {filteredLabs.length} Active Hubs
                  </span>
                </div>
                <h3 className="text-base font-bold">Sri Lanka Host School Laboratory Network</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any provincial pin to inspect host school capacity, available slots, and apparatus
                </p>
              </div>

              {/* Stylized SVG Island Map of Sri Lanka with Interactive Pins */}
              <div className="my-4 flex justify-center">
                <div className="relative h-80 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1324]">
                <svg viewBox="0 0 100 115" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  {/* Stylized Sri Lanka Island Silhouette */}
                  <path
                    d="M42,6 C47,8 51,14 53,21 C57,28 65,36 69,47 C74,59 75,74 68,87 C61,98 48,104 37,100 C27,96 22,84 23,71 C24,58 28,46 31,34 C34,22 37,10 42,6 Z"
                    fill="#1E293B"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                  />
                  {/* Zonal Grid Rings */}
                  <circle cx="48" cy="58" r="28" fill="none" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.6" />
                </svg>

                {/* Interactive Pins Overlaid */}
                {filteredLabs.map((lab) => {
                  const isSelected = lab.id === selectedFilteredLab?.id;
                  return (
                    <button
                      key={lab.id}
                      type="button"
                      onClick={() => setSelectedLabId(lab.id)}
                      style={{ left: `${lab.coords.x}%`, top: `${lab.coords.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center transition-transform ${
                        isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                      }`}
                    >
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow whitespace-nowrap mb-1 ${
                          isSelected
                            ? 'bg-blue-600 text-white ring-2 ring-white'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-600'
                        }`}
                      >
                        {canonicalZone(lab.zone)} ZEO
                      </div>
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        {isSelected && <div className="absolute inset-0 animate-ping rounded-full bg-emerald-300/70" />}
                      <div
                        className={`relative h-4 w-4 rounded-full ${
                          isSelected ? 'bg-emerald-400 ring-4 ring-emerald-400/30' : 'bg-blue-500'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              </div>

              {/* Selected Pin Quick Card */}
              {selectedFilteredLab ? <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-400">
                      Zonal Education Office • {canonicalZone(selectedFilteredLab.zone)}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{selectedFilteredLab.name}</h4>
                    <p className="text-xs text-slate-300">{selectedFilteredLab.hostSchool}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLabId(selectedFilteredLab.id);
                      setActiveScreen('teacher-lab-detail');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
                  >
                    Inspect Lab
                  </button>
                </div>
              </div> : (
                <div className="rounded-xl border border-amber-400/30 bg-amber-950/30 p-4">
                  <h4 className="text-sm font-bold text-amber-100">
                    No Host Lab in {zoneFilter === 'All' ? 'the selected' : zoneFilter} Zone
                  </h4>
                  <p className="mt-1 text-xs text-amber-200/80">Select a nearby zone or reset the current filter.</p>
                  <button type="button" onClick={() => setZoneFilter('All')} className="mt-3 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-950">
                    Reset Zone Filter
                  </button>
                </div>
              )}
            </div>

            {/* Host Laboratory Cards List */}
            <div className="lg:col-span-7 space-y-4">
              {filteredLabs.length ? filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm transition-all flex flex-col sm:flex-row gap-4 ${
                    selectedFilteredLab?.id === lab.id ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={lab.image}
                    alt={lab.name}
                    onError={(event) => {
                      event.currentTarget.src = '/lab-images/chemistry-lab.svg';
                    }}
                    className="w-full sm:w-44 h-36 object-cover rounded-xl shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {canonicalZone(lab.zone)} Zonal Education Office • {lab.province} Province • {lab.distanceKm} km
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          ★ {lab.rating} • {lab.capacity} Students Max
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">{lab.name}</h4>
                      <p className="text-xs font-medium text-slate-600">{lab.hostSchool}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {lab.equipmentHighlights.slice(0, 3).map((eq) => (
                          <span
                            key={eq}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Open Slots:</span>{' '}
                        {lab.availableSlots.join(' • ')}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedLabId(lab.id);
                            setActiveScreen('teacher-lab-detail');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                        >
                          Facility Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLabId(lab.id);
                            setBookingForm((prev) => ({ ...prev, labId: lab.id }));
                            setActiveScreen('teacher-lab-detail');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          View Slots & Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <h4 className="text-sm font-bold text-amber-950">
                    No Host Lab in {zoneFilter === 'All' ? 'the selected filters' : `${zoneFilter} Zone`}
                  </h4>
                  <p className="mt-1 text-xs text-amber-800">Select a nearby zone or reset the filters to view available facilities.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setZoneFilter('All');
                      setProvinceFilter('All');
                      setSubjectFilter('All');
                      setSearchQuery('');
                    }}
                    className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                  >
                    Reset Zone Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'teacher-lab-detail') {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <img
                  src={selectedLab.image}
                  alt={selectedLab.name}
                  onError={(event) => {
                    event.currentTarget.src = '/lab-images/chemistry-lab.svg';
                  }}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {selectedLab.id} • {canonicalZone(selectedLab.zone)} Zonal Education Office
                    </span>
                    {renderBadge('Operational')}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedLab.name}</h2>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">{selectedLab.hostSchool}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                      <div className="text-[11px] text-blue-700 font-semibold">Student Capacity</div>
                      <div className="text-base font-extrabold text-blue-950">{selectedLab.capacity} Seats</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <div className="text-[11px] text-emerald-700 font-semibold">Workbenches</div>
                      <div className="text-base font-extrabold text-emerald-950">{selectedLab.benches} Benches</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                      <div className="text-[11px] text-amber-700 font-semibold">Distance</div>
                      <div className="text-base font-extrabold text-amber-950">{selectedLab.distanceKm} km</div>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                      <div className="text-[11px] text-indigo-700 font-semibold">Lab Manager</div>
                      <div className="text-xs font-bold text-indigo-950 truncate">{selectedLab.manager}</div>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Available Apparatus & Instrumentation
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedLab.equipmentHighlights.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Direct Lab Office: <strong>{selectedLab.phone}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveScreen('teacher-map')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                    >
                      Switch Facility
                    </button>
                    <button
                      onClick={() => {
                        setBookingForm((prev) => ({ ...prev, labId: selectedLab.id }));
                        setActiveScreen('teacher-booking');
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      Book Practical Session Here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Rules & Weekly Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Mandatory Host Laboratory Safety Protocol
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {selectedLab.safetyRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Weekly Shared Time Slots for Rural Schools
              </h3>
              <div className="space-y-2.5">
                {selectedLab.availableSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200"
                  >
                    <div>
                      <div className="text-xs font-bold text-emerald-950">{slot}</div>
                      <div className="text-[11px] text-emerald-700">3.0 Practical Hours • Prep Assistant Included</div>
                    </div>
                    <button
                      onClick={() => {
                        setBookingForm((prev) => ({
                          ...prev,
                          labId: selectedLab.id,
                          slot: slot.split(' ').slice(1).join(' ') || '08:30 - 11:30'
                        }));
                        setActiveScreen('teacher-booking');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Select Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'teacher-booking') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Express API • POST /api/bookings
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Request Host School Laboratory Time Slot
              </h3>
              <p className="text-xs text-slate-500">
                Submit a coordinated practical request to reserve benches and apparatus for your visiting rural students.
              </p>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Urban Host Laboratory
                  </label>
                  <select
                    value={bookingForm.labId}
                    onChange={(e) => setBookingForm({ ...bookingForm, labId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    {scopedLabs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.hostSchool} — {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Batch & Stream
                  </label>
                  <select
                    value={bookingForm.grade}
                    onChange={(e) => setBookingForm({ ...bookingForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option>GCE A/L Grade 12</option>
                    <option>GCE A/L Grade 13</option>
                    <option>GCE O/L Grade 11</option>
                    <option>GCE O/L Grade 10</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={bookingForm.subject}
                    onChange={(e) => setBookingForm({ ...bookingForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option>Chemistry</option>
                    <option>Physics</option>
                    <option>Biology</option>
                    <option>Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookingForm.slot}
                    onChange={(e) => setBookingForm({ ...bookingForm, slot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    <option>08:30 - 11:30</option>
                    <option>12:30 - 15:30</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIE Syllabus Practical Unit Title
                  </label>
                  <input
                    type="text"
                    value={bookingForm.practicalUnit}
                    onChange={(e) => setBookingForm({ ...bookingForm, practicalUnit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Headcount
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="45"
                    value={bookingForm.studentsCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, studentsCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Apparatus & Reagents (Comma-separated)
                </label>
                <input
                  type="text"
                  value={bookingForm.equipmentRequested}
                  onChange={(e) => setBookingForm({ ...bookingForm, equipmentRequested: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Zonal Transport & Coordination Notes
                </label>
                <textarea
                  rows={2}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveScreen('teacher-dashboard')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Submit Booking & Generate QR Pass
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h4 className="text-sm font-bold text-blue-950 mb-1">
                Ministry Transport & Reagent Subsidy Eligible
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Visiting Type 1C and Type 2 rural schools receive automated Zonal Education Office travel vouchers once the Host School Lab Manager approves your booking slot.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Your Active Booking Requests ({visibleBookings.length})
              </h4>
              <div className="space-y-2.5">
                {visibleBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {b.id} • {b.hostSchool}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.date} ({b.slot}) • {b.studentsCount} Students
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderBadge(b.status)}
                      <button
                        onClick={() => setSelectedBookingModal(b)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-600"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'teacher-session-log') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Practical Session Logger */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Express API • POST /api/sessions
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Record Completed Practical Session & Hours
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update official NIE syllabus practical coverage after completing a shared host lab session.
            </p>
            <form onSubmit={handleLogSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Completed Booking Reference
                </label>
                <select
                  value={sessionForm.bookingId}
                  onChange={(e) => setSessionForm({ ...sessionForm, bookingId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  {visibleBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} — {b.hostSchool} ({b.practicalUnit})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIE Syllabus Unit Code
                  </label>
                  <select
                    value={sessionForm.syllabusCode}
                    onChange={(e) => setSessionForm({ ...sessionForm, syllabusCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  >
                    {syllabus.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} — {s.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Practical Hours Completed
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="6"
                    value={sessionForm.hoursLogged}
                    onChange={(e) => setSessionForm({ ...sessionForm, hoursLogged: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Practical Observations & Student Competency Notes
                </label>
                <textarea
                  rows={3}
                  value={sessionForm.outcomeSummary}
                  onChange={(e) => setSessionForm({ ...sessionForm, outcomeSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
              >
                Log Practical Hours to Syllabus Registry
              </button>
            </form>
          </div>

          {/* Equipment Damage & Incident Log */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Express API • POST /api/damage-reports
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Equipment Breakage & Incident Registry
                  </h3>
                </div>
                <button
                  onClick={() => setDamageModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                >
                  + File Incident Report
                </button>
              </div>
              <div className="space-y-3 mt-4">
                {damageReports.map((rep) => (
                  <div key={rep.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {rep.id} • {rep.itemName} (x{rep.qtyAffected})
                      </span>
                      <div className="flex gap-1.5">
                        {renderBadge(rep.severity)}
                        {renderBadge(rep.status)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{rep.description}</p>
                    <div className="text-[11px] text-slate-400">
                      {rep.labName} • Reported by {rep.reportedBy} on {rep.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Screen 06: Teacher Syllabus & Practical Hours Tracker
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                National Institute of Education (NIE) Sri Lanka
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Mandatory Science Practical Syllabus & Hours Tracker
              </h3>
            </div>
            <button
              onClick={() =>
                triggerApiAction(
                  'GET',
                  '/api/syllabus/export-pdf',
                  'Mrs. N. Bandara',
                  'Science Teacher',
                  'Exported Zonal Practical Hours Audit Sheet'
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              <Download className="w-4 h-4" /> Export Zonal Practical Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">Unit Code</th>
                  <th className="py-2.5 px-3">Grade & Subject</th>
                  <th className="py-2.5 px-3">NIE Practical Experiment Title</th>
                  <th className="py-2.5 px-3">Hours Progress</th>
                  <th className="py-2.5 px-3">Host Lab Facility</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {syllabus.map((unit) => (
                  <tr key={unit.code} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{unit.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {unit.grade} • {unit.subject}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{unit.title}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {unit.completedHours} / {unit.requiredHours} hrs
                    </td>
                    <td className="py-3 px-3 text-slate-600">{unit.lastLab}</td>
                    <td className="py-3 px-3">{renderBadge(unit.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // HOST SCHOOL LAB MANAGER WORKSPACE SCREENS (Screens 07 - 12)
  // -------------------------------------------------------------------------
  const renderManagerWorkspace = () => {
    if (activeScreen === 'manager-dashboard') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Pending Rural Requests
                </span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-950 mt-2">
                {visibleBookings.filter((b) => b.status === 'Pending').length} Requests
              </div>
              <div className="text-xs text-amber-800 mt-1">Awaiting slot & apparatus review</div>
            </div>

            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Weekly Lab Utilization
                </span>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-blue-950 mt-2">84.2%</div>
              <div className="text-xs text-blue-800 mt-1">62% Host Classes • 22% Rural Schools</div>
            </div>

            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Operational Apparatus
                </span>
                <Wrench className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-2">94.8% Ready</div>
              <div className="text-xs text-emerald-800 mt-1">1 Analytical balance flagged for service</div>
            </div>

            <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Visiting Students Hosted
                </span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-950 mt-2">312 Students</div>
              <div className="text-xs text-indigo-800 mt-1">Across 11 visiting rural schools this term</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Incoming Rural School Booking Queue
                  </h3>
                  <p className="text-xs text-slate-500">
                    Approve or reschedule requests and generate reagent preparation checklists
                  </p>
                </div>
                <button
                  onClick={() => setActiveScreen('manager-approvals')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Open Full Queue →
                </button>
              </div>
              <div className="space-y-3">
                {visibleBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600">{b.id}</span>
                        <span className="text-xs font-bold text-slate-900">{b.visitingSchool}</span>
                        {renderBadge(b.status)}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {b.practicalUnit} • <strong>{b.studentsCount} Students</strong> ({b.date}, {b.slot})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleBookingStatus(b.id, 'Approved')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedBookingModal(b)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                      >
                        Prep Sheet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Apparatus & Maintenance Alerts
              </h3>
              <div className="space-y-3">
                {equipment.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Available: {item.availableQty} / {item.totalQty} • Calibrated: {item.lastCalibrated}
                      </div>
                    </div>
                    {renderBadge(item.condition)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'manager-approvals') {
      const list =
        bookingStatusFilter === 'All'
          ? bookings
          : visibleBookings.filter((b) => b.status === bookingStatusFilter);
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Express API • PATCH /api/bookings/:id/status
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Host School Booking Approval & Conflict Management
              </h3>
            </div>
            <div className="flex gap-2">
              {['All', 'Pending', 'Approved', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    bookingStatusFilter === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Visiting Rural School & Teacher</th>
                  <th className="py-2.5 px-3">Experiment & Apparatus</th>
                  <th className="py-2.5 px-3">Slot & Batch</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Manager Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {list.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-blue-600">{b.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{b.visitingSchool}</div>
                      <div className="text-[11px] text-slate-500">{b.teacherName} • {b.grade}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{b.practicalUnit}</div>
                      <div className="text-[11px] text-slate-500">
                        {b.equipmentRequested.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{b.date}</div>
                      <div className="text-[11px] text-slate-500">{b.slot} ({b.studentsCount} Students)</div>
                    </td>
                    <td className="py-3 px-3">{renderBadge(b.status)}</td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleBookingStatus(b.id, 'Approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleBookingStatus(b.id, 'Declined')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => setSelectedBookingModal(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeScreen === 'manager-calendar') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Master Laboratory Schedule & Shared Slot Allocation
              </h3>
              <p className="text-xs text-slate-500">
                Balance Host School internal A/L practical classes with Visiting Rural School blocks
              </p>
            </div>
            <button
              onClick={() => {
                const newSlot = {
                  id: `SL-${calendarSlots.length + 1}`,
                  day: 'Friday',
                  time: '12:30 - 15:30',
                  type: 'Open for Rural Booking',
                  school: 'Newly Published Rural Sharing Window',
                  color: 'emerald'
                };
                setCalendarSlots((prev) => [...prev, newSlot]);
                triggerApiAction(
                  'POST',
                  '/api/labs/LAB-CMB-01/slots',
                  'Mr. K. Jayawardena',
                  'Host Lab Manager',
                  'Published Friday 12:30-15:30 Rural Sharing Slot',
                  '201 Created'
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              + Publish Open Rural Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900">{slot.day}</span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {slot.time}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">{slot.type}</div>
                  <p className="text-xs text-slate-600 mt-1">{slot.school}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">Royal College Lab #1</span>
                  <button
                    onClick={() =>
                      setCalendarSlots((prev) => prev.filter((item) => item.id !== slot.id))
                    }
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Release Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeScreen === 'manager-inventory') {
      const filteredEq =
        equipmentCategoryFilter === 'All'
          ? equipment
          : equipment.filter((e) => e.category === equipmentCategoryFilter);
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Express API • PATCH /api/equipment/:id
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Laboratory Equipment Inventory & Calibration Tracker
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Optics & Biology', 'Volumetric Glassware', 'Physics & Electronics', 'Instrumentation'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setEquipmentCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      equipmentCategoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">Code & Apparatus Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Available / Total</th>
                  <th className="py-2.5 px-3">Last Calibrated</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3 text-right">Stock & Maintenance Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEq.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.id} • {item.labId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.availableQty} / {item.totalQty} units
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.lastCalibrated}</td>
                    <td className="py-3 px-3">{renderBadge(item.condition)}</td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleAdjustEquipment(item.id, -1)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleAdjustEquipment(item.id, 1)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                      >
                        +1
                      </button>
                      <button
                        onClick={() =>
                          handleAdjustEquipment(
                            item.id,
                            0,
                            item.condition === 'Operational' ? 'Repair Needed' : 'Operational'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeScreen === 'manager-attendance') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Visiting School Attendance Verification & Digital Sign-Off
            </h3>
            <p className="text-xs text-slate-500">
              Confirm actual student attendance upon arrival and issue digital practical completion certificates
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleBookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600">{b.id} • {b.date}</span>
                  {renderBadge(b.attendanceVerified ? 'Verified' : b.status)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.visitingSchool}</h4>
                  <p className="text-xs text-slate-600">{b.practicalUnit}</p>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl">
                  <span>Booked Batch: <strong>{b.studentsCount} Students</strong></span>
                  <span>
                    Verified Present:{' '}
                    <strong>{b.attendedCount !== null ? `${b.attendedCount} Students` : 'Pending'}</strong>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerifyAttendance(b.id, b.studentsCount)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  >
                    Verify Full Batch Attendance ({b.studentsCount})
                  </button>
                  <button
                    onClick={() => setSelectedBookingModal(b)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    QR Gate Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Screen 12: Lab Profile & Safety Rules Maintenance
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Express API • PUT /api/labs/:id/profile
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Host Laboratory Profile & Safety Protocol Configuration
            </h3>
          </div>
          <button
            onClick={() =>
              triggerApiAction(
                'PUT',
                `/api/labs/${selectedLab.id}/profile`,
                'Mr. K. Jayawardena',
                'Host Lab Manager',
                `Saved updated profile & safety rules for ${selectedLab.name}`
              )
            }
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            Save Facility Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Laboratory Title</label>
            <input
              type="text"
              value={selectedLab.name}
              onChange={(e) =>
                setLabs((prev) =>
                  prev.map((l) => (l.id === selectedLab.id ? { ...l, name: e.target.value } : l))
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Max Student Capacity</label>
            <input
              type="number"
              value={selectedLab.capacity}
              onChange={(e) =>
                setLabs((prev) =>
                  prev.map((l) =>
                    l.id === selectedLab.id ? { ...l, capacity: Number(e.target.value) } : l
                  )
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lab Manager in Charge</label>
            <input
              type="text"
              value={selectedLab.manager}
              onChange={(e) =>
                setLabs((prev) =>
                  prev.map((l) => (l.id === selectedLab.id ? { ...l, manager: e.target.value } : l))
                )
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Mandatory Safety Rules Displayed to Visiting Rural Schools
          </label>
          <div className="space-y-2">
            {selectedLab.safetyRules.map((rule, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong>Rule #{idx + 1}:</strong> {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // SYSTEM ADMINISTRATOR WORKSPACE SCREENS (Screens 13 - 18)
  // -------------------------------------------------------------------------
  const renderAdminWorkspace = () => {
    if (activeScreen === 'admin-dashboard') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">National visibility</div>
              <div className="text-sm font-semibold text-slate-800">Filter schools and laboratories by zone</div>
            </div>
            <select
              value={zoneFilter}
              onChange={(event) => setZoneFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold"
            >
              <option value="All">All 100 zones</option>
              {[...new Set(labs.map((lab) => lab.zone))].sort().map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Participating Schools
                </span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-blue-950 mt-2">
                {visibleSchools.length} Verified
              </div>
              <div className="text-xs text-blue-800 mt-1">Across all 9 Provinces in Sri Lanka</div>
            </div>

            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Shared Practical Hours
                </span>
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-2">1,480 hrs</div>
              <div className="text-xs text-emerald-800 mt-1">2026 Academic Term 3 National Total</div>
            </div>

            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Rural Equity Coverage
                </span>
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-950 mt-2">82.6%</div>
              <div className="text-xs text-amber-800 mt-1">Rural 1C schools paired with 1AB hubs</div>
            </div>

            <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  REST API Operations
                </span>
                <Server className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-extrabold text-indigo-950 mt-2">
                {auditLogs.length} Logged
              </div>
              <div className="text-xs text-indigo-800 mt-1">99.98% Express.js Service Uptime</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Provincial Laboratory Resource Utilization (Sri Lanka MoE)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Percentage of shared urban host laboratory capacity utilized by rural schools
              </p>
              <div className="space-y-3">
                {[
                  { prov: 'Western Province (Colombo / Gampaha / Kalutara)', pct: 88, sessions: 410 },
                  { prov: 'Central Province (Kandy / Matale / Nuwara Eliya)', pct: 81, sessions: 325 },
                  { prov: 'Southern Province (Galle / Matara / Hambantota)', pct: 79, sessions: 290 },
                  { prov: 'Northern Province (Jaffna / Vavuniya / Kilinochchi)', pct: 76, sessions: 215 },
                  { prov: 'Uva & Sabaragamuwa (Badulla / Monaragala / Ratnapura)', pct: 73, sessions: 240 }
                ].map((row) => (
                  <div key={row.prov}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{row.prov}</span>
                      <span className="text-blue-700">{row.pct}% ({row.sessions} Sessions)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Recent System Audit Feed</h3>
                <button
                  onClick={() => setActiveScreen('admin-audit')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Full Log →
                </button>
              </div>
              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{log.action}</span>
                      <span className="text-emerald-700">{log.status}</span>
                    </div>
                    <div className="text-slate-600 mt-0.5">{log.target}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {log.actor} ({log.role}) • {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'admin-schools') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              School Registration & MoE Census Verification Queue
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Verify 1AB Host Schools and Type 1C / Type 2 Rural Visiting Schools
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                    <th className="py-2.5 px-2">MoE Census ID</th>
                    <th className="py-2.5 px-2">School Name & Classification</th>
                    <th className="py-2.5 px-2">Province / Zone</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visibleSchools.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-2 font-mono font-bold text-blue-700">{s.censusId}</td>
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.type} • Coord: {s.coordinator}</div>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{s.province} ({s.zone})</td>
                      <td className="py-3 px-2">{renderBadge(s.status)}</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() =>
                            handleVerifySchool(
                              s.id,
                              s.status === 'Verified' ? 'Pending Verification' : 'Verified'
                            )
                          }
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                          {s.status === 'Verified' ? 'Re-Audit' : 'Verify School'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">Onboard New School</h3>
            <form onSubmit={handleAddSchool} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kuliyapitiya Central College"
                  value={newSchoolForm.name}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MoE Census Code</label>
                <input
                  type="text"
                  value={newSchoolForm.censusId}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, censusId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Classification</label>
                <select
                  value={newSchoolForm.type}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option>Type 1C Visiting School</option>
                  <option>1AB Host School</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Science Coordinator</label>
                <input
                  type="text"
                  placeholder="e.g., Mr. M. Perera"
                  value={newSchoolForm.coordinator}
                  onChange={(e) => setNewSchoolForm({ ...newSchoolForm, coordinator: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Register & Verify School
              </button>
            </form>
          </div>
        </div>
      );
    }

    if (activeScreen === 'admin-users') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            User Accounts & Role-Based Access Control (RBAC)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">User Name & Official Email</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Assigned School / Branch</th>
                  <th className="py-2.5 px-3">Account Status</th>
                  <th className="py-2.5 px-3 text-right">Permission Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700">{u.role}</td>
                    <td className="py-3 px-3 text-slate-700">{u.school}</td>
                    <td className="py-3 px-3">{renderBadge(u.active ? 'Operational' : 'Declined')}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setUsers((prev) =>
                            prev.map((item) =>
                              item.id === u.id ? { ...item, active: !item.active } : item
                            )
                          );
                          triggerApiAction(
                            'PATCH',
                            `/api/users/${u.id}/status`,
                            'Dr. R. Wijesinghe',
                            'System Admin',
                            `Toggled active status for ${u.name}`
                          );
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold"
                      >
                        {u.active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeScreen === 'admin-reference') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Master Provincial & Zonal Reference Data
            </h3>
            <div className="space-y-2 text-xs">
              {[
                'Western Province — Colombo, Gampaha, Kalutara (12 Education Zones)',
                'Central Province — Kandy, Matale, Nuwara Eliya (15 Education Zones)',
                'Southern Province — Galle, Matara, Hambantota (11 Education Zones)',
                'Northern Province — Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya',
                'Uva Province — Badulla, Monaragala (10 Education Zones)'
              ].map((z) => (
                <div key={z} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700">
                  {z}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              NIE Standard Science Practical Codes
            </h3>
            <div className="space-y-2 text-xs">
              {syllabus.map((s) => (
                <div key={s.code} className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex justify-between">
                  <div>
                    <span className="font-mono font-bold text-blue-700">{s.code}</span> — {s.title}
                  </div>
                  <span className="font-bold text-slate-700 shrink-0 ml-2">{s.requiredHours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeScreen === 'admin-audit') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Express API • GET /api/audit-logs
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Immutable Security & Express REST API Activity Log
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {auditLogs.length} Events Recorded
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3">Audit ID & Time</th>
                  <th className="py-2.5 px-3">Actor & Workspace Role</th>
                  <th className="py-2.5 px-3">Express API Route & Action</th>
                  <th className="py-2.5 px-3">Resource Target</th>
                  <th className="py-2.5 px-3">HTTP Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono text-slate-600">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div>{log.timestamp}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{log.actor}</div>
                      <div className="text-[11px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-700 font-semibold">{log.action}</td>
                    <td className="py-3 px-3 text-slate-700">{log.target}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Screen 18: Resource Utilization Analytics
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Practical Hours by Science Discipline
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Distribution of shared host laboratory sessions across GCE A/L & O/L subjects
          </p>
          <div className="space-y-4">
            {[
              { label: 'GCE A/L Chemistry (Volumetric, Organic, Physical)', hours: 540, pct: 38, color: 'bg-blue-600' },
              { label: 'GCE A/L Physics (Optics, Electronics, Mechanics)', hours: 460, pct: 32, color: 'bg-indigo-600' },
              { label: 'GCE A/L Biology (Microscopy, Physiology, Genetics)', hours: 290, pct: 20, color: 'bg-emerald-600' },
              { label: 'GCE O/L Science (Grades 10 & 11 Core Practicals)', hours: 190, pct: 10, color: 'bg-amber-500' }
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>{d.label}</span>
                  <span>{d.hours} hrs ({d.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              National Policy Impact Summary
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ministry of Education Sri Lanka — Rural Science Equity Outcomes
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-xs text-blue-700 font-bold">Rural Schools Served</div>
                <div className="text-xl font-extrabold text-blue-950 mt-1">142 Schools</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-700 font-bold">Avg Travel Distance</div>
                <div className="text-xl font-extrabold text-emerald-950 mt-1">9.4 km</div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-700 font-bold">Breakage Rate</div>
                <div className="text-xl font-extrabold text-amber-950 mt-1">0.8% Low</div>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="text-xs text-indigo-700 font-bold">A/L Practical Pass Rate</div>
                <div className="text-xl font-extrabold text-indigo-950 mt-1">+19.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // SCREEN 19: SHARED PORTAL & ALL 19 SCREENS DIRECTORY HUB
  // -------------------------------------------------------------------------
  const renderPortalOverview = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
          Screen 19 of 19 • Complete UI Suite Directory & Architecture Hub
        </span>
        <h2 className="text-xl font-extrabold mt-1">
          Lab Connect — 19 Desktop Screens, 4 Mobile Views & 3 Modals/Drawers
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Jump directly to any screen in the UI suite below, switch between the three role workspaces, or open the Mobile Companion and Express.js API Inspector.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { role: 'teacher', title: 'Science Teacher Workspace (6 Screens)', badge: 'Rural Visiting Schools' },
          { role: 'manager', title: 'Host School Lab Manager (6 Screens)', badge: 'Urban 1AB Host Labs' },
          { role: 'admin', title: 'System Administrator (6 Screens + Hub)', badge: 'Ministry of Education' }
        ].map((group) => (
          <div key={group.role} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase text-blue-600">{group.badge}</span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5 mb-3">{group.title}</h3>
            <div className="space-y-1.5">
              {ALL_SCREENS.filter((s) => s.role === group.role || (group.role === 'admin' && s.role === 'shared')).map(
                (scr) => (
                  <button
                    key={scr.id}
                    onClick={() => {
                      if (scr.role !== 'shared') setActiveRole(scr.role);
                      setActiveScreen(scr.id);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors"
                  >
                    <span>
                      <strong className="font-mono text-blue-600 mr-1.5">#{scr.code}</strong>
                      {scr.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans">
      {/* TOP MINISTRY & ROLE SWITCHER BAR */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <LabConnectLogo compact light />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                MoE Sri Lanka
              </span>
            </div>
          </div>

          {/* Right Utility Controls: Modals, API Drawer & Session */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDamageModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Incident</span>
            </button>

            <button
              onClick={() => setApiDrawerOpen(true)}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API & Alerts</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-extrabold">
                {auditLogs.length}
              </span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('labConnectToken');
                localStorage.removeItem('labConnectUser');
                setAuthUser(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-bold"
              title={`Signed in as ${authUser.email}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: DARK NAVY SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 flex w-full">
        {/* Dark Navy Navigation Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-64 pt-16' : 'hidden lg:flex lg:w-64'
          } bg-[#0F172A] text-slate-200 flex-col justify-between p-4 shrink-0 border-r border-slate-800`}
        >
          <div className="space-y-5">
            {/* Mobile Role Switcher inside Drawer */}
            <div className="md:hidden space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                Active Workspace Role
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl">
                {['teacher', 'manager', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`py-1 rounded-lg text-[11px] font-bold capitalize ${
                      activeRole === r ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Role Profile Summary */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {activeRole === 'teacher' && 'Visiting Rural School'}
                {activeRole === 'manager' && 'Urban 1AB Host School'}
                {activeRole === 'admin' && 'Ministry of Education'}
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {authUser.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {authUser.schoolName}
              </div>
            </div>

            {/* Role Navigation Links */}
            <nav className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
                Workspace Screens ({currentRoleScreens.length})
              </div>
              {currentRoleScreens.map((item) => {
                const Icon = item.icon;
                const active = activeScreen === item.id && viewportMode === 'desktop';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setViewportMode('desktop');
                      setActiveScreen(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-75">#{item.code}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Supporting Modal Triggers in Sidebar Footer */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              3 Supporting Modals & Drawers
            </div>
            <button
              onClick={() => setSelectedBookingModal(visibleBookings[0])}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center justify-between"
            >
              <span>1. QR Gate Pass Modal</span>
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={() => setDamageModalOpen(true)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center justify-between"
            >
              <span>2. Damage Incident Modal</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => setApiDrawerOpen(true)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center justify-between"
            >
              <span>3. Express API Drawer</span>
              <Server className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {viewportMode === 'mobile' ? (
            renderMobileAdaptationView()
          ) : (
            <>
              {/* Workspace Screen Header Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold">
                      Screen #{activeScreenMeta.code} of 19
                    </span>
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      {activeRole} Workspace
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {activeScreenMeta.label}
                  </h1>
                </div>

                {/* Quick 19-Screen Jumper Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={activeScreen}
                    onChange={(e) => {
                      const target = ALL_SCREENS.find((s) => s.id === e.target.value);
                      if (target) {
                        if (target.role !== 'shared') setActiveRole(target.role);
                        setActiveScreen(target.id);
                      }
                    }}
                    aria-label="Jump to any of the 19 screens"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                  >
                    {ALL_SCREENS.map((s) => (
                      <option key={s.id} value={s.id}>
                        Screen #{s.code}: {s.label} ({s.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Screen Content */}
              {activeScreen === 'portal-overview'
                ? renderPortalOverview()
                : activeRole === 'teacher'
                ? renderTeacherWorkspace()
                : activeRole === 'manager'
                ? renderManagerWorkspace()
                : renderAdminWorkspace()}
            </>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SUPPORTING MODAL 1: BOOKING DETAILS, PREP SHEET & DIGITAL QR PASS    */}
      {/* ------------------------------------------------------------------- */}
      {selectedBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Modal 1 • Booking Prep Sheet & Gate Pass
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedBookingModal.id} — {selectedBookingModal.hostSchool}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingModal(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="sm:col-span-2 space-y-1 text-xs">
                <div>
                  <span className="text-slate-500">Visiting School:</span>{' '}
                  <strong className="text-slate-900">{selectedBookingModal.visitingSchool}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Teacher & Batch:</span>{' '}
                  <strong className="text-slate-900">
                    {selectedBookingModal.teacherName} ({selectedBookingModal.studentsCount} Students)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Date & Window:</span>{' '}
                  <strong className="text-blue-700">
                    {selectedBookingModal.date} • {selectedBookingModal.slot}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Practical Unit:</span>{' '}
                  <strong className="text-slate-800">{selectedBookingModal.practicalUnit}</strong>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-900 text-white p-3 rounded-xl">
                <BookingQrCode booking={selectedBookingModal} user={authUser} size={112} />
                <span className="text-[10px] font-mono mt-1">{selectedBookingModal.id}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-1.5">
                Requested Apparatus & Preparation Checklist:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedBookingModal.equipmentRequested.map((eq) => (
                  <span
                    key={eq}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold"
                  >
                    ✓ {eq}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div>{renderBadge(selectedBookingModal.status)}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => downloadQrPass(selectedBookingModal.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  <Download className="w-3.5 h-3.5" /> Download QR Pass
                </button>
                {selectedBookingModal.status !== 'Approved' && (
                  <button
                    onClick={() => {
                      handleBookingStatus(selectedBookingModal.id, 'Approved');
                      setSelectedBookingModal({ ...selectedBookingModal, status: 'Approved' });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Approve Request
                  </button>
                )}
                <button
                  onClick={() => setSelectedBookingModal(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUPPORTING MODAL 2: EQUIPMENT DAMAGE & INCIDENT REPORT MODAL         */}
      {/* ------------------------------------------------------------------- */}
      {damageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Modal 2 • POST /api/damage-reports
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Report Apparatus Breakage or Incident
                </h3>
              </div>
              <button
                onClick={() => setDamageModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportDamage} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Host Laboratory</label>
                <select
                  value={damageForm.labName}
                  onChange={(e) => setDamageForm({ ...damageForm, labName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  {scopedLabs.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.hostSchool} — {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Damaged Apparatus / Glassware Name
                </label>
                <input
                  type="text"
                  required
                  value={damageForm.itemName}
                  onChange={(e) => setDamageForm({ ...damageForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Incident Severity</label>
                  <select
                    value={damageForm.severity}
                    onChange={(e) => setDamageForm({ ...damageForm, severity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Minor</option>
                    <option>Moderate</option>
                    <option>Repair Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Units Affected</label>
                  <input
                    type="number"
                    min="1"
                    value={damageForm.qtyAffected}
                    onChange={(e) => setDamageForm({ ...damageForm, qtyAffected: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bench Number & Incident Description
                </label>
                <textarea
                  rows={3}
                  value={damageForm.description}
                  onChange={(e) => setDamageForm({ ...damageForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDamageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Log Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUPPORTING DRAWER 3: EXPRESS.JS REST API & NOTIFICATIONS DRAWER     */}
      {/* ------------------------------------------------------------------- */}
      {apiDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 p-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Drawer 3 • Full-Stack Architecture Inspector
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Express.js REST API & Live Event Stream
                  </h3>
                </div>
                <button
                  onClick={() => setApiDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 text-xs space-y-1.5 font-mono">
                <div className="text-blue-400 font-bold">// Express.js Backend Endpoints Active</div>
                <div>GET    /api/labs?province=&amp;subject=</div>
                <div>POST   /api/bookings</div>
                <div>PATCH  /api/bookings/:id/status</div>
                <div>POST   /api/sessions</div>
                <div>POST   /api/damage-reports</div>
                <div>PATCH  /api/equipment/:id</div>
                <div>PATCH  /api/schools/:id/verify</div>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-800">
                  Live REST API Dispatches & Notifications ({auditLogs.length})
                </div>
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-blue-700 font-mono">
                      <span>{log.action}</span>
                      <span className="text-emerald-700">{log.status}</span>
                    </div>
                    <div className="text-slate-800 font-medium mt-1">{log.target}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {log.actor} ({log.role}) • {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setApiDrawerOpen(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Close Inspector Drawer
            </button>
          </div>
        </div>
      )}

      {/* NON-BLOCKING API TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="font-mono font-bold text-blue-300">{toastMessage.title}</div>
            <div className="text-slate-200 mt-0.5">{toastMessage.subtitle}</div>
          </div>
        </div>
      )}
    </div>
  );
}
