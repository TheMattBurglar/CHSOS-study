# EHR Simulation Interface for Nurse Training

A professional, web-based Electronic Health Record (EHR) simulation interface designed for nursing students to practice documentation and workflow skills in realistic clinical scenarios.

## Features

### Six Comprehensive EHR Sections

1. **Patient Demographics**
   - Complete patient information (MRN, name, DOB, contact details)
   - Emergency contact information
   - Allergy documentation with severity indicators
   - Code status tracking
   - Insurance information

2. **Vital Signs**
   - Record BP, HR, RR, Temperature, SpO2
   - Pain assessment (0-10 scale with location)
   - Weight/Height with automatic BMI calculation
   - Vital signs history table
   - Multiple temperature routes and O2 delivery methods

3. **Medication Administration Record (MAR)**
   - Add medications with dose, route, frequency
   - Medication administration tracking
   - Site rotation for injections
   - Administration log with nurse initials
   - PRN and scheduled medication support

4. **Nursing Assessments**
   - Head-to-toe assessment forms
   - System-specific assessments:
     - Neurological (LOC, pupils, motor function)
     - Cardiovascular (heart sounds, pulses, edema)
     - Respiratory (lung sounds, oxygen needs)
     - Gastrointestinal (bowel sounds, diet tolerance)
     - Genitourinary (urine output, catheter care)
     - Integumentary (skin integrity, wounds)
     - Musculoskeletal (mobility, fall risk)

5. **Care Plans & Interventions**
   - Nursing diagnosis selection
   - Patient goals (short-term and long-term)
   - Planned interventions
   - Active care plan tracking
   - NANDA-approved diagnoses

6. **Communication & Handoff Tools**
   - SBAR (Situation, Background, Assessment, Recommendation) format
   - Shift report documentation
   - Communication log
   - Provider and family communication tracking

7. **Patient Database & Search**
   - **100+ Pre-loaded Patients**: Diverse database with San Antonio demographics.
   - **Search Functionality**: Find patients by MRN or Account Number.
   - **Auto-Clear**: Session data automatically clears when loading a new patient.

### Technical Features

- **Data Persistence**: All data automatically saves to browser localStorage
- **Auto-Save**: Changes are saved automatically as you type
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Interface**: Clean, clinical design matching real EHR systems
- **Print-Friendly**: Documentation can be printed for review
- **No Server Required**: Runs entirely in the browser as a static web application

## Getting Started

### Installation

No installation required! Simply open `index.html` in any modern web browser.

### Usage

1. Open `index.html` in your web browser
2. **Search for a Patient**: Enter an MRN (e.g., `S1234567`) or Account # in the top search bar.
3. Navigate between sections using the tab buttons at the top
4. Fill in patient information, vital signs, medications, assessments, etc.
5. **BCMA Simulation**: In the Medication tab, use "Scan to Give" to simulate barcode scanning validation.
6. All data is automatically saved to your browser
7. Data persists between sessions (until browser cache is cleared or a new patient is loaded)

### For Simulation Training

**Instructors can:**
- Use the pre-loaded `patients.js` database for consistent scenarios
- Assign specific MRNs to students
- Review student documentation by having them share screenshots or print output
- Reset scenarios by reloading the patient

**Students can:**
- Practice realistic EHR documentation
- Learn proper nursing assessment documentation
- Practice SBAR communication
- Develop medication administration recording skills with **BCMA validation**
- Build care plans based on patient scenarios

## File Structure

```
Medi-Sim/
├── index.html      # Main application structure
├── style.css       # Professional medical interface styling
├── script.js       # Interactive functionality and data management
├── patients.js     # Database of 100+ simulated patients
└── README.md       # This file
```

## Browser Compatibility

Works with all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- ✅ No internet connection required
- ✅ Data persists between sessions
- ✅ Complete privacy (no data sent to servers)
- ⚠️ Data is tied to the browser/device used
- ⚠️ Loading a new patient CLEARS the current session data

## Customization

To customize for your simulation center:
- **Add/Edit Patients**: Modify `patients.js` to add new scenarios or change demographics.
- Modify nursing diagnoses list (lines 617-628 in index.html)
- Adjust color scheme in style.css (lines 5-21, CSS custom properties)
- Add custom fields as needed

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

For questions or issues, please contact the development team.

---

**Made for nursing education** 🏥💙
