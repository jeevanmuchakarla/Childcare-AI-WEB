import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Building2, ShieldCheck, Home } from 'lucide-react';
import RoleCard from '../../components/common/RoleCard';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [showProviderOptions, setShowProviderOptions] = useState(false);

  const roles = [
    {
      id: 'parent',
      title: 'Parent',
      subtitle: 'Find & book trusted childcare',
      icon: Users,
      color: '#00A3FF',
    },
    {
      id: 'provider',
      title: 'Childcare Providers',
      subtitle: 'Daycares & Preschools',
      icon: Building2,
      color: '#20C997',
      isExpandable: true,
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      subtitle: 'Manage users & analytics',
      icon: ShieldCheck,
      color: '#8B5CF6',
    }
  ];

  const handleRoleSelect = (roleId) => {
    if (roleId === 'provider') {
      setShowProviderOptions(!showProviderOptions);
    } else {
      navigate(`/login/${roleId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg dark:bg-app-bg-dark ios-container">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Icon */}
        <div className="w-[50px] h-[50px] bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-premium">
          <div className="text-white font-black text-2xl">B</div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
            Welcome to<br />ChildCare AI
          </h1>
          <p className="text-text-secondary dark:text-text-secondary-dark font-medium">
            Choose how you'd like to continue
          </p>
        </div>

        {/* Role Buttons */}
        <div className="w-full space-y-4">
          {roles.map((role, index) => (
            <div key={role.id} className="w-full">
              <div
                className="transform transition-all"
                style={{ opacity: 1 }}
              >
                <RoleCard
                  title={role.title}
                  subtitle={role.subtitle}
                  icon={role.icon}
                  color={role.color}
                  onClick={() => handleRoleSelect(role.id)}
                />
              </div>

              {role.id === 'provider' && showProviderOptions && (
                <div className="pl-8 space-y-3 mt-3">
                  <RoleCard
                    title="Preschool Provider"
                    subtitle="Early childhood education"
                    icon={GraduationCap}
                    color="#FF8C00"
                    onClick={() => navigate('/login/preschool')}
                  />
                  <RoleCard
                    title="Daycare Provider"
                    subtitle="Full-day professional care"
                    icon={Home}
                    color="#20C997"
                    onClick={() => navigate('/login/daycare')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-[10px] space-y-1">
          <p className="text-text-secondary dark:text-text-secondary-dark">
            By continuing, you agree to our 
            <span className="text-primary font-bold ml-1 cursor-pointer">Terms & Conditions</span>
          </p>
          <p className="text-primary font-bold cursor-pointer">Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
