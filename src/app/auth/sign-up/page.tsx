/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./style.module.css";

import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import { auth, db, provider } from "@/firebase/firebase";
import Link from "next/link";

const RegisterUserSchema = z
  .object({
    displayName: z.string().min(4, "Username should be of minimum 4 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => !val.includes(" "), {
        message: "Password must not contain spaces",
      }),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password not matches the above password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm Password and Password doesn't match",
  });

type RegisterFormData = z.infer<typeof RegisterUserSchema>;

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const showSnackbar = (message: string) => {
    setSnackbar({
      open: true,
      message,
    });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange",
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const { email, password, displayName } = data;

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email,
          displayName,
          createdAt: serverTimestamp(),
        });
      }

      reset();
      showSnackbar("Registration successful");
      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      showSnackbar("User Already Signed In");
      console.error(error);
    }
  };

  const handleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(result);
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName || "User",
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
      showSnackbar("Registration successful");
      router.push("/");
    } catch (err) {
      showSnackbar("Not able to sign in with google");
      router.push("/auth/sign-up");
    }
  };

  return (
    <>
      <div className={styles.design}>
        <Typography
          sx={{ color: "black", fontFamily: '"Dancing Script", cursive' }}
          variant="h3"
        >
          Chat App
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSignin}
        >
          Sign up with Google
        </Button>

        <form onSubmit={handleSubmit(handleRegister)}>
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Name"
            {...register("displayName")}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Email Address"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <FormControl fullWidth error={!!errors.password}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              sx={{ mb: 2 }}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.confirmPassword}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              sx={{ mb: 2 }}
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
            />
            <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>

          <Typography align="center" sx={{ mt: 2, color: "black" }}>
            Already have an account? <Link href="/auth/sign-up">Login</Link>
          </Typography>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </>
  );
}
