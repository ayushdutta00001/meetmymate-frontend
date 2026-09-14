import React, { useEffect, useState } from 'react';
import { supabase } from "../../../supabase";
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard,
  Wallet,
  Smartphone,
  Lock,
  CheckCircle2,
  Star,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  PartyPopper,
  ArrowRight,
  Shield,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface RentFriendPaymentProps {
  onNavigate: (
  page: string,
  param?: string
) => void;
  onBack: () => void;
  paymentData?: string;
}

export function RentFriendPayment({
  onNavigate,
  onBack,
  paymentData
}: RentFriendPaymentProps){

    useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] =
  useState<any>(null);
 
 
const [incomingBooking, setIncomingBooking] =
  useState<any>(null);

  const serviceNames: Record<string, string> = {
    'movie-buddy': 'Movie Buddy',
    'dining-partner': 'Dining Partner',
    'party-companion': 'Party Companion',
    'explore-city': 'Explore City',
    'emotional-support': 'Emotional Support',
    'study-partner': 'Study Partner',
    'coffee-chat': 'Coffee Chat',
    'gaming-buddy': 'Gaming Buddy',
    'shopping-companion': 'Shopping Companion',
    'photo-walk': 'Photo Walk',
    'concert-buddy': 'Concert Buddy',
    'workout-partner': 'Workout Partner',
  };

  const parsedData = paymentData
  ? JSON.parse(paymentData)
  : null;



const bookingData = parsedData || {};
const booking = {
  providers: {
    full_name:
      bookingData.providerName,

    profile_photo_url:
      bookingData.providerImage,

    avg_rating:
      bookingData.providerRating,
  },

  booking_date:
    bookingData.date,

  booking_time:
    bookingData.time,

  duration_hours:
    bookingData.duration,

  meetup_location:
    bookingData.location,

  total_amount:
    bookingData.total,

    basePrice:
  bookingData.total,

discount: 0,

platformFee:
  Math.round(
    bookingData.total * 0.2
  ),

  special_request:
    bookingData.notes,

  payment_status: "paid",

  booking_status:
  "pending_provider_acceptance"
};

const selectedService =
  bookingData?.service || "movie-buddy";

  

  useEffect(() => {

  if (!createdBooking?.id) return;

  const channel = supabase

    .channel("user-booking-status")

    .on(

      "postgres_changes",

      {
        event: "UPDATE",

        schema: "public",

        table: "rent_friend_bookings",

        filter:
          `id=eq.${createdBooking.id}`,
      },

      async (payload) => {

        console.log(
          "BOOKING STATUS UPDATE:",
          payload.new
        );

const { data: freshBooking } =
  await supabase
    .from("rent_friend_bookings")
    .select(`
      *,
      providers (
        full_name,
        profile_photo_url,
        phone,
        avg_rating
      )
    `)
    .eq("id", payload.new.id)
    .single();

setCreatedBooking(freshBooking);

if (
  payload.new.booking_status ===
  "confirmed"
) {

  setTimeout(() => {

   onNavigate(
  "rent-friend-booking-details",
  payload.new.id
);

  }, 2000);

}

if (
  payload.new.booking_status ===
  "provider_not_found"
) {

 alert(
  "Sorry, no nearby provider is currently available. Your payment will be refunded according to platform policy."
);
}

      }
    )

    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [createdBooking?.id]);


 const handlePayment = async () => {

  try {

    setProcessing(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setProcessing(false);
      return;
    }

    
   

let customerLatitude: number | null = null;
let customerLongitude: number | null = null;
let customerCity: string | null = null;
try {
  const position = await new Promise<GeolocationPosition>(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  );

  customerLatitude = position.coords.latitude;
  customerLongitude = position.coords.longitude;

  try {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${customerLatitude}&lon=${customerLongitude}`
  );

  const address = await response.json();

  customerCity =
    address.address?.city ||
    address.address?.town ||
    address.address?.village ||
    address.address?.state_district ||
    null;

  console.log("Customer City:", customerCity);

} catch (e) {
  console.log("Unable to detect customer city");
}

} catch (err) {
  console.log("Customer location unavailable");
}

// --------------------------------------------------
// STEP 0: CHECK PROVIDER AVAILABILITY BEFORE PAYMENT
// --------------------------------------------------

console.log(
  "CHECKING PROVIDER AVAILABILITY BEFORE PAYMENT..."
);

const {
  data: availabilityData,
  error: availabilityError,
} =
  await supabase.functions.invoke(
    "check-rent-friend-availability",
    {
      body: {
        service_type:
          bookingData.service,

        booking_date:
          bookingData.date,

        booking_time:
          bookingData.time,

        duration_hours:
          bookingData.duration,

        customer_latitude:
          customerLatitude,

        customer_longitude:
          customerLongitude,

        customer_city:
          customerCity,
      },
    }
  );

console.log(
  "PROVIDER AVAILABILITY RESULT:",
  availabilityData
);

if (availabilityError) {

  console.error(
    "Provider availability check failed:",
    availabilityError
  );

  alert(
    "We could not check provider availability. Please try again."
  );

  setProcessing(false);
  return;
}

if (
  !availabilityData?.success
) {

  console.error(
    "Invalid availability response:",
    availabilityData
  );

  alert(
    "We could not check provider availability. Please try again."
  );

  setProcessing(false);
  return;
}

// --------------------------------------------------
// NO PROVIDER AVAILABLE
// --------------------------------------------------

if (
  availabilityData.available !== true ||
  !availabilityData.provider_count ||
  availabilityData.provider_count < 1
) {

  console.log(
    "NO PROVIDER AVAILABLE - PAYMENT STOPPED"
  );

  alert(
    "Sorry, no nearby provider is currently available for this service. Please try again later."
  );

  setProcessing(false);
  return;
}

// --------------------------------------------------
// PROVIDER AVAILABLE
// --------------------------------------------------

console.log(
  "PROVIDER AVAILABLE:",
  availabilityData.selected_provider
);

console.log(
  `Found ${availabilityData.provider_count} available provider(s).`
);




// STEP 1: CREATE RAZORPAY ORDER
console.log("BOOKING TOTAL:", bookingData.total);
console.log(
  "RAZORPAY AMOUNT IN PAISE:",
  Math.round(Number(bookingData.total) * 100)
);

const { data: orderData, error: orderError } =
  await supabase.functions.invoke(
    "create-razorpay-order",
    {
      body: {
        amount: Math.round(
          Number(bookingData.total) * 100
        ),
        currency: "INR",
        receipt: `raf_${user.id}_${Date.now()}`,
      },
    }
  );

console.log(
  "RAZORPAY ORDER RESULT:",
  orderData
);

if (orderError) {
  console.error(
    "Create Razorpay Order Error:",
    orderError
  );

  alert(
    "Unable to start payment. Please try again."
  );

  setProcessing(false);
  return;
}

if (
  !orderData?.success ||
  !orderData?.order?.id ||
  !orderData?.key_id
) {
  console.error(
    "Invalid Razorpay order response:",
    orderData
  );

  alert(
    "Unable to start payment. Please try again."
  );

  setProcessing(false);
  return;
}


// STEP 2: OPEN RAZORPAY CHECKOUT

const Razorpay = (window as any).Razorpay;

if (!Razorpay) {
  alert(
    "Payment system is still loading. Please try again."
  );

  setProcessing(false);
  return;
}

const options = {
  key: orderData.key_id,

  amount:
    orderData.order.amount,

  currency:
    orderData.order.currency,

  name: "Rent a Friend",

  description:
    `${serviceNames[bookingData.service] || "Rent a Friend"} Booking`,

  order_id:
    orderData.order.id,

  prefill: {
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",

    email:
      user.email || "",
  },

  theme: {
    color: "#8B5CF6",
  },

  handler: async function (
    response: any
  ) {

    console.log(
      "RAZORPAY PAYMENT SUCCESS:",
      response
    );

    setProcessing(true);

    // STEP 3: VERIFY PAYMENT

    const {
      data: verificationData,
      error: verificationError,
    } =
      await supabase.functions.invoke(
        "verify-razorpay-payment",
        {
          body: {
            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,

            amount:
              Math.round(
                Number(bookingData.total) * 100
              ),
          },
        }
      );

    console.log(
      "PAYMENT VERIFICATION RESULT:",
      verificationData
    );

    if (
      verificationError ||
      !verificationData?.success
    ) {

      console.error(
        "Payment verification failed:",
        verificationError ||
          verificationData
      );

      alert(
        "Payment could not be verified. Please contact support if your bank was charged."
      );

      setProcessing(false);
      return;
    }


    // STEP 4: PAYMENT VERIFIED
    // NOW CREATE THE REAL BOOKING

    const {
      data: bookingResult,
      error: bookingError,
    } =
      await supabase.functions.invoke(
        "assign-rent-friend-booking",
        {
          body: {
            service_type:
              bookingData.service,

            booking_date:
              bookingData.date,

            booking_time:
              bookingData.time,

            duration_hours:
              bookingData.duration,

            meetup_location:
              bookingData.location,

            special_request:
              bookingData.notes,

            total_amount:
              bookingData.total,

            customer_latitude:
              customerLatitude,

            customer_longitude:
              customerLongitude,

            customer_city:
              customerCity,

            payment_id:
              response.razorpay_payment_id,

            razorpay_order_id:
              response.razorpay_order_id,
          },
        }
      );

    console.log(
      "BOOKING CREATION RESULT:",
      bookingResult
    );

    if (
      bookingError ||
      !bookingResult?.success
    ) {

      console.error(
        "Booking creation failed after payment:",
        bookingError ||
          bookingResult
      );

      alert(
        "Payment was successful, but we could not create your booking. Please contact support."
      );

      setProcessing(false);
      return;
    }


    // STEP 5: SHOW BOOKING SCREEN

    setCreatedBooking(
      bookingResult.booking
    );

    setProcessing(false);

    setShowSuccess(true);
  },

  modal: {
    ondismiss: function () {
      console.log(
        "Razorpay checkout closed by user"
      );

      setProcessing(false);
    },
  },
};

const razorpay =
  new Razorpay(options);

razorpay.open();

} catch (err) {

  console.error(err);

  setProcessing(false);

}

};
 



  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="p-8 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {
createdBooking?.booking_status ===
"provider_not_found"

? "No Nearby Provider Available"

: createdBooking?.booking_status ===
  "pending_provider_acceptance"

? "Finding Your Friend..."

: "Booking Confirmed!"
}
              </h2>
             <p className="
  text-gray-600 dark:text-gray-400
  mb-6
">

{
  createdBooking?.booking_status ===
  "pending_provider_acceptance"

    ? "We're finding the best available friend for you."

    : `Your booking with
       ${createdBooking?.providers?.full_name}
       has been confirmed`
}

</p>

{createdBooking?.booking_status ===
 "pending_provider_acceptance" && (

  <div className="
    flex flex-col items-center
    mb-6
  ">

    <div className="
      w-14 h-14
      border-4
      border-purple-500/20
      border-t-purple-500
      rounded-full
      animate-spin
    " />

   <p className="
  mt-4 text-sm
  text-gray-400
">
  Your booking has been created successfully.

  <br />

  We are waiting for a nearby provider to accept your request.

  <br />

  This usually takes less than a minute.
</p>

  </div>

)}

              {/* Booking Details */}
{
createdBooking?.booking_status ===
"confirmed" && (

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={createdBooking?.providers?.profile_photo_url}
                    alt={createdBooking?.providers?.full_name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h4 className="mb-1">{createdBooking?.providers?.full_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span>{createdBooking?.providers?.avg_rating || 4.8}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{createdBooking?.booking_date} at {createdBooking?.booking_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>{`${createdBooking?.duration_hours} Hours`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="line-clamp-1">{createdBooking?.meetup_location}</span>
                  </div>
                </div>
              </div>
)}
{createdBooking?.special_request && (
  <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
    <MessageSquare className="w-4 h-4 text-amber-500" />

    <span>
      {createdBooking.special_request}
    </span>
  </div>
)}
              {/* Booking ID */}
              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking ID</div>
                <div className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                  RF-{createdBooking?.id?.slice(0, 8).toUpperCase()}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Confirmation sent to your email and notifications
              </p>
              
            </motion.div>
            

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: Math.random() * 400, opacity: 1 }}
                  animate={{ y: 600, opacity: 0 }}
                  transition={{ duration: 2, delay: Math.random() * 0.5 }}
                  className="absolute"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} />
            <div>
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {serviceNames[selectedService]} - Payment
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete your booking securely
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-green-700 dark:text-green-300 mb-1">Secure Payment</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </motion.div>

{/* Razorpay Payment */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
  className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
>
  <div className="flex items-start gap-4">

    <div className="
      w-12 h-12
      rounded-2xl
      bg-gradient-to-br
      from-purple-500
      to-pink-500
      flex
      items-center
      justify-center
      flex-shrink-0
    ">
      <CreditCard className="w-6 h-6 text-white" />
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-1">
        Secure Payment
      </h3>

      <p className="
        text-sm
        text-gray-600
        dark:text-gray-400
        leading-relaxed
      ">
        Click "Confirm & Pay" below to open
        Razorpay Checkout. You can choose your
        preferred payment method there, including
        card, UPI, wallet, and other available options.
      </p>
    </div>

  </div>
</motion.div>

           {/* Refund & Cancellation Policy */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="
    rounded-2xl
    bg-amber-50
    dark:bg-amber-900/20
    border
    border-amber-200
    dark:border-amber-800
    overflow-hidden
  "
>
  {/* Policy Header */}
  <button
    type="button"
    onClick={() =>
      setShowRefundPolicy((prev) => !prev)
    }
    className="
      w-full
      p-4
      flex
      items-center
      justify-between
      gap-3
      text-left
      hover:bg-amber-100/50
      dark:hover:bg-amber-900/30
      transition-all
    "
  >
    <div className="flex items-start gap-3">

      <div className="
        p-2
        rounded-xl
        bg-amber-500
        flex-shrink-0
      ">
        <AlertCircle className="w-5 h-5 text-white" />
      </div>

      <div>
        <h4 className="
          font-semibold
          text-amber-800
          dark:text-amber-300
        ">
          Refund & Cancellation Policy
        </h4>

        <p className="
          mt-1
          text-sm
          text-amber-700
          dark:text-amber-400
        ">
          Your payment is protected by our refund policy.
        </p>
      </div>

    </div>

    <span className="
      text-sm
      font-medium
      text-amber-700
      dark:text-amber-300
      flex-shrink-0
    ">
      {showRefundPolicy
        ? "Hide"
        : "View Policy"}
    </span>
  </button>

  {/* Policy Content */}
  {showRefundPolicy && (
    <div className="
      px-5
      pb-5
      pt-1
      border-t
      border-amber-200/70
      dark:border-amber-800/70
    ">

      <div className="
        space-y-4
        text-sm
        text-amber-800
        dark:text-amber-300
      ">

        <div>
          <p className="font-semibold mb-1">
            No provider available
          </p>

          <p className="
            text-amber-700
            dark:text-amber-400
            leading-relaxed
          ">
            If no suitable provider is available
            before payment, you will not be charged.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1">
            Provider rejects your request
          </p>

          <p className="
            text-amber-700
            dark:text-amber-400
            leading-relaxed
          ">
            We will try to find another available
            provider for your booking.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1">
            No replacement provider available
          </p>

          <p className="
            text-amber-700
            dark:text-amber-400
            leading-relaxed
          ">
            If all eligible providers reject or the
            request expires without another provider
            being available, your payment will be
            automatically refunded.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-1">
            Refund status
          </p>

          <p className="
            text-amber-700
            dark:text-amber-400
            leading-relaxed
          ">
            Once the refund is successfully processed,
            the refund details are recorded with your
            booking.
          </p>
        </div>

        <div className="
          pt-3
          border-t
          border-amber-200/70
          dark:border-amber-800/70
        ">
          <p className="
            text-xs
            text-amber-600
            dark:text-amber-500
            leading-relaxed
          ">
            Refund processing and the time required
            for the amount to appear in your account
            may vary depending on your bank or payment
            provider.
          </p>
        </div>

      </div>

    </div>
  )}
</motion.div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg mb-4">Booking Summary</h3>

              {/* Partner Card */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={createdBooking?.providers?.profile_photo_url}
                    alt={createdBooking?.providers?.full_name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{createdBooking?.providers?.full_name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span>{createdBooking?.providers?.avg_rating || 4.8}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Date & Time</div>
                    <div className="font-medium">
  {booking.booking_date} at {booking.booking_time}
</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Duration</div>
                    <div className="font-medium">{`${booking.duration_hours} Hours`}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Location</div>
                    <div className="font-medium line-clamp-2">{booking.meetup_location}</div>
                  </div>
                </div>
              </div>
{booking.special_request && (
  <div className="flex items-start gap-2 mt-3">
    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />

    <div>
      <p className="text-xs text-gray-500">
        Additional Notes
      </p>

      <p className="text-sm">
        {booking.special_request}
      </p>
    </div>
  </div>
)}
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                  <span>₹{booking.total_amount}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span>₹{Math.round(booking.total_amount * 0.2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{booking.total_amount}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  processing
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirm & Pay ₹{booking.total_amount}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4">
                100% Money Back Guarantee
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
