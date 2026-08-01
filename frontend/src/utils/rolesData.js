export const ALL_ROLES = {
  "Technical Roles (10)": [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", 
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "AI/ML Engineer", 
    "Mobile App Developer", "Software Engineer"
  ],
  "Civil Services (5)": [
    "UPSC Civil Services (IAS/IPS/IFS)", "State PSC (GPSC, MPSC, UPPSC, BPSC, RPSC)", 
    "SSC CGL", "SSC CHSL", "SSC MTS"
  ],
  "Banking (6)": [
    "IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "RBI Grade B", "RBI Assistant"
  ],
  "Railway (5)": [
    "RRB NTPC", "RRB Group D", "RRB JE", "RRB ALP", "RPF Constable/SI"
  ],
  "Teaching (5)": [
    "CTET", "State TET (UPTET, REET, HTET, MP TET, Gujarat TET)", "KVS", "NVS", "DSSSB"
  ],
  "Police & Defence (7)": [
    "Police Constable", "Police SI", "CAPF", "CDS", "AFCAT", "NDA", "Forest Guard"
  ],
  "Medical & Health (4)": [
    "NEET PG", "AIIMS Nursing", "Pharmacist", "Lab Technician"
  ],
  "Insurance & Finance (4)": [
    "LIC AAO", "LIC ADO", "GIC Assistant Manager", "NIACL Assistant"
  ],
  "Engineering (6)": [
    "GATE", "IES", "State Engineering Services", "PSU Exams (BHEL, SAIL, NTPC, ONGC)", 
    "Junior Engineer", "Assistant Engineer"
  ],
  "Other Popular Exams (10)": [
    "SSC JE", "SSC Stenographer", "IBPS SO", "RBI Grade B DEPR", "SEBI Grade A", 
    "NABARD Grade A", "FCI Manager", "DDA", "PWD Exams", "State Government Exams (All States)"
  ]
};

export const FLAT_ROLES_LIST = Object.values(ALL_ROLES).flat();