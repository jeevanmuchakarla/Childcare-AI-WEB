import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import PrimaryButton from '../../components/common/PrimaryButton';

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  
  const [centerName, setCenterName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [certifications, setCertifications] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const [employeeId, setEmployeeId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const getTitle = () => {
    switch (role) {
      case 'parent': return 'Parent Registration';
      case 'preschool': return 'Preschool Provider Registration';
      case 'daycare': return 'Daycare Provider Registration';
      case 'admin': return 'Admin Registration';
      default: return 'Register';
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    const payload = {
      email,
      password,
      role: role.charAt(0).toUpperCase() + role.slice(1)
    };

    if (role === 'parent') {
      payload.full_name = fullName;
      payload.phone = phone;
      payload.child_name = childName;
      payload.child_age = childAge;
      payload.allergies = allergies;
      payload.medical_notes = medicalNotes;
      payload.emergency_contact = emergencyContact;
    } else if (role === 'preschool' || role === 'daycare') {
      payload.center_name = centerName;
      payload.full_name = fullName;
      payload.phone = phone;
      payload.license_number = licenseNumber;
      payload.address = address;
      payload.capacity = capacity;
      payload.opening_time = openingTime;
      payload.closing_time = closingTime;
      payload.certifications = certifications;
      payload.years_experience = parseInt(yearsExperience) || 0;
      payload.latitude = parseFloat(latitude) || 0;
      payload.longitude = parseFloat(longitude) || 0;
    } else if (role === 'admin') {
      payload.full_name = fullName;
      payload.employee_id = employeeId;
    }

    try {
      await authService.register(payload);
      setIsLoading(false);
      alert("Registration successful! You can now log in.");
      navigate(`/login/${role}`);
    } catch (error) {
      setIsLoading(false);
      const detail = error.response?.data?.detail;
      const formattedError = Array.isArray(detail) 
        ? detail.map(d => d.msg).join(", ") 
        : (typeof detail === 'object' ? JSON.stringify(detail) : detail);
        
      setErrorMessage(formattedError || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app-bg dark:bg-app-bg-dark ios-container pb-12">
      {/* Header */}
      <div className="py-4 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-8 mt-4">
          {getTitle()}
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Role-Specific Fields */}
          {role === 'parent' && (
            <>
              <Input label="Full Name" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Child's Name" placeholder="Child's Name" value={childName} onChange={(e) => setChildName(e.target.value)} />
              <Input label="Child's Age" placeholder="Select Age" value={childAge} onChange={(e) => setChildAge(e.target.value)} />
              <Input label="Allergies (None if none)" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
              <Input label="Medical Notes" placeholder="Medical Notes" value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} />
              <Input label="Emergency Contact Info" placeholder="Emergency Contact Info" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
            </>
          )}

          {(role === 'preschool' || role === 'daycare') && (
            <>
              <Input label="Center/School Name" placeholder="Center/School Name" value={centerName} onChange={(e) => setCenterName(e.target.value)} />
              <Input label="Contact Person Name" placeholder="Contact Person Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="State License Number" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
              <Input label="Address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
              <Input label="Capacity" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Opening Time" placeholder="08:00 AM" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                <Input label="Closing Time" placeholder="05:00 PM" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
              </div>
              <Input label="Years of Experience" placeholder="Years of Experience" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
              <Input label="Certifications" placeholder="e.g. CPR, First Aid" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Latitude" placeholder="e.g. 13.08" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                <Input label="Longitude" placeholder="e.g. 80.27" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <Input label="Full Name" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Email" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Employee ID" placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
            </>
          )}

          <Input label="Password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {/* Terms */}
          <div className="flex items-start space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setAgreeToTerms(!agreeToTerms)}
              className={`
                mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors
                ${agreeToTerms ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}
              `}
            >
              {agreeToTerms && <Check size={14} className="text-white" />}
            </button>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              I agree to the <span className="text-primary font-bold">Terms of Service</span> and <span className="text-primary font-bold">Privacy Policy</span>
            </p>
          </div>

          <div className="pt-6 space-y-5">
            {errorMessage && (
              <p className="text-sm font-medium text-red-500 text-center">
                {errorMessage}
              </p>
            )}
            
            <PrimaryButton
              title="Create Account"
              isLoading={isLoading}
              disabled={!email || !password || !agreeToTerms}
              type="submit"
            />

            <div className="flex items-center justify-center space-x-1">
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark font-medium">
                Already have an account?
              </p>
              <button 
                type="button"
                className="text-sm font-bold text-primary hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/login/${role}`)}
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
