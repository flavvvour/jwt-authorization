import React, { FC, useContext, useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { IUser } from "./model/IUser";
import UserService from "./services/UserService";
import "./reset.css";
import "./App.css";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, [store]);

  async function getUsers() {
    setIsLoadingUsers(true);
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
      setIsButtonDisabled(false);
    } catch (error) {
      console.log(error);
      setIsButtonDisabled(true);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  if (store.isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p className="loading-text">Загрузка...</p>
      </div>
    );
  }

  if (!store.isAuth) {
    return (
      <div className="login-page">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <div className="user-details">
            <h1 className="user-greeting">
              Привет, {store.user.email.split("@")[0]}!
            </h1>

            <p className="user-email">{store.user.email}</p>
          </div>

          <div className="user-status">
            <span
              className={`status-badge ${
                store.user.isActivated ? "active" : "inactive"
              }`}
            >
              {store.user.isActivated
                ? "✓ Аккаунт подтвержден"
                : "Требуется подтверждение"}
            </span>
          </div>
        </div>
        <button className="btn btn-logout" onClick={() => store.logout()}>
          Выйти
        </button>
      </header>

      <main className="dashboard-content">
        <div className="actions-panel">
          <button
            className="btn btn-primary btn-large"
            onClick={getUsers}
            disabled={isLoadingUsers || isButtonDisabled}
          >
            {isLoadingUsers ? (
              <>
                <span className="spinner-small"></span>
                Загрузка...
              </>
            ) : (
              "Cписок пользователей"
            )}
          </button>
        </div>

        {users.length > 0 && (
          <div className="users-section">
            <h2 className="section-title">
              Пользователи системы <span className="badge">{users.length}</span>
            </h2>

            <div className="users-grid">
              {users.map((user, index) => (
                <div key={`${user.id}-${index}`} className="user-card">
                  <div className="user-card-info">
                    <h3 className="user-card-email">{user.email}</h3>
                    <span
                      className={`user-card-status ${
                        user.isActivated ? "activated" : "pending"
                      }`}
                    >
                      {user.isActivated ? "Подтвержден" : "Не подтвержден"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© 2026 JWT Auth System by flavvvour</p>
        <p className="footer-info">
          Access токен действителен: 15 минут | Refresh токен: 30 дней
        </p>
      </footer>
    </div>
  );
};

export default observer(App);
