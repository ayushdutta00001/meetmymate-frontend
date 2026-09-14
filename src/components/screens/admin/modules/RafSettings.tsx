import React, { useEffect, useState } from 'react';
import { supabase } from "../../../../supabase";
import { Save, Check } from 'lucide-react';

export function RafSettings() {
  const [booking, setBooking] = useState({ maxDistance: 25, minDuration: 60, maxDuration: 480, cancelTime: 24, minAdvance: 2 });
  const [commission, setCommission] = useState({ platform: 15, provider: 85, tax: 8.5 });
  const [timeoutVal, setTimeoutVal] = useState(60);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
const [loading, setLoading] = useState(true);
const [settingsId, setSettingsId] = useState("");

const loadSettings = async () => {
  try {

    setLoading(true);

    const { data: sessionData } =
      await supabase.auth.getSession();

    const token =
      sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_settings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("RAF SETTINGS", result);

    if (!result.success) return;
    
    setSettingsId(result.settings.id);

    setBooking({
      maxDistance: result.settings.max_booking_distance,
      minDuration: result.settings.min_booking_duration,
      maxDuration: result.settings.max_booking_duration,
      cancelTime: result.settings.cancellation_window,
      minAdvance: result.settings.minimum_advance_booking,
    });

    setCommission({
      platform: result.settings.platform_commission,
      provider: result.settings.provider_share,
      tax: result.settings.tax_percentage,
    });

    setTimeoutVal(
      result.settings.provider_accept_timeout
    );

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};

useEffect(() => {
  loadSettings();
}, []);

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      Loading Settings...
    </div>
  );
}

 const doSave = async (key: string) => {
  try {
    const { data: sessionData } =
      await supabase.auth.getSession();

    const token =
      sessionData.session?.access_token;

    let payload: any = {
      id: settingsId,
    };

    if (key === "booking") {
      payload = {
        ...payload,
        max_booking_distance: booking.maxDistance,
        min_booking_duration: booking.minDuration,
        max_booking_duration: booking.maxDuration,
        cancellation_window: booking.cancelTime,
        minimum_advance_booking: booking.minAdvance,
      };
    }

    if (key === "commission") {
      payload = {
        ...payload,
        platform_commission: commission.platform,
        provider_share: commission.provider,
        tax_percentage: commission.tax,
      };
    }

    if (key === "timeout") {
      payload = {
        ...payload,
        provider_accept_timeout: timeoutVal,
      };
    }

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_update_raf_settings",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    console.log("UPDATE SETTINGS", result);

    if (!result.success) {
      alert("Failed to save settings");
      return;
    }

    setSaved((p) => ({
      ...p,
      [key]: true,
    }));

    setTimeout(() => {
      setSaved((p) => ({
        ...p,
        [key]: false,
      }));
    }, 2000);

  } catch (err) {

    console.error(err);

    alert("Something went wrong.");

  }
};

  const Field = ({ label, value, unit, onChange }: { label: string; value: number; unit: string; onChange: (v: number) => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-24 text-right bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-400"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 w-10">{unit}</span>
      </div>
    </div>
  );

  const Card = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-base text-gray-900 dark:text-white mb-5">{title}</h3>
      {children}
      <button
        onClick={() => doSave(id)}
        className={`mt-5 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm text-white transition-colors ${saved[id] ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {saved[id] ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">RAF Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Configure booking rules, commissions and provider settings</p>
      </div>

      <Card title="Booking Rules" id="booking">
        <Field label="Maximum Booking Distance" value={booking.maxDistance} unit="km" onChange={v => setBooking(p => ({ ...p, maxDistance: v }))} />
        <Field label="Minimum Booking Duration" value={booking.minDuration} unit="min" onChange={v => setBooking(p => ({ ...p, minDuration: v }))} />
        <Field label="Maximum Booking Duration" value={booking.maxDuration} unit="min" onChange={v => setBooking(p => ({ ...p, maxDuration: v }))} />
        <Field label="Booking Cancellation Window" value={booking.cancelTime} unit="hrs" onChange={v => setBooking(p => ({ ...p, cancelTime: v }))} />
        <Field label="Minimum Advance Booking Time" value={booking.minAdvance} unit="hrs" onChange={v => setBooking(p => ({ ...p, minAdvance: v }))} />
      </Card>

      <Card title="Commission Settings" id="commission">
        <Field label="Platform Commission Percentage" value={commission.platform} unit="%" onChange={v => setCommission(p => ({ ...p, platform: v }))} />
        <Field label="Provider Share Percentage" value={commission.provider} unit="%" onChange={v => setCommission(p => ({ ...p, provider: v }))} />
        <Field label="Tax Percentage" value={commission.tax} unit="%" onChange={v => setCommission(p => ({ ...p, tax: v }))} />
      </Card>

      <Card title="Provider Acceptance Timeout" id="timeout">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Set the time window for providers to accept or decline booking requests.</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {[30, 45, 60, 90, 120].map(t => (
            <button
              key={t}
              onClick={() => setTimeoutVal(t)}
              className={`px-5 py-2 rounded-lg text-sm transition-colors ${
                timeoutVal === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
        <Field label="Custom Timeout Value" value={timeoutVal} unit="sec" onChange={v => setTimeoutVal(v)} />
      </Card>
    </div>
  );
}
