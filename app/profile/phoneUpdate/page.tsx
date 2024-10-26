import { auth, signInWithPhoneNumber, RecaptchaVerifier } from "@/config/firebase";
import { useEffect, useState } from "react";

const PhoneVerification: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    return (
        <div> Ok Bro!</div>
    )
}

export default PhoneVerification