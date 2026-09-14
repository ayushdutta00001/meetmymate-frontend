import React, { useEffect, useState } from 'react';
import { Film, Utensils, PartyPopper, Globe, Heart, BookOpen, Coffee, Gamepad2, ShoppingCart, Camera, Music, Dumbbell, Save, Check } from 'lucide-react';
import { supabase } from "../../../../supabase";
const initialServices = [
  { name: 'Movie Buddy', icon: Film, bgColor: '#8B5CF620', iconColor: '#8B5CF6', price: 1500, enabled: true, updated: '2026-01-15' },
  { name: 'Dining Partner', icon: Utensils, bgColor: '#F9731620', iconColor: '#F97316', price: 2000, enabled: true, updated: '2026-01-12' },
  { name: 'Party Companion', icon: PartyPopper, bgColor: '#EC489920', iconColor: '#EC4899', price: 3000, enabled: true, updated: '2026-01-10' },
  { name: 'Explore City', icon: Globe, bgColor: '#06B6D420', iconColor: '#06B6D4', price: 2500, enabled: true, updated: '2026-01-08' },
  { name: 'Emotional Support', icon: Heart, bgColor: '#EF444420', iconColor: '#EF4444', price: 1800, enabled: false, updated: '2026-01-05' },
  { name: 'Study Partner', icon: BookOpen, bgColor: '#10B98120', iconColor: '#10B981', price: 1200, enabled: true, updated: '2026-01-03' },
  { name: 'Coffee Chat', icon: Coffee, bgColor: '#F59E0B20', iconColor: '#F59E0B', price: 800, enabled: true, updated: '2025-12-28' },
  { name: 'Gaming Buddy', icon: Gamepad2, bgColor: '#4F46E520', iconColor: '#4F46E5', price: 1200, enabled: true, updated: '2025-12-25' },
  { name: 'Shopping Companion', icon: ShoppingCart, bgColor: '#F9731620', iconColor: '#F97316', price: 1500, enabled: true, updated: '2025-12-20' },
  { name: 'Photo Walk', icon: Camera, bgColor: '#06B6D420', iconColor: '#06B6D4', price: 2200, enabled: true, updated: '2025-12-18' },
  { name: 'Concert Buddy', icon: Music, bgColor: '#8B5CF620', iconColor: '#8B5CF6', price: 2800, enabled: false, updated: '2025-12-15' },
  { name: 'Workout Partner', icon: Dumbbell, bgColor: '#10B98120', iconColor: '#10B981', price: 1600, enabled: true, updated: '2025-12-10' },
];

export function RafServices() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState(() =>
    initialServices.map(s => ({ ...s, editPrice: String(s.price), saved: false }))
  );
const loadServices = async () => {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_services",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("RAF SERVICES:", result);

    if (result.success) {

      setServices(prev =>
        prev.map(service => {

          const dbService = result.services.find(
            (s: any) =>
              s.service_slug ===
              service.name.toLowerCase().replace(/\s+/g, "-")
          );

          if (!dbService) return service;

          return {
            ...service,
            price: dbService.price_per_hour,
            editPrice: String(dbService.price_per_hour),
            enabled: dbService.enabled,
            updated: dbService.updated_at.split("T")[0],
          };

        })
      );

    }

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};
useEffect(() => {
  loadServices();
}, []);
 const save = async (i: number) => {

  const service = services[i];

  try {

    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_update_raf_service",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          service_slug: service.name
            .toLowerCase()
            .replace(/\s+/g, "-"),

          price_per_hour: Number(service.editPrice),

          enabled: service.enabled,

        }),
      }
    );

    const result = await response.json();

    if (result.success) {

      setServices(prev =>
        prev.map((s, j) =>
          j === i
            ? {
                ...s,
                price: result.service.price_per_hour,
                editPrice: String(result.service.price_per_hour),
                updated: result.service.updated_at.split("T")[0],
                saved: true,
              }
            : s
        )
      );

      setTimeout(() => {

        setServices(prev =>
          prev.map((s, j) =>
            j === i
              ? {
                  ...s,
                  saved: false,
                }
              : s
          )
        );

      }, 2000);

    }

  } catch (err) {

    console.error(err);

  }

};

  const toggle = async (i: number) => {

  const service = services[i];

  const newEnabled = !service.enabled;

  try {

    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_update_raf_service",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_slug: service.name.toLowerCase().replace(/\s+/g, "-"),
          price_per_hour: Number(service.editPrice),
          enabled: newEnabled,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {

      setServices(prev =>
        prev.map((s, j) =>
          j === i
            ? {
                ...s,
                enabled: newEnabled,
                updated: result.service.updated_at.split("T")[0],
              }
            : s
        )
      );

    }

  } catch (err) {

    console.error(err);

  }

};
if (loading) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading Services...
      </div>
    </div>
  );
}
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Services</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage Rent A Friend service catalog and pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          const isDirty = s.editPrice !== String(s.price);
          return (
            <div
              key={s.name}
              className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* Card header */}
              <div className="p-5 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bgColor }}
                >
                  <Icon className="w-7 h-7" style={{ color: s.iconColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Current:{' '}
                    <span className="text-green-600 dark:text-green-400">
                      ₹{s.price.toLocaleString()}/hr
                    </span>
                  </p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: s.enabled ? '#22C55E' : '#6B7280',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: s.enabled ? 22 : 2,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      transition: 'left 0.2s',
                      display: 'block',
                    }}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-gray-800 mx-5" />

              {/* Price editor */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Update Price (₹/hr)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
                      <span className="text-sm text-gray-400">₹</span>
                      <input
                        type="number"
                        value={s.editPrice}
                        onChange={e =>
                          setServices(prev =>
                            prev.map((sv, j) =>
                              j === i ? { ...sv, editPrice: e.target.value } : sv
                            )
                          )
                        }
                        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none min-w-0"
                        placeholder="Enter price"
                      />
                    </div>
                    <button
                      onClick={() => save(i)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-white transition-all flex-shrink-0 ${
                        s.saved
                          ? 'bg-green-500'
                          : isDirty
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {s.saved ? (
                        <><Check className="w-4 h-4" /> Saved</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      s.enabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                    }`}
                  >
                    {s.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Updated {s.updated}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
