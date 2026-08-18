import { auth, provider } from "@/firebase/firebase";
import { signInWithPopup } from "firebase/auth";

const GetCurrentUserService = async () => {
    const response = await signInWithPopup(auth, provider);
    return response;
};

export default GetCurrentUserService;
