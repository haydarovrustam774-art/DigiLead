import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Database,
  RefreshCw,
  UserCheck,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
  Users,
  LogOut,
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeUser: User;
  onLogout: () => void;
  onOpenAudit: () => void;
  onOpenSimulator: () => void;
  onOpenArchitecture: () => void;
  onOpenHelp: () => void;
  isRecalculating: boolean;
  onRecalculate: () => void;
  showAuditButton?: boolean;
  auditButtonText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  onLogout,
  onOpenAudit,
  onOpenSimulator,
  onOpenArchitecture,
  onOpenHelp,
  isRecalculating,
  onRecalculate,
  showAuditButton,
  auditButtonText,
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'director':
        return { label: 'MTT Direktori', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'it_methodist':
        return { label: 'IT-Metodist', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'auditor':
        return { label: 'Ta\'lim Auditori', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'superadmin':
        return { label: 'SuperAdmin', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(activeUser.role);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-4 ring-emerald-50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight font-['Outfit',sans-serif]">
                  DigiLead
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200/60">
                  Smart EdTech Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                MTT rahbarlari axborot kompetensiyasi va xotirjam boshqaruv platformasi
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Technophobia-free Calm Status pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xotirjam rejim: Faol</span>
            </div>

            {/* Recalculate Button */}
            <button
              id="btn-recalculate"
              onClick={onRecalculate}
              disabled={isRecalculating}
              title="12 indikatorni 3 manba asosida avtomatik hisoblash"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden md:inline">Hisoblash</span>
            </button>

            {/* Footprint Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 transition active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden md:inline">Raqamli Iz</span>
            </button>

            {/* Gamified Audit Button */}
            {showAuditButton && (
              <button
                onClick={onOpenAudit}
                title="Kompetensiyani baholash (60 ta vaziyat)"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{auditButtonText || "Kompetensiyani Baholash"}</span>
              </button>
            )}

            {/* Admin Panel Button */}
            {activeUser.role === 'superadmin' && (
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition active:scale-95"
              >
                <Users className="w-4 h-4" />
                <span className="hidden md:inline">Admin Panel</span>
              </a>
            )}


            {/* Help / Guide */}
            <button
              onClick={onOpenHelp}
              title="Tezkor yordam va yo'riqnomalar"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <HelpCircle className="w-5 h-5 text-emerald-600" />
            </button>

            {/* Active User Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  {activeUser.fullName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {activeUser.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5" />
                    <span>{roleInfo.label}</span>
                  </div>
                </div>
              </button>

              {/* Dropdown for role switching */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900">{activeUser.fullName}</span>
                    <span className="text-[11px] text-slate-500">{activeUser.email}</span>
                  </div>
                  <div className="py-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-rose-50 text-rose-600 transition"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold">Tizimdan chiqish</span>
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
