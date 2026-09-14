import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

interface AvailabilityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAvailability: DayAvailability[];
  onSave: (availability: DayAvailability[]) => void;
}

export function AvailabilityEditModal({ isOpen, onClose, initialAvailability, onSave }: AvailabilityEditModalProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>(initialAvailability);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [customSlotDay, setCustomSlotDay] = useState<string>('');
  const [newSlot, setNewSlot] = useState<TimeSlot>({ start: '09:00', end: '17:00' });
  const [showCustomSlotForm, setShowCustomSlotForm] = useState(false);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  const toggleDay = (day: string) => {
    setAvailability(availability.map(d =>
      d.day === day ? { ...d, enabled: !d.enabled } : d
    ));
  };

  const addCustomSlot = () => {
    if (!customSlotDay || !newSlot.start || !newSlot.end) {
      alert('Please fill all fields');
      return;
    }

    if (newSlot.start >= newSlot.end) {
      alert('End time must be after start time');
      return;
    }

    setAvailability(availability.map(d =>
      d.day === customSlotDay
        ? { ...d, slots: [...d.slots, newSlot] }
        : d
    ));

    setNewSlot({ start: '09:00', end: '17:00' });
    setShowCustomSlotForm(false);
    setCustomSlotDay('');
  };

  const removeSlot = (day: string, slotIndex: number) => {
    setAvailability(availability.map(d =>
      d.day === day
        ? { ...d, slots: d.slots.filter((_, i) => i !== slotIndex) }
        : d
    ));
  };

  const handleSave = () => {
    onSave(availability);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-0">Edit Availability</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your weekly schedule</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg glass dark:glass-dark flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Day Availability List */}
            <div className="space-y-4 mb-6">
              {availability.map((day) => (
                <div
                  key={day.day}
                  className={`p-4 rounded-xl transition-all ${
                    day.enabled
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                      : 'glass dark:glass-dark border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDay(day.day)}
                        className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                          day.enabled
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {day.enabled && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      <span className="font-medium">{day.day}</span>
                    </div>
                    <button
                      onClick={() => {
                        setCustomSlotDay(day.day);
                        setShowCustomSlotForm(true);
                      }}
                      className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                    >
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>

                  {day.enabled && day.slots.length > 0 && (
                    <div className="space-y-2">
                      {day.slots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800/50"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm">
                              {slot.start} - {slot.end}
                            </span>
                          </div>
                          <button
                            onClick={() => removeSlot(day.day, index)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.enabled && day.slots.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-2">
                      No time slots added. Click + to add slots.
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Slot Form */}
            {showCustomSlotForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20 mb-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="text-sm">Add Custom Time Slot</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                      Day
                    </label>
                    <select
                      value={customSlotDay}
                      onChange={(e) => setCustomSlotDay(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-green-500 dark:focus:border-green-400 transition-all outline-none text-sm"
                    >
                      <option value="">Select a day</option>
                      {availability.map((day) => (
                        <option key={day.day} value={day.day}>
                          {day.day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        Start Time
                      </label>
                      <select
                        value={newSlot.start}
                        onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-green-500 dark:focus:border-green-400 transition-all outline-none text-sm"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                        End Time
                      </label>
                      <select
                        value={newSlot.end}
                        onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-green-500 dark:focus:border-green-400 transition-all outline-none text-sm"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowCustomSlotForm(false);
                        setCustomSlotDay('');
                        setNewSlot({ start: '09:00', end: '17:00' });
                      }}
                      className="flex-1 py-2 px-4 rounded-lg glass dark:glass-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addCustomSlot}
                      className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info */}
            <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm mb-1"><strong>Availability Tips</strong></p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Toggle days on/off to control when you're available</li>
                    <li>• Add multiple time slots per day for flexibility</li>
                    <li>• Customers can only book during your available slots</li>
                    <li>• Update your availability anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass dark:glass-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
