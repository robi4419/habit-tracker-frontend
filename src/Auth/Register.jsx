import { Link } from "react-router-dom";
import { useRegister } from "./authQueryHooks";

export default function RegisterPage() {
  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.target));
    register({ email, password });
  };

  return (
    <div className="auth-page">
      <h1>Register</h1>
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
          {isPending ? "Submitting..." : "Register"}
        </button>
      </form>
      <p className="auth-link" s>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
