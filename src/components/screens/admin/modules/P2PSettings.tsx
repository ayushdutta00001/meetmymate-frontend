import React, { useState } from 'react';
import { supabase } from "../../../../supabase";
import { useEffect } from "react";
import { Settings, DollarSign, Clock, MapPin, Save } from 'lucide-react';

export function P2PSettings() {
  const [defaultPrice, setDefaultPrice] = useState('150');
  const [paymentDeadline, setPaymentDeadline] = useState('48');
  const [autoCancelTimeout, setAutoCancelTimeout] = useState('72');
  const [schedulingTimeLimit, setSchedulingTimeLimit] = useState('24');
const [settingsId, setSettingsId] = useState<string | null>(null);
const [cities, setCities] = useState<any[]>([]);
const [presets, setPresets] = useState<any[]>([]);
const [newPreset, setNewPreset] = useState("");

  const allowedCities = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Ahmedabad"
];

  const locationPresets = [
    'Downtown Coffee Shop',
    'Business District Restaurant',
    'Tech Hub Co-working Space',
    'City Center Hotel Lobby',
    'Financial District Cafe',
  ];
const loadSettings = async () => {

  const { data, error } = await supabase
    .from("p2p_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Settings load error", error);
    return;
  }

  // If no settings row exists, create default one
  if (!data) {

    const { data: inserted, error: insertError } = await supabase
      .from("p2p_settings")
      .insert({
        default_price: 999,
        payment_deadline_hours: 48,
        auto_cancel_hours: 72,
        scheduling_time_limit_hours: 24
      })
      .select()
      .single();


    if (insertError) {
      console.error("Failed to create default settings", insertError);
      return;
    }

    setSettingsId(inserted.id);
    setDefaultPrice(inserted.default_price.toString());
    setPaymentDeadline(inserted.payment_deadline_hours.toString());
    setAutoCancelTimeout(inserted.auto_cancel_hours.toString());
    setSchedulingTimeLimit(inserted.scheduling_time_limit_hours.toString());

    return;
  }

  // Settings already exist
  setSettingsId(data.id);
  setDefaultPrice(data.default_price?.toString() || "999");
  setPaymentDeadline(data.payment_deadline_hours?.toString() || "48");
  setAutoCancelTimeout(data.auto_cancel_hours?.toString() || "72");
  setSchedulingTimeLimit(data.scheduling_time_limit_hours?.toString() || "24");

};
useEffect(() => {
  loadSettings();
}, []);

const loadLocationSettings = async () => {

  const { data: citiesData } = await supabase
    .from("p2p_allowed_cities")
    .select("*");


    const { data: presetData } = await supabase
  .from("p2p_location_presets")
  .select("*")
  .order("created_at", { ascending: false });

if (presetData) setPresets(presetData);

  if (citiesData) setCities(citiesData);
  if (presetData) setPresets(presetData);

};


useEffect(() => {
  loadLocationSettings();
}, []);

const saveSettings = async () => {

  const payload = {
    default_price: Number(defaultPrice),
    payment_deadline_hours: Number(paymentDeadline),
    auto_cancel_hours: Number(autoCancelTimeout),
    scheduling_time_limit_hours: Number(schedulingTimeLimit),
    updated_at: new Date()
  };

  let error;

  if (settingsId) {

    const result = await supabase
      .from("p2p_settings")
      .update(payload)
      .eq("id", settingsId);

    error = result.error;

  } else {

    const result = await supabase
      .from("p2p_settings")
      .insert(payload);

    error = result.error;

  }

  if (error) {
    console.error("Settings save failed", error);
    alert("Failed to save settings");
    return;
  }

  alert("Settings saved successfully");

};

const toggleCity = async (city:any) => {

  const { error } = await supabase
    .from("p2p_allowed_cities")
    .update({ enabled: !city.enabled })
    .eq("id", city.id);

  if (!error) loadLocationSettings();

};



const addPreset = async () => {

  const name = prompt("Enter new location preset");

  if (!name) return;

  const { error } = await supabase
    .from("p2p_location_presets")
    .insert({
      preset_name: name
    });

  if (error) {
    console.error(error);
    alert("Failed to add preset");
    return;
  }

 
  loadLocationSettings();
};

const removePreset = async (id:string) => {

  const confirmDelete = confirm("Remove this preset?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("p2p_location_presets")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Failed to delete preset");
    return;
  }

  loadLocationSettings();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/30 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
            P2P System Settings
          </h1>
          <p className="text-sm text-gray-400">Configure P2P matching system parameters</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Pricing Settings */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h2 className="text-lg text-white" style={{ fontWeight: 600 }}>
              Pricing Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
             <label className="block text-sm text-gray-300 mb-2">
  Default Meeting Price (₹)
</label>

<div className="flex items-center gap-3">

  {/* Minus Buttons */}
  <button
   onClick={() => setDefaultPrice(Math.max(0, Number(defaultPrice) - 100).toString())}
    className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-white hover:bg-gray-700"
  >
    -100
  </button>

  <button
   onClick={() => setDefaultPrice(Math.max(0, Number(defaultPrice) - 500).toString())}
    className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-white hover:bg-gray-700"
  >
    -500
  </button>

  {/* Price Input */}
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-400">₹</span>

    <input
      type="number"
      value={defaultPrice}
      onChange={(e) => setDefaultPrice(e.target.value)}
      className="pl-7 pr-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none w-40"
    />
  </div>

  {/* Plus Buttons */}
  <button
    onClick={() => setDefaultPrice((Number(defaultPrice) + 100).toString())}
    className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-white hover:bg-gray-700"
  >
    +100
  </button>

  <button
    onClick={() => setDefaultPrice((Number(defaultPrice) + 500).toString())}
    className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 text-white hover:bg-gray-700"
  >
    +500
  </button>

</div>

<p className="text-xs text-gray-500 mt-2">
Default price used when creating P2P meetings
</p>
              <p className="text-xs text-gray-500 mt-1">Base price for P2P meeting bookings</p>
            </div>
          </div>
        </div>

        {/* Timing Settings */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg text-white" style={{ fontWeight: 600 }}>
              Timing & Deadlines
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                Payment Deadline (hours)
              </label>
              <input
                type="number"
                value={paymentDeadline}
                onChange={(e) => setPaymentDeadline(e.target.value)}
                className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Time limit for users to complete payment</p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                Auto Cancel Timeout (hours)
              </label>
              <input
                type="number"
                value={autoCancelTimeout}
                onChange={(e) => setAutoCancelTimeout(e.target.value)}
                className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Automatically cancel meeting if payment not received
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                Admin Scheduling Time Limit (hours)
              </label>
              <input
                type="number"
                value={schedulingTimeLimit}
                onChange={(e) => setSchedulingTimeLimit(e.target.value)}
                className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Time limit for admin to schedule paid meetings</p>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg text-white" style={{ fontWeight: 600 }}>
              Location Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {cities.map((city) => (
    <div
      key={city.id}
      className="flex items-center gap-2 p-3 rounded-xl bg-gray-900 border border-white/10"
    >
      <input
        type="checkbox"
        checked={city.enabled}
        onChange={() => toggleCity(city)}
        className="w-4 h-4 rounded bg-gray-700 border-gray-600"
      />

      <span className="text-sm text-gray-300">
        {city.city_name}
      </span>
    </div>
  ))}
</div>

            {/* Location Presets */}
            <div>
              <label className="block text-sm text-gray-300 mb-3" style={{ fontWeight: 500 }}>
                Meeting Location Presets
              </label>
              <div className="space-y-2">

  {presets.map((preset:any) => (
    <div
      key={preset.id}
      className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-white/10"
    >

      <span className="text-sm text-gray-300">
        {preset.preset_name}
      </span>

      <button
        onClick={() => removePreset(preset.id)}
        className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs transition-colors"
      >
        Remove
      </button>

    </div>
  ))}

  <button
    onClick={addPreset}
    className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-white/30 hover:border-white/20 text-gray-400 hover:text-gray-300 text-sm transition-colors"
  >
    + Add New Preset
  </button>

</div>

            </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg text-white" style={{ fontWeight: 600 }}>
              Feature Toggles
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                  Allow Public P2P Profiles
                </p>
                <p className="text-xs text-gray-500 mt-1">Users can make their P2P profile public</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                  Require Admin Approval
                </p>
                <p className="text-xs text-gray-500 mt-1">All meetings require admin scheduling</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                  Auto-Refund on Cancel
                </p>
                <p className="text-xs text-gray-500 mt-1">Automatically refund when meeting is cancelled</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
         <button
  onClick={saveSettings}
  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2"
>
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    
  );
}