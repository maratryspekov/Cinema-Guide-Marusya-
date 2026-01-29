import React, { useState } from "react";
import type { FC } from "react";
import s from "../LoginForm/LoginForm.module.scss";
import LogoBlack from "../../../assets/icons/icon-logo-black.svg";
import EmailIcon from "../../../assets/icons/icon-email.svg?react";
import PasswordIcon from "../../../assets/icons/icon-password.svg?react";
import FormField from "../../ui/FormField/FormField";

import {
  useLoginMutation,
  useLazyFetchMeQuery,
} from "../../../features/auth/authApi";
import { useAppDispatch } from "../../../app/hooks";
import { setUser } from "../../../features/auth/authSlice";

export type LoginData = { email: string; password: string };

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onLogin: (data: LoginData) => void;
  externalError?: string | null;
  onClose?: () => void;
};

const LoginForm: FC<LoginFormProps> = ({
  onSwitchToRegister,
  onLogin,
  externalError,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });

  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [fetchMe] = useLazyFetchMeQuery();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = email.trim() === "";
    const passwordError = password.trim() === "";
    setErrors({ email: emailError, password: passwordError });
    if (emailError || passwordError) return;

    try {
      await login({ email, password }).unwrap();
      const me = await fetchMe().unwrap();
      dispatch(setUser(me));
      onLogin({ email, password });
      onClose?.();
    } catch (err) {
      console.error(err);
    }
  };

  const errorMessage =
    (error &&
      "status" in error &&
      typeof error.status === "number" &&
      (error as any).data?.message) ||
    (error && "error" in error && (error as any).error) ||
    "";

  const combinedError = externalError || errorMessage;

  return (
    <form className={s.form} onSubmit={submitHandler}>
      <div className={s.logo_wrapper}>
        <img src={LogoBlack} alt="Marusya logo black" />
      </div>

      <div className={s.inputContainer}>
        <FormField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<EmailIcon />}
        />
        <FormField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<PasswordIcon />}
        />
      </div>

      {combinedError && <div className={s.errorMessage}>{combinedError}</div>}

      <button type="submit" className={s.button} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <p onClick={onSwitchToRegister} className={s.registerText}>
        Register
      </p>
    </form>
  );
};

export default LoginForm;
