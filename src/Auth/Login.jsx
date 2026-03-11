import { Link } from "react-router-dom";
import { useLogin } from "./authQueryHooks";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.target));
    login({ email, password });
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-input">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </div>
        <div className="form-input">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" required />
        </div>
        {error && <p className="auth-error">{error.response?.data?.message}</p>}
        <button disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="auth-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
