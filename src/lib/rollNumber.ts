/**
 * College Roll Number Validation and Parsing Utility
 *
 * Rules:
 * • Roll number must be EXACTLY 13 digits.
 * • First 2 digits: Admission/Session year (e.g., 24 for 2024). Must be after 2023 (i.e. >= 24)
 * • Next 3 to 4 digits: College / Institute code (Our college code is 192 or 0192)
 * • Next 2 to 3 digits: Course and Branch code (from allowed branch list)
 * • Last digits: Unique student serial number (e.g., 001, 042, etc.)
 */

export interface BranchInfo {
  code: string;
  shortCode: string;
  name: string;
  category: 'CS_IT' | 'ELECTRICAL_ELECTRONICS' | 'MECHANICAL_CIVIL' | 'CHEMICAL_BIO_ALLIED';
}

export const VALID_BRANCHES: Record<string, BranchInfo> = {
  // Computer Science & IT
  '010': { code: '010', shortCode: 'CSE', name: 'Computer Science and Engineering (CSE)', category: 'CS_IT' },
  '10': { code: '010', shortCode: 'CSE', name: 'Computer Science and Engineering (CSE)', category: 'CS_IT' },
  '011': { code: '011', shortCode: 'CSIT', name: 'Computer Science and Information Technology', category: 'CS_IT' },
  '11': { code: '011', shortCode: 'CSIT', name: 'Computer Science and Information Technology', category: 'CS_IT' },
  '012': { code: '012', shortCode: 'CS', name: 'Computer Science', category: 'CS_IT' },
  '12': { code: '012', shortCode: 'CS', name: 'Computer Science', category: 'CS_IT' },
  '013': { code: '013', shortCode: 'IT', name: 'Information Technology (IT)', category: 'CS_IT' },
  '13': { code: '013', shortCode: 'IT', name: 'Information Technology (IT)', category: 'CS_IT' },
  '015': { code: '015', shortCode: 'COE', name: 'Computer Engineering', category: 'CS_IT' },
  '15': { code: '015', shortCode: 'COE', name: 'Computer Engineering', category: 'CS_IT' },
  '067': { code: '067', shortCode: 'CS-CYBER', name: 'CSE (Cyber Security / ICT)', category: 'CS_IT' },
  '67': { code: '067', shortCode: 'CS-CYBER', name: 'CSE (Cyber Security / ICT)', category: 'CS_IT' },
  '116': { code: '116', shortCode: 'AI', name: 'Artificial Intelligence (AI)', category: 'CS_IT' },

  // Electrical & Electronics
  '020': { code: '020', shortCode: 'EE', name: 'Electrical Engineering (EE)', category: 'ELECTRICAL_ELECTRONICS' },
  '20': { code: '020', shortCode: 'EE', name: 'Electrical Engineering (EE)', category: 'ELECTRICAL_ELECTRONICS' },
  '021': { code: '021', shortCode: 'EEE', name: 'Electrical & Electronics Engineering (EN / EEE)', category: 'ELECTRICAL_ELECTRONICS' },
  '21': { code: '021', shortCode: 'EEE', name: 'Electrical & Electronics Engineering (EN / EEE)', category: 'ELECTRICAL_ELECTRONICS' },
  '030': { code: '030', shortCode: 'EL', name: 'Electronics Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '30': { code: '030', shortCode: 'EL', name: 'Electronics Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '031': { code: '031', shortCode: 'ECE', name: 'Electronics and Communication Engineering (ECE)', category: 'ELECTRICAL_ELECTRONICS' },
  '31': { code: '031', shortCode: 'ECE', name: 'Electronics and Communication Engineering (ECE)', category: 'ELECTRICAL_ELECTRONICS' },
  '032': { code: '032', shortCode: 'EIE', name: 'Electronics and Instrumentation Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '32': { code: '032', shortCode: 'EIE', name: 'Electronics and Instrumentation Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '033': { code: '033', shortCode: 'ETE', name: 'Electronics and Telecommunication Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '33': { code: '033', shortCode: 'ETE', name: 'Electronics and Telecommunication Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '034': { code: '034', shortCode: 'EIC', name: 'Electronics, Instrumentation, and Control Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '34': { code: '034', shortCode: 'EIC', name: 'Electronics, Instrumentation, and Control Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '035': { code: '035', shortCode: 'AEIE', name: 'Applied Electronics and Instrumentation Engineering', category: 'ELECTRICAL_ELECTRONICS' },
  '35': { code: '035', shortCode: 'AEIE', name: 'Applied Electronics and Instrumentation Engineering', category: 'ELECTRICAL_ELECTRONICS' },

  // Mechanical & Civil
  '000': { code: '000', shortCode: 'CE', name: 'Civil Engineering (CE)', category: 'MECHANICAL_CIVIL' },
  '00': { code: '000', shortCode: 'CE', name: 'Civil Engineering (CE)', category: 'MECHANICAL_CIVIL' },
  '040': { code: '040', shortCode: 'ME', name: 'Mechanical Engineering (ME)', category: 'MECHANICAL_CIVIL' },
  '40': { code: '040', shortCode: 'ME', name: 'Mechanical Engineering (ME)', category: 'MECHANICAL_CIVIL' },
  '043': { code: '043', shortCode: 'MIE', name: 'Mechanical and Industrial Engineering', category: 'MECHANICAL_CIVIL' },
  '43': { code: '043', shortCode: 'MIE', name: 'Mechanical and Industrial Engineering', category: 'MECHANICAL_CIVIL' },
  '044': { code: '044', shortCode: 'PE', name: 'Production Engineering', category: 'MECHANICAL_CIVIL' },
  '44': { code: '044', shortCode: 'PE', name: 'Production Engineering', category: 'MECHANICAL_CIVIL' },
  '047': { code: '047', shortCode: 'AE', name: 'Automobile Engineering', category: 'MECHANICAL_CIVIL' },
  '47': { code: '047', shortCode: 'AE', name: 'Automobile Engineering', category: 'MECHANICAL_CIVIL' },
  '048': { code: '048', shortCode: 'AERO', name: 'Aeronautical Engineering', category: 'MECHANICAL_CIVIL' },
  '48': { code: '048', shortCode: 'AERO', name: 'Aeronautical Engineering', category: 'MECHANICAL_CIVIL' },
  '075': { code: '075', shortCode: 'ROBO', name: 'Automation and Robotics', category: 'MECHANICAL_CIVIL' },
  '75': { code: '075', shortCode: 'ROBO', name: 'Automation and Robotics', category: 'MECHANICAL_CIVIL' },

  // Chemical, Bio & Allied Technologies
  '007': { code: '007', shortCode: 'MN', name: 'Mining Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '07': { code: '007', shortCode: 'MN', name: 'Mining Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '049': { code: '049', shortCode: 'PE', name: 'Petroleum Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '49': { code: '049', shortCode: 'PE', name: 'Petroleum Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '051': { code: '051', shortCode: 'CHE', name: 'Chemical Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '51': { code: '051', shortCode: 'CHE', name: 'Chemical Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '052': { code: '052', shortCode: 'CBE', name: 'Chemical & Bio Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '52': { code: '052', shortCode: 'CBE', name: 'Chemical & Bio Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '054': { code: '054', shortCode: 'BT', name: 'Biotechnology', category: 'CHEMICAL_BIO_ALLIED' },
  '54': { code: '054', shortCode: 'BT', name: 'Biotechnology', category: 'CHEMICAL_BIO_ALLIED' },
  '059': { code: '059', shortCode: 'MAR', name: 'Marine Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '59': { code: '059', shortCode: 'MAR', name: 'Marine Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '080': { code: '080', shortCode: 'AGRI', name: 'Agricultural Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '80': { code: '080', shortCode: 'AGRI', name: 'Agricultural Engineering', category: 'CHEMICAL_BIO_ALLIED' },
  '082': { code: '082', shortCode: 'FT', name: 'Food Technology', category: 'CHEMICAL_BIO_ALLIED' },
  '82': { code: '082', shortCode: 'FT', name: 'Food Technology', category: 'CHEMICAL_BIO_ALLIED' },
};

export interface RollNumberValidationResult {
  isValid: boolean;
  error?: string;
  cleanRollNumber: string;
  admissionYear?: number;
  yearTwoDigits?: string;
  collegeCode?: string;
  branchCode?: string;
  branchName?: string;
  branchShortCode?: string;
  serialNumber?: string;
  calculatedYear?: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
}

/**
 * Validates a college roll number string according to the official format.
 * Roll number MUST be exactly 13 digits.
 */
export function validateRollNumber(rawInput: string): RollNumberValidationResult {
  const clean = rawInput.trim().toUpperCase().replace(/[^0-9]/g, '');

  if (!clean) {
    return { isValid: false, cleanRollNumber: clean, error: 'Roll number cannot be empty.' };
  }

  // STRICT: Roll number must be exactly 13 digits
  if (clean.length !== 13) {
    return {
      isValid: false,
      cleanRollNumber: clean,
      error: `Roll number must be exactly 13 digits. You entered ${clean.length} digit(s).`
    };
  }

  // 1. First 2 digits: Admission Year
  const yearDigits = clean.substring(0, 2);
  const yearNum = parseInt(yearDigits, 10);
  if (isNaN(yearNum) || yearNum < 24) {
    return {
      isValid: false,
      cleanRollNumber: clean,
      error: `Admission year must be after 2023 (e.g. 24 for 2024, 25 for 2025). Found '${yearDigits}'.`
    };
  }
  const fullAdmissionYear = 2000 + yearNum;

  // 2. Next digits: College Code (Must be '192' or '0192')
  let remaining = clean.substring(2);
  let collegeCode = '';

  if (remaining.startsWith('0192')) {
    collegeCode = '0192';
    remaining = remaining.substring(4);
  } else if (remaining.startsWith('192')) {
    collegeCode = '192';
    remaining = remaining.substring(3);
  } else {
    return {
      isValid: false,
      cleanRollNumber: clean,
      error: `Invalid College Code. Our college code is 192. Roll number must contain '192' after year '${yearDigits}'.`
    };
  }

  // 3. Next digits: Branch Code (check 3-digit first, then 2-digit)
  let matchedBranch: BranchInfo | null = null;
  let matchedBranchCode = '';
  let serialNumber = '';

  // Try 3-digit branch code
  if (remaining.length >= 4) {
    const candidate3 = remaining.substring(0, 3);
    if (VALID_BRANCHES[candidate3]) {
      matchedBranch = VALID_BRANCHES[candidate3];
      matchedBranchCode = candidate3;
      serialNumber = remaining.substring(3);
    }
  }

  // If not matched, try 2-digit branch code
  if (!matchedBranch && remaining.length >= 3) {
    const candidate2 = remaining.substring(0, 2);
    if (VALID_BRANCHES[candidate2]) {
      matchedBranch = VALID_BRANCHES[candidate2];
      matchedBranchCode = candidate2;
      serialNumber = remaining.substring(2);
    }
  }

  if (!matchedBranch) {
    return {
      isValid: false,
      cleanRollNumber: clean,
      error: `Unrecognized branch code in roll number. Please verify your engineering branch code.`
    };
  }

  // 4. Last digits: Serial number
  if (!serialNumber || serialNumber.length < 1) {
    return {
      isValid: false,
      cleanRollNumber: clean,
      error: `Roll number is missing the student serial digits at the end.`
    };
  }

  // Calculate study year
  let calculatedYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' = '3rd Year';
  const currentYear = new Date().getFullYear();
  const diff = currentYear - fullAdmissionYear;
  if (diff <= 0) calculatedYear = '1st Year';
  else if (diff === 1) calculatedYear = '2nd Year';
  else if (diff === 2) calculatedYear = '3rd Year';
  else calculatedYear = '4th Year';

  return {
    isValid: true,
    cleanRollNumber: clean,
    admissionYear: fullAdmissionYear,
    yearTwoDigits: yearDigits,
    collegeCode,
    branchCode: matchedBranch.code,
    branchName: matchedBranch.name,
    branchShortCode: matchedBranch.shortCode,
    serialNumber,
    calculatedYear
  };
}

/**
 * Password validation rules:
 * - 6-12 characters
 * - At least 1 uppercase letter
 * - At least 1 digit (numeral)
 * - Special characters are NOT compulsory (allowed but not required)
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }
  if (password.length > 12) {
    errors.push('Password must be at most 12 characters.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must include at least one uppercase letter (A-Z).');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must include at least one numeral (0-9).');
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    errors.push('No special characters allowed. Use only letters and numerals.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Phone number validation: exactly 10 digits
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string; clean: string } {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length !== 10) {
    return { isValid: false, error: `Phone number must be exactly 10 digits. You entered ${clean.length} digit(s).`, clean };
  }
  return { isValid: true, clean };
}

export const SECURITY_QUESTIONS = [
  'What is the name of the first school you attended?',
  'What is your childhood pet / nickname?',
  'What is your mother\'s maiden city?',
  'What is your favorite hobby or sports team?',
  'What is your favorite movie or childhood crush name?'
];
