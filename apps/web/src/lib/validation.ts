// Validation utilities for application forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Common validation functions
export const validators = {
  required: (value: any, fieldName: string): ValidationError | null => {
    if (!value || value.toString().trim() === '') {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  },

  email: (email: string): ValidationError | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    return null;
  },

  phone: (phone: string): ValidationError | null => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return { field: 'phone', message: 'Please enter a valid 10-digit phone number' };
    }
    return null;
  },

  aadhaar: (aadhaar: string): ValidationError | null => {
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaar.replace(/\s/g, ''))) {
      return { field: 'aadhaar', message: 'Aadhaar must be 12 digits' };
    }
    return null;
  },

  pincode: (pincode: string): ValidationError | null => {
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return { field: 'pincode', message: 'Pincode must be 6 digits' };
    }
    return null;
  },

  age: (age: number): ValidationError | null => {
    if (age < 0 || age > 120) {
      return { field: 'age', message: 'Please enter a valid age' };
    }
    return null;
  },

  income: (income: number): ValidationError | null => {
    if (income < 0) {
      return { field: 'income', message: 'Income cannot be negative' };
    }
    return null;
  },

  file: (file: File, maxSize: number = 5 * 1024 * 1024, allowedTypes: string[] = []): ValidationError | null => {
    if (file.size > maxSize) {
      return { 
        field: 'file', 
        message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` 
      };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { 
        field: 'file', 
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    return null;
  }
};

// Application form validation
export const validateApplicationForm = (formData: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Personal information validation
  const requiredFields = [
    'fullName', 'aadhaarNumber', 'phone', 'age', 'gender',
    'address.state', 'address.district', 'address.village', 'address.pincode'
  ];

  requiredFields.forEach(field => {
    const value = field.includes('.') ? 
      field.split('.').reduce((obj, key) => obj?.[key], formData) :
      formData[field];
    
    const error = validators.required(value, field.replace('.', ' '));
    if (error) errors.push(error);
  });

  // Email validation
  if (formData.email) {
    const error = validators.email(formData.email);
    if (error) errors.push(error);
  }

  // Phone validation
  const phoneError = validators.phone(formData.phone);
  if (phoneError) errors.push(phoneError);

  // Aadhaar validation
  const aadhaarError = validators.aadhaar(formData.aadhaarNumber);
  if (aadhaarError) errors.push(aadhaarError);

  // Pincode validation
  const pincodeError = validators.pincode(formData.address.pincode);
  if (pincodeError) errors.push(pincodeError);

  // Age validation
  const ageError = validators.age(formData.age);
  if (ageError) errors.push(ageError);

  // Income validation
  if (formData.income !== undefined) {
    const incomeError = validators.income(formData.income);
    if (incomeError) errors.push(incomeError);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Document validation
export const validateDocument = (file: File, documentType: string): ValidationResult => {
  const errors: ValidationError[] = [];

  // Define allowed file types per document type
  const allowedTypesByType: Record<string, string[]> = {
    'aadhaar': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    'income_certificate': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    'ration_card': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    'property_document': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    'medical_certificate': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  };

  const allowedTypes = allowedTypesByType[documentType] || [];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const fileError = validators.file(file, maxSize, allowedTypes);
  if (fileError) errors.push(fileError);

  return {
    isValid: errors.length === 0,
    errors
  };
};
