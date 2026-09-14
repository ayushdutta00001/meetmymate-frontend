import React, { useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../supabase";

interface Props {
  isOpen: boolean;
  providerId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function BankSetupModal({
  isOpen,
  providerId,
  onClose,
  onSaved,
}: Props) {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [loading, setLoading] = useState(false);
const [accountType, setAccountType] = useState("savings");
  if (!isOpen) return null;

  const saveBank = async () => {
    try {
      setLoading(true);

    const result = await supabase
  .from("provider_bank_accounts")
  .upsert({
    provider_id: providerId,
    account_holder_name: accountHolderName,
    bank_name: bankName,
    account_number: accountNumber,
    ifsc_code: ifscCode,
    account_type: accountType,
  })
  .select();
console.log("BANK RESULT:", result);

const { error } = result;

      if (error) {
  console.error("BANK INSERT ERROR:", error);
  alert(JSON.stringify(error, null, 2));
  return;
}

      await supabase
        .from("provider_payout_details")
        .upsert({
          provider_id: providerId,
          account_holder_name: accountHolderName,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
        });

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
      <div className=" bg-gray-900 p-6 rounded-3xl w-full max-w-md">

        <h2 className="text-2xl text-gray-300 font-bold mb-5">
          Add Bank Account
        </h2>
-
        <input
        
          placeholder="Account Holder Name"
          value={accountHolderName}
          onChange={(e) =>
            setAccountHolderName(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-3 border border-gray-600 bg-gray-800 text-white"
        />

        <input
          placeholder="Bank Name"
          value={bankName}
          onChange={(e) =>
            setBankName(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-3 border border-gray-600 bg-gray-800 text-white"
        />

        <input
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) =>
            setAccountNumber(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-3 border border-gray-600 bg-gray-800 text-white"
        />

        <input
          placeholder="IFSC Code"
          value={ifscCode}
          onChange={(e) =>
            setIfscCode(e.target.value)
          }
          className="w-full p-3 rounded-xl mb-4 border border-gray-600 bg-gray-800 text-white"
        />
<select
  value={accountType}
  onChange={(e) =>
    setAccountType(e.target.value)
  }
  className="w-full p-3 rounded-xl mb-4 border border-gray-600 bg-gray-800 text-white"
>
  <option value="savings">
    Savings Account
  </option>

  <option value="current">
    Current Account
  </option>
</select>
        <button
          onClick={saveBank}
          disabled={loading}
          className="w-full bg-blue-500 p-3 rounded-xl text-white"
        >
          Save Bank Account
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