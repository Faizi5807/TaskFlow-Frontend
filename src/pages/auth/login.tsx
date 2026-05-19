import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/inputField";
import Button from "../../components/button";
import { useAuth } from "../../store/auth-context";
import { useToast } from "../../components/toast";
import { apiClient } from "../../api-handler/api-client";
import { API_URLS } from "../../api-handler/api-urls";
import { decodeToken } from "../../store/auth-store";
import type { ILoginResponse } from "../../config/interfaces/auth";
import styles from "./styles.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post<ILoginResponse>(
        API_URLS.LOGIN,
        { email, password },
        false
      );

      // The login endpoint returns { token, email } directly (not wrapped in data)
      const tokenData = (response as unknown as ILoginResponse).token
        ? (response as unknown as ILoginResponse)
        : response.data;

      const token = tokenData.token;
      const userEmail = tokenData.email;

      // Decode JWT to get user info
      const decoded = decodeToken(token);
      const userName =
        (decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) ||
        (decoded?.name as string) ||
        userEmail;
      const userRole = decoded?.role
        ? Number(decoded.role)
        : (decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as number | undefined);
      const userId = decoded?.sub
        ? Number(decoded.sub)
        : (decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
            ? Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
            : undefined);

      login(token, {
        email: userEmail,
        name: userName,
        role: userRole ? Number(userRole) : undefined,
        id: userId,
      });

      showToast("Welcome back! 🎉", "success");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoBox}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Sign in to your TaskFlow account</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
