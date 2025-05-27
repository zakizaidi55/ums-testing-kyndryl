const testData = {
  personalDetails: {
    program: 'MCOM',
    elective: 'Public Accounting',
    nationality: 'Indian',
    currentLocation: 'India',
    category: 'General',
    countryOfResidence: 'India',
    state: 'Meghalaya',
    city: 'East Garo Hills',
    highestEducation: 'B.A',
    countryOfEducation: 'India',
    locationOfCollege: 'Delhi',
    currentEducation: 'UG',
    percentage: '75',
    currentCollege: 'Others',
    abcId: '123456789012',
    debId: '123412341234',
    nameAsPerDEB: 'Test Name',
    email: 'test@example.com',
    gender: 'Male',
    phoneNumber: '9876543210',
    dateOfBirth: '01-01-2000'
  },

  kycDetails: {
    aadhaarNumber: '397788000234',
    nameAsPerAadhaar: 'John Doe',
    motherTongue: 'Hindi',
    maritalStatus: 'Single',
    bloodGroup: 'A+',
    fatherName: 'Robert Doe',
    fatherOccupation: 'Engineer',
    motherName: 'Jane Doe',
    motherOccupation: 'Teacher',
    guardianName: 'Uncle Ben',
    guardianPhone: '9876543210',
    correspondenceAddress: {
      addressLine1: '123 Street',
      addressLine2: 'Apt 456',
      pincode: '560001'
    },
    permanentAddress: {
      addressLine1: '123 Street',
      addressLine2: 'Apt 456',
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      pincode: '560001'
    }
  },

  educationDetails: {
    class10: {
      schoolName: 'LPU',
      board: 'Aligarh Muslim University',
      yearOfPassing: '2022',
      markingScheme: 'Outstanding',
      percentage: '90.8'
    },
    class12: {
      schoolName: 'LPPP',
      board: 'Aligarh Muslim University',
      yearOfPassing: '2024',
      markingScheme: 'Outstanding',
      percentage: '89.7'
    },
    undergraduate: {
      resultStatus: 'Declared',
      collegeName: 'DTU',
      university: 'Delhi University',
      degree: 'B.Com',
      yearOfPassing: '2024',
      percentage: '9.4'
    }
  },

  documents: {
    passportPhoto: './documents/photograph.pdf',
    proofOfDOB: './documents/dob.pdf',
    class10MarkSheet: './documents/marksheet10.pdf',
    class12MarkSheet: './documents/marksheet12.pdf',
    kycDocument: './documents/Kyc.pdf',
    abcIdCard: './documents/ABC id.pdf',
    degreeCertificate: './documents/degree.pdf',
    consolidatedMarkSheet: './documents/consolidated.pdf',
    casteCertificate: './documents/caste cert.pdf',
    otherSupportingDocument: './documents/other supporting.pdf'
  },

  credentials: {
    newPassword: 'Pass@123'
  }
};

// Function to get random test data variations
const getRandomTestData = () => {
  const variations = {
    programs: ['MCOM', 'MBA', 'BBA'],
    electives: ['Public Accounting', 'Finance', 'Marketing'],
    states: ['Meghalaya', 'Karnataka', 'Delhi', 'Maharashtra'],
    cities: ['East Garo Hills', 'Bengaluru', 'Mumbai', 'Pune'],
    educationLevels: ['B.A', 'B.Com', 'B.Sc', 'B.Tech'],
    genders: ['Male', 'Female'],
    bloodGroups: ['A+', 'B+', 'O+', 'AB+']
  };

  return {
    ...testData,
    personalDetails: {
      ...testData.personalDetails,
      program: variations.programs[Math.floor(Math.random() * variations.programs.length)],
      elective: variations.electives[Math.floor(Math.random() * variations.electives.length)],
      state: variations.states[Math.floor(Math.random() * variations.states.length)],
      city: variations.cities[Math.floor(Math.random() * variations.cities.length)],
      highestEducation: variations.educationLevels[Math.floor(Math.random() * variations.educationLevels.length)],
      gender: variations.genders[Math.floor(Math.random() * variations.genders.length)]
    },
    kycDetails: {
      ...testData.kycDetails,
      bloodGroup: variations.bloodGroups[Math.floor(Math.random() * variations.bloodGroups.length)]
    }
  };
};

module.exports = {
  testData,
  getRandomTestData
}; 