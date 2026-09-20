import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Save,
  Settings,
} from "lucide-react";

interface P2PSettingsState {
  defaultPrice: string;
  paymentDeadline: string;
  autoCancelTimeout: string;
  schedulingTimeLimit: string;
}

interface AllowedCity {
  id: string;
  city_name: string;
  enabled: boolean;
}

interface LocationPreset {
  id: string;
  preset_name: string;
  created_at?: string | null;
}

const DEFAULT_SETTINGS: P2PSettingsState = {
  defaultPrice: "150",
  paymentDeadline: "48",
  autoCancelTimeout: "72",
  schedulingTimeLimit: "24",
};

const DEFAULT_CITIES = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Ahmedabad",
];

export function P2PSettings() {
  const [settings, setSettings] =
    useState<P2PSettingsState>(DEFAULT_SETTINGS);

  const [settingsId, setSettingsId] =
    useState<string | null>(null);

  const [cities, setCities] = useState<AllowedCity[]>([]);
  const [presets, setPresets] =
    useState<LocationPreset[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [citiesLoading, setCitiesLoading] =
    useState(true);
  const [presetSaving, setPresetSaving] =
    useState(false);

  const [hasChanges, setHasChanges] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  // These feature toggles are currently UI-only because
  // the supplied p2p_settings schema/code does not expose
  // persistence fields for them.
  const [allowPublicProfiles, setAllowPublicProfiles] =
    useState(true);

  const [requireAdminApproval, setRequireAdminApproval] =
    useState(true);

  const [autoRefundOnCancel, setAutoRefundOnCancel] =
    useState(false);

  // =========================================================
  // LOAD P2P SETTINGS
  // =========================================================
  const loadSettings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const {
        data,
        error,
      } = await supabase
        .from("p2p_settings")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "P2P SETTINGS LOAD ERROR:",
          error
        );

        throw new Error(
          error.message ||
            "Unable to load P2P settings."
        );
      }

      // -------------------------------------------------------
      // Create default row if none exists
      // -------------------------------------------------------
      if (!data) {
        const {
          data: inserted,
          error: insertError,
        } = await supabase
          .from("p2p_settings")
          .insert({
            default_price:
              Number(DEFAULT_SETTINGS.defaultPrice),

            payment_deadline_hours:
              Number(
                DEFAULT_SETTINGS.paymentDeadline
              ),

            auto_cancel_hours:
              Number(
                DEFAULT_SETTINGS.autoCancelTimeout
              ),

            scheduling_time_limit_hours:
              Number(
                DEFAULT_SETTINGS.schedulingTimeLimit
              ),

            updated_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error(
            "P2P DEFAULT SETTINGS INSERT ERROR:",
            insertError
          );

          throw new Error(
            insertError.message ||
              "Unable to create default P2P settings."
          );
        }

        setSettingsId(
          inserted?.id ?? null
        );

        setSettings({
          defaultPrice:
            String(
              inserted?.default_price ??
                DEFAULT_SETTINGS.defaultPrice
            ),

          paymentDeadline:
            String(
              inserted?.payment_deadline_hours ??
                DEFAULT_SETTINGS.paymentDeadline
            ),

          autoCancelTimeout:
            String(
              inserted?.auto_cancel_hours ??
                DEFAULT_SETTINGS.autoCancelTimeout
            ),

          schedulingTimeLimit:
            String(
              inserted?.scheduling_time_limit_hours ??
                DEFAULT_SETTINGS.schedulingTimeLimit
            ),
        });

        setHasChanges(false);
        return;
      }

      // -------------------------------------------------------
      // Existing settings
      // -------------------------------------------------------
      setSettingsId(
        data.id ?? null
      );

      setSettings({
        defaultPrice:
          String(
            data.default_price ??
              DEFAULT_SETTINGS.defaultPrice
          ),

        paymentDeadline:
          String(
            data.payment_deadline_hours ??
              DEFAULT_SETTINGS.paymentDeadline
          ),

        autoCancelTimeout:
          String(
            data.auto_cancel_hours ??
              DEFAULT_SETTINGS.autoCancelTimeout
          ),

        schedulingTimeLimit:
          String(
            data.scheduling_time_limit_hours ??
              DEFAULT_SETTINGS.schedulingTimeLimit
          ),
      });

      setHasChanges(false);

      console.log(
        "P2P SETTINGS LOADED:",
        data
      );
    } catch (error) {
      console.error(
        "P2P SETTINGS LOAD ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load P2P settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD LOCATION SETTINGS
  // =========================================================
  const loadLocationSettings = async () => {
    try {
      setCitiesLoading(true);

      const [
        citiesResult,
        presetsResult,
      ] = await Promise.all([
        supabase
          .from("p2p_allowed_cities")
          .select("*")
          .order("city_name", {
            ascending: true,
          }),

        supabase
          .from("p2p_location_presets")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (citiesResult.error) {
        console.error(
          "P2P CITIES LOAD ERROR:",
          citiesResult.error
        );

        throw new Error(
          citiesResult.error.message ||
            "Unable to load allowed cities."
        );
      }

      if (presetsResult.error) {
        console.error(
          "P2P PRESETS LOAD ERROR:",
          presetsResult.error
        );

        throw new Error(
          presetsResult.error.message ||
            "Unable to load location presets."
        );
      }

      setCities(
        Array.isArray(citiesResult.data)
          ? citiesResult.data
          : []
      );

      setPresets(
        Array.isArray(presetsResult.data)
          ? presetsResult.data
          : []
      );
    } catch (error) {
      console.error(
        "P2P LOCATION SETTINGS LOAD ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load location settings."
      );
    } finally {
      setCitiesLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    void loadSettings();
    void loadLocationSettings();
  }, []);

  // =========================================================
  // NUMBER VALIDATION
  // =========================================================
  const validateSettings = () => {
    const price = Number(
      settings.defaultPrice
    );

    const paymentDeadline = Number(
      settings.paymentDeadline
    );

    const autoCancelTimeout = Number(
      settings.autoCancelTimeout
    );

    const schedulingTimeLimit =
      Number(
        settings.schedulingTimeLimit
      );

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return "Default meeting price must be 0 or greater.";
    }

    if (
      !Number.isFinite(paymentDeadline) ||
      paymentDeadline <= 0
    ) {
      return "Payment deadline must be greater than 0 hours.";
    }

    if (
      !Number.isFinite(autoCancelTimeout) ||
      autoCancelTimeout <= 0
    ) {
      return "Auto cancel timeout must be greater than 0 hours.";
    }

    if (
      !Number.isFinite(schedulingTimeLimit) ||
      schedulingTimeLimit <= 0
    ) {
      return "Admin scheduling time limit must be greater than 0 hours.";
    }

    return null;
  };

  // =========================================================
  // SAVE SETTINGS
  // =========================================================
  const saveSettings = async () => {
    if (saving) return;

    const validationError =
      validateSettings();

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage(null);
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const payload = {
        default_price:
          Number(settings.defaultPrice),

        payment_deadline_hours:
          Number(settings.paymentDeadline),

        auto_cancel_hours:
          Number(settings.autoCancelTimeout),

        scheduling_time_limit_hours:
          Number(settings.schedulingTimeLimit),

        updated_at:
          new Date().toISOString(),
      };

      let savedData: any = null;
      let error: any = null;

      // -------------------------------------------------------
      // UPDATE EXISTING ROW
      // -------------------------------------------------------
      if (settingsId) {
        const result =
          await supabase
            .from("p2p_settings")
            .update(payload)
            .eq("id", settingsId)
            .select()
            .single();

        savedData = result.data;
        error = result.error;
      }

      // -------------------------------------------------------
      // INSERT IF NO ID EXISTS
      // -------------------------------------------------------
      else {
        const result =
          await supabase
            .from("p2p_settings")
            .insert(payload)
            .select()
            .single();

        savedData = result.data;
        error = result.error;

        if (!error && savedData?.id) {
          setSettingsId(
            savedData.id
          );
        }
      }

      if (error) {
        console.error(
          "P2P SETTINGS SAVE ERROR:",
          error
        );

        throw new Error(
          error.message ||
            "Failed to save P2P settings."
        );
      }

      // -------------------------------------------------------
      // Keep local state synchronized with DB
      // -------------------------------------------------------
      if (savedData) {
        setSettings({
          defaultPrice:
            String(
              savedData.default_price ??
                settings.defaultPrice
            ),

          paymentDeadline:
            String(
              savedData.payment_deadline_hours ??
                settings.paymentDeadline
            ),

          autoCancelTimeout:
            String(
              savedData.auto_cancel_hours ??
                settings.autoCancelTimeout
            ),

          schedulingTimeLimit:
            String(
              savedData.scheduling_time_limit_hours ??
                settings.schedulingTimeLimit
            ),
        });

        if (savedData.id) {
          setSettingsId(
            savedData.id
          );
        }
      }

      setHasChanges(false);

      setSuccessMessage(
        "P2P settings saved successfully."
      );

      console.log(
        "P2P SETTINGS SAVED:",
        savedData
      );
    } catch (error) {
      console.error(
        "P2P SETTINGS SAVE ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save P2P settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE SETTING FIELD
  // =========================================================
  const updateSetting = (
    field: keyof P2PSettingsState,
    value: string
  ) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setHasChanges(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // =========================================================
  // +/- PRICE
  // =========================================================
  const changePrice = (
    amount: number
  ) => {
    const current =
      Number(settings.defaultPrice) || 0;

    const next = Math.max(
      0,
      current + amount
    );

    updateSetting(
      "defaultPrice",
      String(next)
    );
  };

  // =========================================================
  // TOGGLE CITY
  // =========================================================
  const toggleCity = async (
    city: AllowedCity
  ) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const {
        error,
      } = await supabase
        .from("p2p_allowed_cities")
        .update({
          enabled: !city.enabled,
        })
        .eq("id", city.id);

      if (error) {
        console.error(
          "CITY UPDATE ERROR:",
          error
        );

        throw new Error(
          error.message ||
            "Unable to update city."
        );
      }

      await loadLocationSettings();
    } catch (error) {
      console.error(
        "CITY TOGGLE ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update city."
      );
    }
  };

  // =========================================================
  // ADD LOCATION PRESET
  // =========================================================
  const addPreset = async () => {
    if (presetSaving) return;

    const name =
      window.prompt(
        "Enter new location preset"
      );

    const trimmedName =
      name?.trim() || "";

    if (!trimmedName) {
      return;
    }

    try {
      setPresetSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const {
        error,
      } = await supabase
        .from("p2p_location_presets")
        .insert({
          preset_name:
            trimmedName,
        });

      if (error) {
        console.error(
          "PRESET INSERT ERROR:",
          error
        );

        throw new Error(
          error.message ||
            "Failed to add location preset."
        );
      }

      await loadLocationSettings();

      setSuccessMessage(
        "Location preset added successfully."
      );
    } catch (error) {
      console.error(
        "ADD PRESET ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to add location preset."
      );
    } finally {
      setPresetSaving(false);
    }
  };

  // =========================================================
  // REMOVE LOCATION PRESET
  // =========================================================
  const removePreset = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Remove this location preset?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const {
        error,
      } = await supabase
        .from("p2p_location_presets")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(
          "PRESET DELETE ERROR:",
          error
        );

        throw new Error(
          error.message ||
            "Failed to remove location preset."
        );
      }

      await loadLocationSettings();

      setSuccessMessage(
        "Location preset removed successfully."
      );
    } catch (error) {
      console.error(
        "REMOVE PRESET ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to remove location preset."
      );
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />

          <p className="text-sm text-gray-400 mt-4">
            Loading P2P settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/30 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className="text-2xl lg:text-3xl text-white mb-2"
                style={{
                  fontWeight: 700,
                }}
              >
                P2P System Settings
              </h1>

              <p className="text-sm text-gray-400">
                Configure P2P matching system parameters
              </p>
            </div>

            {hasChanges && (
              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-500
                  text-white
                  transition-colors
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Save
                  className={`w-5 h-5 ${
                    saving
                      ? "animate-pulse"
                      : ""
                  }`}
                />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* =====================================================
            STATUS MESSAGES
        ====================================================== */}
        {errorMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">
                Settings Error
              </p>

              <p className="text-sm text-red-400 mt-1">
                {errorMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setErrorMessage(null)
              }
              className="text-xs text-red-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />

            <div className="flex-1">
              <p className="text-sm font-medium text-green-300">
                Success
              </p>

              <p className="text-sm text-green-400 mt-1">
                {successMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage(null)
              }
              className="text-xs text-green-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =====================================================
            PRICING SETTINGS
        ====================================================== */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-400" />

            <h2
              className="text-lg text-white"
              style={{
                fontWeight: 600,
              }}
            >
              Pricing Settings
            </h2>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Default Meeting Price (₹)
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {/* -500 */}
              <button
                type="button"
                onClick={() =>
                  changePrice(-500)
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-gray-800
                  border
                  border-white/10
                  text-white
                  hover:bg-gray-700
                  transition-colors
                "
              >
                -500
              </button>

              {/* -100 */}
              <button
                type="button"
                onClick={() =>
                  changePrice(-100)
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-gray-800
                  border
                  border-white/10
                  text-white
                  hover:bg-gray-700
                  transition-colors
                "
              >
                -100
              </button>

              {/* PRICE INPUT */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={settings.defaultPrice}
                  onChange={(event) =>
                    updateSetting(
                      "defaultPrice",
                      event.target.value
                    )
                  }
                  className="
                    pl-7
                    pr-4
                    py-3
                    rounded-xl
                    bg-gray-900
                    border
                    border-white/10
                    text-white
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                    w-40
                  "
                />
              </div>

              {/* +100 */}
              <button
                type="button"
                onClick={() =>
                  changePrice(100)
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-gray-800
                  border
                  border-white/10
                  text-white
                  hover:bg-gray-700
                  transition-colors
                "
              >
                +100
              </button>

              {/* +500 */}
              <button
                type="button"
                onClick={() =>
                  changePrice(500)
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  bg-gray-800
                  border
                  border-white/10
                  text-white
                  hover:bg-gray-700
                  transition-colors
                "
              >
                +500
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Default price used when creating P2P
              meetings.
            </p>
          </div>
        </div>

        {/* =====================================================
            TIMING SETTINGS
        ====================================================== */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />

            <h2
              className="text-lg text-white"
              style={{
                fontWeight: 600,
              }}
            >
              Timing & Deadlines
            </h2>
          </div>

          <div className="space-y-5">
            {/* PAYMENT DEADLINE */}
            <div>
              <label
                className="block text-sm text-gray-300 mb-2"
                style={{
                  fontWeight: 500,
                }}
              >
                Payment Deadline (hours)
              </label>

              <input
                type="number"
                min="1"
                value={
                  settings.paymentDeadline
                }
                onChange={(event) =>
                  updateSetting(
                    "paymentDeadline",
                    event.target.value
                  )
                }
                className="
                  w-full
                  max-w-xs
                  px-4
                  py-3
                  rounded-xl
                  bg-gray-900
                  border
                  border-white/10
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-1">
                Time limit for users to complete payment.
              </p>
            </div>

            {/* AUTO CANCEL */}
            <div>
              <label
                className="block text-sm text-gray-300 mb-2"
                style={{
                  fontWeight: 500,
                }}
              >
                Auto Cancel Timeout (hours)
              </label>

              <input
                type="number"
                min="1"
                value={
                  settings.autoCancelTimeout
                }
                onChange={(event) =>
                  updateSetting(
                    "autoCancelTimeout",
                    event.target.value
                  )
                }
                className="
                  w-full
                  max-w-xs
                  px-4
                  py-3
                  rounded-xl
                  bg-gray-900
                  border
                  border-white/10
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-1">
                Automatically cancel a meeting if the required
                payment is not received.
              </p>
            </div>

            {/* SCHEDULING TIME */}
            <div>
              <label
                className="block text-sm text-gray-300 mb-2"
                style={{
                  fontWeight: 500,
                }}
              >
                Admin Scheduling Time Limit (hours)
              </label>

              <input
                type="number"
                min="1"
                value={
                  settings.schedulingTimeLimit
                }
                onChange={(event) =>
                  updateSetting(
                    "schedulingTimeLimit",
                    event.target.value
                  )
                }
                className="
                  w-full
                  max-w-xs
                  px-4
                  py-3
                  rounded-xl
                  bg-gray-900
                  border
                  border-white/10
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-1">
                Time limit for admin to schedule paid
                meetings.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            LOCATION SETTINGS
        ====================================================== */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-purple-400" />

            <h2
              className="text-lg text-white"
              style={{
                fontWeight: 600,
              }}
            >
              Location Settings
            </h2>
          </div>

          <div className="space-y-6">
            {/* ALLOWED CITIES */}
            <div>
              <label
                className="block text-sm text-gray-300 mb-3"
                style={{
                  fontWeight: 500,
                }}
              >
                Allowed Cities
              </label>

              {citiesLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600 border-t-blue-400 animate-spin" />
                  Loading cities...
                </div>
              ) : cities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-4">
                  <p className="text-sm text-gray-400">
                    No city records were found in
                    p2p_allowed_cities.
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Default supported cities in the current
                    UI: {DEFAULT_CITIES.join(", ")}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cities.map((city) => (
                    <label
                      key={city.id}
                      className="
                        flex
                        items-center
                        gap-2
                        p-3
                        rounded-xl
                        bg-gray-900
                        border
                        border-white/10
                        cursor-pointer
                        hover:border-white/20
                        transition-colors
                      "
                    >
                      <input
                        type="checkbox"
                        checked={
                          Boolean(city.enabled)
                        }
                        onChange={() =>
                          void toggleCity(city)
                        }
                        className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                      />

                      <span className="text-sm text-gray-300">
                        {city.city_name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* LOCATION PRESETS */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <label
                  className="block text-sm text-gray-300"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Meeting Location Presets
                </label>

                <button
                  type="button"
                  onClick={addPreset}
                  disabled={presetSaving}
                  className="
                    px-3
                    py-2
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-500
                    text-white
                    text-xs
                    transition-colors
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {presetSaving
                    ? "Adding..."
                    : "+ Add Preset"}
                </button>
              </div>

              <div className="space-y-2">
                {presets.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/20 p-4">
                    <p className="text-sm text-gray-400">
                      No location presets available.
                    </p>
                  </div>
                ) : (
                  presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        p-3
                        rounded-xl
                        bg-gray-900
                        border
                        border-white/10
                      "
                    >
                      <span className="text-sm text-gray-300 break-words">
                        {preset.preset_name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void removePreset(
                            preset.id
                          )
                        }
                        className="
                          flex-shrink-0
                          px-3
                          py-1
                          rounded-lg
                          bg-red-500/20
                          hover:bg-red-500/30
                          border
                          border-red-500/30
                          text-red-400
                          text-xs
                          transition-colors
                        "
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FEATURE TOGGLES
        ====================================================== */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-400" />

            <div>
              <h2
                className="text-lg text-white"
                style={{
                  fontWeight: 600,
                }}
              >
                Feature Toggles
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                These controls are currently local UI
                controls. No persistence fields for them were
                present in the supplied P2P settings code.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* PUBLIC PROFILES */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p
                  className="text-sm text-white"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Allow Public P2P Profiles
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Users can make their P2P profile public.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    allowPublicProfiles
                  }
                  onChange={(event) =>
                    setAllowPublicProfiles(
                      event.target.checked
                    )
                  }
                />

                <div
                  className="
                    w-11
                    h-6
                    bg-gray-700
                    peer-focus:outline-none
                    peer-focus:ring-2
                    peer-focus:ring-blue-500
                    rounded-full
                    peer
                    peer-checked:after:translate-x-full
                    peer-checked:after:border-white
                    after:content-['']
                    after:absolute
                    after:top-[2px]
                    after:left-[2px]
                    after:bg-white
                    after:rounded-full
                    after:h-5
                    after:w-5
                    after:transition-all
                    peer-checked:bg-blue-600
                  "
                />
              </label>
            </div>

            {/* ADMIN APPROVAL */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p
                  className="text-sm text-white"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Require Admin Approval
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  All meetings require admin scheduling.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    requireAdminApproval
                  }
                  onChange={(event) =>
                    setRequireAdminApproval(
                      event.target.checked
                    )
                  }
                />

                <div
                  className="
                    w-11
                    h-6
                    bg-gray-700
                    peer-focus:outline-none
                    peer-focus:ring-2
                    peer-focus:ring-blue-500
                    rounded-full
                    peer
                    peer-checked:after:translate-x-full
                    peer-checked:after:border-white
                    after:content-['']
                    after:absolute
                    after:top-[2px]
                    after:left-[2px]
                    after:bg-white
                    after:rounded-full
                    after:h-5
                    after:w-5
                    after:transition-all
                    peer-checked:bg-blue-600
                  "
                />
              </label>
            </div>

            {/* AUTO REFUND */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-900 border border-white/30">
              <div>
                <p
                  className="text-sm text-white"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Auto-Refund on Cancel
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Automatically refund when a meeting is
                  cancelled.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={
                    autoRefundOnCancel
                  }
                  onChange={(event) =>
                    setAutoRefundOnCancel(
                      event.target.checked
                    )
                  }
                />

                <div
                  className="
                    w-11
                    h-6
                    bg-gray-700
                    peer-focus:outline-none
                    peer-focus:ring-2
                    peer-focus:ring-blue-500
                    rounded-full
                    peer
                    peer-checked:after:translate-x-full
                    peer-checked:after:border-white
                    after:content-['']
                    after:absolute
                    after:top-[2px]
                    after:left-[2px]
                    after:bg-white
                    after:rounded-full
                    after:h-5
                    after:w-5
                    after:transition-all
                    peer-checked:bg-blue-600
                  "
                />
              </label>
            </div>
          </div>
        </div>

        {/* =====================================================
            SAVE BUTTON
        ====================================================== */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveSettings}
            disabled={
              saving || !hasChanges
            }
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              text-white
              transition-colors
              flex
              items-center
              gap-2
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Save
              className={`w-5 h-5 ${
                saving
                  ? "animate-pulse"
                  : ""
              }`}
            />

            <span>
              {saving
                ? "Saving..."
                : "Save Settings"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}