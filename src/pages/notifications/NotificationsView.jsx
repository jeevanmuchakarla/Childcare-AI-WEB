import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, CheckCircle2, MessageSquare } from 'lucide-react';

const NotificationsView = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Emergency Alert',
      desc: 'Severe weather warning for your area. Please stay safe.',
      time: 'Now',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Booking Confirmed',
      desc: 'Your booking with Suresh Preschool has been accepted.',
      time: '2h ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Payment Pending',
      desc: 'Please settle the outstanding balance for Leo.',
      time: '5h ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Daily Report Ready',
      desc: "You got your children's update for Jeevan!",
      time: 'Today',
      read: false
    }
  ];

  const getTheme = (type) => {
    switch (type) {
      case 'success': return { bg: 'bg-green-500/10', text: 'text-green-600', icon: CheckCircle2 };
      case 'warning': return { bg: 'bg-orange-500/10', text: 'text-orange-600', icon: Info };
      case 'alert': return { bg: 'bg-red-500/10', text: 'text-red-600', icon: Info };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: MessageSquare };
    }
  };

  return (
    <div className="py-6 min-h-screen bg-app-bg dark:bg-app-bg-dark">
      {/* Header */}
      <header className="py-6 flex items-center justify-between px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark flex-1">
          Notifications
        </h1>
        <div className="flex space-x-2">
          <button className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
            <CheckCircle2 size={20} />
          </button>
        </div>
      </header>

      {/* Notifications List */}
      <main className="px-4 pb-12 space-y-4">
        {notifications.map((note) => {
          const theme = getTheme(note.type);
          return (
            <div 
              key={note.id}
              className={`flex items-start p-5 bg-white dark:bg-app-surface-dark rounded-[24px] shadow-sm border border-black/[0.03] dark:border-white/[0.03] relative ${!note.read ? 'ring-1 ring-primary/5' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${theme.bg} ${theme.text}`}>
                <theme.icon size={22} />
              </div>
              <div className="flex-1 pr-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-text-primary dark:text-text-primary-dark text-base tracking-tight">
                    {note.title}
                  </h3>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1 opacity-50">{note.time}</span>
                </div>
                <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {note.desc}
                </p>
              </div>
              {!note.read && (
                <div className="absolute top-6 right-5 w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/30" />
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default NotificationsView;
