import { NavLink } from "react-router-dom";
import { useLogout } from "./Auth/authQueryHooks";
import { useAuth } from "./Auth/context";

function NavMenu() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav>
      <div className="link-list">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/habits">Habits</NavLink>
      </div>
      {user && (
        <div className="sign-out">
          <p>Hello {user.email}</p>
          <button id="logout-btn" onClick={logout} disabled={isPending}>
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
export default NavMenu;
