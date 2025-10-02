# Risk Analysis Tool

A comprehensive cybersecurity risk analysis tool built with Next.js, TypeScript, and Tailwind CSS, based on the NIST Cybersecurity Framework.

## Overview

This application provides a complete risk assessment solution that enables organizations to:

- **Identify and register cybersecurity threats**
- **Assess potential impacts across four dimensions** (Financial, Reputational, Operational, Regulatory)
- **Estimate likelihood of threats occurring** based on three key factors
- **Calculate total risk scores** using weighted impact and likelihood assessments
- **Define countermeasures** and calculate residual risk
- **Visualize risk data** through interactive dashboards and charts
- **Export results to Excel** for further analysis

## Features

### 🎯 Core Functionality

- **Threat Register**: Comprehensive threat identification and management
- **Impact Assessment**: Multi-dimensional impact evaluation with weighted scoring
- **Likelihood Assessment**: Three-factor likelihood estimation
- **Risk Calculation**: Automated risk scoring with color-coded results
- **Countermeasures**: Security control definition and residual risk calculation
- **Dashboard**: Interactive visualizations and risk statistics

### 📊 Visualizations

- Risk distribution pie charts
- Interactive risk matrix
- Risk level statistics
- Top risks prioritization
- NIST framework mapping

### 📈 Export Capabilities

- Complete Excel export with multiple sheets
- Risk matrix export
- Summary dashboard export
- All data preserved in structured format

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Charts**: Recharts
- **Icons**: Lucide React
- **Export**: XLSX library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd RiskAnalysisTool
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Threat Register

- Navigate to the Threat Register page
- Add new threats with detailed descriptions
- Categorize threats by type (Cloud, Access Control, etc.)
- Assign ownership and track status

### 2. Impact Assessment

- Select threats to assess
- Rate impact across four dimensions (1-5 scale):
  - **Financial Impact** (30% weight)
  - **Reputational Impact** (30% weight)
  - **Operational Impact** (20% weight)
  - **Regulatory Impact** (20% weight)
- View calculated weighted impact scores

### 3. Likelihood Assessment

- Evaluate three likelihood factors (1-5 scale):
  - **Threat Actor Capability**: Skills and resources of adversaries
  - **Opportunity**: Availability of vulnerabilities
  - **Historical Precedent**: Past incidents and patterns
- View calculated likelihood scores

### 4. Risk Calculation

- Automatic calculation of total risk scores
- Risk level classification (Low, Medium, High, Critical)
- Risk prioritization and filtering
- Color-coded risk visualization

### 5. Countermeasures

- Define security controls for each risk
- Map controls to NIST Cybersecurity Framework functions
- Specify implementation timelines and costs
- Calculate residual risk after controls
- Track effectiveness percentages (20-95%)

### 6. Dashboard

- Overview of all risk statistics
- Interactive charts and visualizations
- Risk matrix heatmap
- Top risks prioritization
- Export functionality

## NIST Cybersecurity Framework Integration

The tool is built around the five core functions of the NIST CSF:

1. **Identify**: Asset management and risk assessment
2. **Protect**: Access controls and security measures
3. **Detect**: Monitoring and anomaly detection
4. **Respond**: Incident response capabilities
5. **Recover**: Recovery planning and improvements

## Risk Scoring Methodology

### Impact Assessment Weights

- Financial Impact: 30%
- Reputational Impact: 30%
- Operational Impact: 20%
- Regulatory Impact: 20%

### Risk Level Thresholds

- **Critical**: 20-25 points (Immediate action required)
- **High**: 13-19 points (Priority mitigation needed)
- **Medium**: 6-12 points (Manageable with controls)
- **Low**: 1-5 points (Acceptable with monitoring)

### Likelihood Calculation

Average of three factors:

- Threat Actor Capability
- Opportunity
- Historical Precedent

### Total Risk Score

```
Total Risk = Weighted Impact Score × Likelihood Score
```

### Residual Risk Calculation

```
Residual Risk = Total Risk × (1 - Effectiveness%)
```

## Sample Data

The application includes sample data based on the Capital One data breach case study, demonstrating:

- Misconfigured Web Application Firewall
- Inadequate Privileged Access Management
- Insufficient Security Monitoring
- Poor Cloud Asset Management
- Insider Threat scenarios

## Export Features

### Excel Export

- **Threat Register**: Complete threat inventory
- **Impact Assessment**: All impact evaluations
- **Likelihood Assessment**: All likelihood evaluations
- **Risk Calculation**: Calculated risk scores and levels
- **Countermeasures**: Security controls and residual risks
- **Summary Dashboard**: Executive summary and statistics

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
├── data/               # Sample data and constants
├── types/              # TypeScript type definitions
└── utils/               # Utility functions
```

### Key Components

- `Navigation.tsx`: Main navigation component
- `RiskChart.tsx`: Risk distribution charts
- `RiskMatrix.tsx`: Risk matrix visualization
- `excelExport.ts`: Excel export functionality
- `riskCalculations.ts`: Risk calculation utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Note**: This tool is designed for educational and assessment purposes. Always consult with cybersecurity professionals for production risk assessments.
