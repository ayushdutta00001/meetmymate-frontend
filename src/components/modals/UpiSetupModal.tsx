import React, { useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../supabase";

interface Props {
  isOpen: boolean;
  providerId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function UpiSetupModal({
  isOpen,
  providerId,
  onClose,
  onSaved,
}: Props) {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const saveUpi = async () => {
  try {
    setLoading(true);

    if (!providerId) {
      alert("Provider ID missing");
      return;
    }

   const { error } = await supabase
  .from("provider_payout_details")
  .upsert(
    {
      provider_id: providerId,
      upi_id: upiId,
    },
    {
      onConflict: "provider_id",
    }
  );

if (error) {
  alert(error.message);
  return;
}

const { error: upiError } = await supabase
  .from("provider_upi_accounts")
  .upsert(
    {
      provider_id: providerId,
      upi_id: upiId,
    },
    {
      onConflict: "provider_id",
    }
  );

if (upiError) {
  alert(upiError.message);
  return;
}

    onSaved();
    onClose();

  } finally {
    setLoading(false);
  }
};
  return createPortal(
   <div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 999999999,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  }}
>
      <div className="bg-gray-900 p-6 rounded-3xl w-full max-w-md">

        <h2 className="text-2xl text-gray-300 font-bold mb-5">
          Add UPI ID
        </h2>

        <input
          placeholder="example@paytm"
          value={upiId}
          onChange={(e) =>
            setUpiId(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-4 border border-gray-600 bg-gray-800 text-white"
        />

        <button
          onClick={saveUpi}
          disabled={loading}
          className="w-full bg-green-500 p-3 rounded-xl text-white"
        >
          Save UPI ID
        </button>
  <button
          onClick={onClose}
          className="
            w-full
            mt-4
            p-3
            rounded-2xl
            border
            border-gray-700
            text-gray-400
            hover:bg-red-500
            hover:text-white
           transition
           duration-200
           ease-in-out
          "
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}