import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Users, GraduationCap, Building2, ShieldCheck } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import PrimaryButton from '../../components/common/PrimaryButton';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login: performUserLogin } = useUser();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getRoleConfig = () => {
    switch (role) {
      case 'parent':
        return { title: 'Parent Login', subtitle: 'Access your childcare portal', icon: Users, color: '#00A3FF' };
      case 'preschool':
        return { title: 'Preschool Login', subtitle: 'Manage your early education center', icon: GraduationCap, color: '#FF8C00' };
      case 'daycare':
        return { title: 'Daycare Login', subtitle: 'Manage your daycare center', icon: Building2, color: '#20C997' };
      case 'admin':
        return { title: 'Admin Login', subtitle: 'Platform administration', icon: ShieldCheck, color: '#8B5CF6' };
      default:
        return { title: 'Login', subtitle: 'Sign in to your account', icon: Users, color: '#00A3FF' };
    }
  };

  const config = getRoleConfig();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const data = await performUserLogin(email, password);
      
      if (data.status === "pending_approval") {
        alert("Your account is pending approval by an admin.");
        setIsLoading(false);
        return;
      }

      if (data.user.role.toLowerCase() !== role.toLowerCase()) {
        setErrorMessage(`This account is registered as '${data.user.role}', not '${role}'.`);
        setIsLoading(false);
        authService.logout();
        return;
      }

      navigate(`/${role}/dashboard`);
    } catch (error) {
      setIsLoading(false);
      const detail = error.response?.data?.detail;
      const formattedError = Array.isArray(detail) 
        ? detail.map(d => d.msg).join(", ") 
        : (typeof detail === 'object' ? JSON.stringify(detail) : detail);

      setErrorMessage(formattedError || "Login failed. Please check your credentials.");
    }
  };

  const Character = ({ type, x, y, size = "large" }) => {
    const charRef = React.useRef(null);
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      if (charRef.current) {
        const rect = charRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(y - centerY, x - centerX);
        const dist = Math.min(6, Math.hypot(x - centerX, y - centerY) / 50);
        
        setEyePos({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist
        });

        // Subtle body lean
        setRotation((x - centerX) / 100);
      }
    }, [x, y]);

    const isChild = type === 'child';
    const skinColor = "#FFE0BD";
    const hairColor = isChild ? "#78350F" : "#1F2937";

    return (
      <motion.div 
        ref={charRef}
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="relative"
        style={{ width: isChild ? 160 : 200, height: isChild ? 200 : 260 }}
      >
        {/* Hair */}
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-[90%] h-32 rounded-t-[60px]"
          style={{ backgroundColor: hairColor }}
        />
        
        {/* Face */}
        <div 
          className="absolute inset-x-0 bottom-0 top-4 rounded-[40px] border-4 border-black/5 shadow-xl flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: skinColor }}
        >
          {/* Eyes */}
          <div className="flex space-x-6 mb-10">
            {[1, 2].map(i => (
              <div key={i} className="w-8 h-8 bg-white rounded-full flex items-center justify-center relative shadow-inner">
                <motion.div 
                  animate={{ x: eyePos.x, y: eyePos.y }}
                  className="w-4 h-4 bg-slate-900 rounded-full"
                />
              </div>
            ))}
          </div>

          {/* Cheeks */}
          <div className="absolute top-1/2 left-4 w-6 h-4 bg-red-200/40 blur-sm rounded-full" />
          <div className="absolute top-1/2 right-4 w-6 h-4 bg-red-200/40 blur-sm rounded-full" />

          {/* Smile */}
          <div className="w-10 h-4 border-b-4 border-black/10 rounded-full" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-row bg-white dark:bg-app-bg-dark overflow-hidden">
      {/* Left Side: Animation */}
      <div className="hidden lg:flex flex-1 bg-primary/5 flex-col items-center justify-center relative">
        <div className="absolute top-12 left-12 flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/30">
            B
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            ChildCare <span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex items-end space-x-8 mb-16">
          <Character type="parent" x={mousePos.x} y={mousePos.y} />
          <Character type="child" x={mousePos.x} y={mousePos.y} />
        </div>

        <div className="text-center px-16 max-w-lg">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-none">
            Trustworthy care for <br />
            <span className="text-primary">your little ones.</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Join thousands of families finding verified childcare with AI-powered safety insights.
          </p>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 bg-white dark:bg-app-bg-dark z-10 relative">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => navigate('/roles')}
            className="flex items-center space-x-2 text-slate-400 hover:text-primary transition-colors font-bold text-sm"
          >
            <ChevronLeft size={20} />
            <span>Switch Role</span>
          </button>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-12">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-premium"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <config.icon size={30} style={{ color: config.color }} />
            </div>
            <h1 className="text-[36px] font-black text-slate-900 dark:text-white mb-2 tracking-tighter leading-none">
              {config.title}
            </h1>
            <p className="text-slate-500 font-medium text-lg leading-tight">
              {config.subtitle}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email / Phone</label>
              <Input
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="bg-slate-50 border-slate-200 h-16 rounded-2xl font-bold text-lg focus:ring-primary/15 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <button 
                  type="button"
                  className="text-xs font-bold text-primary hover:underline transition-all"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="bg-slate-50 border-slate-200 h-16 rounded-2xl font-bold text-lg focus:ring-primary/15 transition-all"
              />
            </div>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw size={14} className="text-white" />
                </div>
                <p className="text-sm font-bold text-red-600">
                  {errorMessage}
                </p>
              </motion.div>
            )}
            
            <div className="pt-4">
              <PrimaryButton
                title="Sign In"
                isLoading={isLoading}
                disabled={!email || !password}
                className="h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              />
            </div>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col items-center space-y-4">
            <p className="text-slate-500 font-medium">Don't have an account?</p>
            <button 
              className="w-full py-4 rounded-2xl border-2 border-black/5 dark:border-white/5 font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white hover:bg-black/5 transition-all"
              onClick={() => navigate(`/register/${role}`)}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
