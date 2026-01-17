import React, { FC, useContext, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import "./LoginForm.css";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { store } = useContext(Context);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setPassword("");
    setEmail("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isLoginMode) {
        await store.login(email, password);
      } else {
        await store.registration(email, password);
      }
    } catch (err: any) {
      setError(
        err.message || "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
      );
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">
          {isLoginMode ? "Добро пожаловать!" : "Создание аккаунта"}
        </h1>
        <p className="login-subtitle">
          {isLoginMode
            ? "Войдите в свой аккаунт"
            : "Создай аккаунт и подтверди почту"}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Введите почту"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Пароль
            </label>
            <input
              id="password"
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Введите пароль"
              disabled={isLoading}
              autoComplete={isLoginMode ? "current-password" : "new-password"}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`submit-button ${isLoginMode ? "login" : "register"}`}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : isLoginMode ? (
              "Войти"
            ) : (
              "Зарегистрироваться"
            )}
          </button>

          <div className="mode-switch">
            <p>
              {isLoginMode ? "Нет аккаунта? " : "Уже есть аккаунт? "}
              <button
                type="button"
                className="switch-button"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLoginMode ? "Зарегистрироваться" : "Войти"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(LoginForm);
