import React, { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Lock,
  Save,
  Settings,
} from "lucide-react";

interface BlindDateSettingsState {
  price: number;
  autoFlagHours: number;
  highRiskHours: number;
  autoRefundHours: number;
  requireEmail: boolean;
  requirePhone: boolean;
  allowMultiBookings: boolean;
  hideUserUntilConfirmed: boolean;
  emailNotifications: boolean;
}

const DEFAULT_SETTINGS: BlindDateSettingsState = {
  price: 399,
  autoFlagHours: 24,
  highRiskHours: 48,
  autoRefundHours: 24,
  requireEmail: true,
  requirePhone: true,
  allowMultiBookings: false,
  hideUserUntilConfirmed: true,
  emailNotifications: true,
};

export function BlindDateSettings() {
  const [settings, setSettings] =
    useState<BlindDateSettingsState>(DEFAULT_SETTINGS);

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  // =========================================================
  // LOAD SETTINGS
  // =========================================================
  const loadSettings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await api.get<any>(
        "admin_get_service_settings"
      );

      console.log(
        "BLIND DATE SETTINGS RESPONSE:",
        res
      );

      if (!res?.success) {
        throw new Error(
          res?.error ||
            "Unable to load Blind Date settings."
        );
      }

      const s = res?.data ?? {};

      setSettings({
        // Blind Date is a fixed ₹399 service.
        price: 399,

        autoFlagHours:
          Number(
            s.auto_flag_hours ??
              DEFAULT_SETTINGS.autoFlagHours
          ),

        highRiskHours:
          Number(
            s.high_risk_hours ??
              DEFAULT_SETTINGS.highRiskHours
          ),

        autoRefundHours:
          Number(
            s.auto_refund_hours ??
              DEFAULT_SETTINGS.autoRefundHours
          ),

        requireEmail:
          s.require_email ??
          DEFAULT_SETTINGS.requireEmail,

        requirePhone:
          s.require_phone ??
          DEFAULT_SETTINGS.requirePhone,

        allowMultiBookings:
          s.allow_multi_bookings ??
          DEFAULT_SETTINGS.allowMultiBookings,

        hideUserUntilConfirmed:
          s.hide_user_until_confirmed ??
          DEFAULT_SETTINGS.hideUserUntilConfirmed,

        emailNotifications:
          s.email_notifications ??
          DEFAULT_SETTINGS.emailNotifications,
      });

      setHasChanges(false);
    } catch (error) {
      console.error(
        "BLIND DATE SETTINGS LOAD ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load Blind Date settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    void loadSettings();
  }, []);

  // =========================================================
  // UPDATE NUMBER SETTING
  // =========================================================
  const updateNumberSetting = (
    field:
      | "autoFlagHours"
      | "highRiskHours"
      | "autoRefundHours",
    value: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setHasChanges(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // =========================================================
  // UPDATE BOOLEAN SETTING
  // =========================================================
  const updateBooleanSetting = (
    field:
      | "requireEmail"
      | "requirePhone"
      | "allowMultiBookings"
      | "hideUserUntilConfirmed"
      | "emailNotifications",
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setHasChanges(true);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // =========================================================
  // VALIDATE SETTINGS
  // =========================================================
  const validateSettings = () => {
    if (
      !Number.isFinite(settings.autoFlagHours) ||
      settings.autoFlagHours <= 0
    ) {
      return "Auto-Flag Threshold must be greater than 0 hours.";
    }

    if (
      !Number.isFinite(settings.highRiskHours) ||
      settings.highRiskHours <= 0
    ) {
      return "High Risk Threshold must be greater than 0 hours.";
    }

    if (
      !Number.isFinite(settings.autoRefundHours) ||
      settings.autoRefundHours <= 0
    ) {
      return "Auto-Refund Threshold must be greater than 0 hours.";
    }

    if (
      settings.highRiskHours <
      settings.autoFlagHours
    ) {
      return "High Risk Threshold cannot be lower than Auto-Flag Threshold.";
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
        // Fixed Blind Date price.
        blind_date_price: 399,

        auto_flag_hours:
          settings.autoFlagHours,

        high_risk_hours:
          settings.highRiskHours,

        auto_refund_hours:
          settings.autoRefundHours,

        require_email:
          settings.requireEmail,

        require_phone:
          settings.requirePhone,

        allow_multi_bookings:
          settings.allowMultiBookings,

        hide_user_until_confirmed:
          settings.hideUserUntilConfirmed,

        email_notifications:
          settings.emailNotifications,
      };

      const res = await api.post<any>(
        "admin_update_service_settings",
        payload
      );

      console.log(
        "BLIND DATE SETTINGS SAVE RESPONSE:",
        res
      );

      if (!res?.success) {
        throw new Error(
          res?.error ||
            "Unable to save Blind Date settings."
        );
      }

      // Keep price locked to the actual fixed price.
      setSettings((prev) => ({
        ...prev,
        price: 399,
      }));

      setHasChanges(false);
      setSuccessMessage(
        "Blind Date settings saved successfully."
      );
    } catch (error) {
      console.error(
        "BLIND DATE SETTINGS SAVE ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save Blind Date settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // TOGGLE COMPONENT
  // =========================================================
  const Toggle = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }) => {
    return (
      <label
        className={`relative inline-flex items-center ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.checked)
          }
          className="sr-only peer"
        />

        <div
          className="
            w-14 h-7
            bg-gray-700
            peer-focus:outline-none
            peer-focus:ring-4
            peer-focus:ring-blue-800
            rounded-full
            peer
            peer-checked:after:translate-x-full
            peer-checked:after:border-white
            after:content-['']
            after:absolute
            after:top-0.5
            after:left-[4px]
            after:bg-white
            after:border-gray-300
            after:border
            after:rounded-full
            after:h-6
            after:w-6
            after:transition-all
            peer-checked:bg-blue-600
          "
        />
      </label>
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-gray-400 mt-4">
            Loading Blind Date settings...
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
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className="text-2xl lg:text-3xl text-white mb-2"
                style={{ fontWeight: 700 }}
              >
                System & Security Settings
              </h1>

              <p className="text-sm text-gray-400">
                Configure Blind Date service parameters
              </p>
            </div>

            {hasChanges && (
              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  hover:from-blue-500
                  hover:to-indigo-500
                  text-white
                  rounded-xl
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                <Save
                  className={`w-5 h-5 ${
                    saving ? "animate-pulse" : ""
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

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* =====================================================
            STATUS MESSAGES
        ====================================================== */}

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4">
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
          <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-4">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />

            <div className="flex-1">
              <p className="text-sm font-medium text-green-300">
                Saved
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
            PRICING CONFIGURATION
        ====================================================== */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>

            <h2
              className="text-xl text-white"
              style={{ fontWeight: 700 }}
            >
              Pricing Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm text-gray-400 mb-2"
                style={{ fontWeight: 500 }}
              >
                Fixed Blind Date Price
              </label>

              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={399}
                    readOnly
                    disabled
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-gray-700
                      bg-gray-900/50
                      text-white
                      outline-none
                      opacity-60
                      cursor-not-allowed
                    "
                  />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-xl border border-blue-500/30">
                  <Lock className="w-4 h-4" />

                  <span style={{ fontWeight: 600 }}>
                    Locked
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Blind Date is a fixed-price service. The
                customer price is ₹399 and cannot be modified
                from this page.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            OPERATIONAL SETTINGS
        ====================================================== */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <Settings className="w-6 h-6 text-indigo-400" />
            </div>

            <h2
              className="text-xl text-white"
              style={{ fontWeight: 700 }}
            >
              Operational Settings
            </h2>
          </div>

          <div className="space-y-6">
            {/* AUTO FLAG */}
            <div>
              <label
                className="block text-sm text-gray-400 mb-2"
                style={{ fontWeight: 500 }}
              >
                Auto-Flag Threshold (Hours)
              </label>

              <input
                type="number"
                min={1}
                value={settings.autoFlagHours}
                onChange={(event) =>
                  updateNumberSetting(
                    "autoFlagHours",
                    Number(event.target.value)
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-gray-700
                  bg-gray-900/50
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-2">
                Automatically flag bookings as "Delayed" after
                this many hours in holding status.
              </p>
            </div>

            {/* HIGH RISK */}
            <div>
              <label
                className="block text-sm text-gray-400 mb-2"
                style={{ fontWeight: 500 }}
              >
                High Risk Threshold (Hours)
              </label>

              <input
                type="number"
                min={1}
                value={settings.highRiskHours}
                onChange={(event) =>
                  updateNumberSetting(
                    "highRiskHours",
                    Number(event.target.value)
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-gray-700
                  bg-gray-900/50
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-2">
                Flag bookings as "High Risk" after this many
                hours without successful arrangement.
              </p>
            </div>

            {/* AUTO REFUND */}
            <div>
              <label
                className="block text-sm text-gray-400 mb-2"
                style={{ fontWeight: 500 }}
              >
                Auto-Refund Threshold (Hours)
              </label>

              <input
                type="number"
                min={1}
                value={settings.autoRefundHours}
                onChange={(event) =>
                  updateNumberSetting(
                    "autoRefundHours",
                    Number(event.target.value)
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-gray-700
                  bg-gray-900/50
                  text-white
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-transparent
                  outline-none
                "
              />

              <p className="text-xs text-gray-500 mt-2">
                Trigger the refund workflow after this many
                hours without a successful arrangement.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOOKING RULES
        ====================================================== */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Clock className="w-6 h-6 text-green-400" />
            </div>

            <h2
              className="text-xl text-white"
              style={{ fontWeight: 700 }}
            >
              Booking Rules
            </h2>
          </div>

          <div className="space-y-6">
            {/* EMAIL */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Require Email Verification
                </p>

                <p className="text-xs text-gray-500">
                  Users must verify email before booking.
                </p>
              </div>

              <Toggle
                checked={settings.requireEmail}
                onChange={(value) =>
                  updateBooleanSetting(
                    "requireEmail",
                    value
                  )
                }
              />
            </div>

            {/* PHONE */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Require Phone Verification
                </p>

                <p className="text-xs text-gray-500">
                  Users must verify phone before booking.
                </p>
              </div>

              <Toggle
                checked={settings.requirePhone}
                onChange={(value) =>
                  updateBooleanSetting(
                    "requirePhone",
                    value
                  )
                }
              />
            </div>

            {/* MULTIPLE BOOKINGS */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Allow Multiple Active Bookings
                </p>

                <p className="text-xs text-gray-500">
                  Users can have multiple simultaneous bookings.
                </p>
              </div>

              <Toggle
                checked={settings.allowMultiBookings}
                onChange={(value) =>
                  updateBooleanSetting(
                    "allowMultiBookings",
                    value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            SECURITY SETTINGS
        ====================================================== */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-red-500/20">
              <Lock className="w-6 h-6 text-red-400" />
            </div>

            <h2
              className="text-xl text-white"
              style={{ fontWeight: 700 }}
            >
              Security & Privacy
            </h2>
          </div>

          <div className="space-y-6">
            {/* HIDE USER */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Hide User Details Until Confirmed
                </p>

                <p className="text-xs text-gray-500">
                  Keep personal information private until the
                  meeting is arranged.
                </p>
              </div>

              <Toggle
                checked={
                  settings.hideUserUntilConfirmed
                }
                onChange={(value) =>
                  updateBooleanSetting(
                    "hideUserUntilConfirmed",
                    value
                  )
                }
              />
            </div>

            {/* EMAIL NOTIFICATIONS */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Send Email Notifications
                </p>

                <p className="text-xs text-gray-500">
                  Notify users of Blind Date booking status
                  changes.
                </p>
              </div>

              <Toggle
                checked={
                  settings.emailNotifications
                }
                onChange={(value) =>
                  updateBooleanSetting(
                    "emailNotifications",
                    value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE SAVE BUTTON
        ====================================================== */}
        {hasChanges && (
          <div className="flex justify-end lg:hidden">
            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-500
                hover:to-indigo-500
                text-white
                rounded-xl
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <Save
                className={`w-5 h-5 ${
                  saving ? "animate-pulse" : ""
                }`}
              />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}