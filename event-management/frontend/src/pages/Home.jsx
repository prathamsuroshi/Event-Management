import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <Link to="/login">Go to Login</Link> <br />
      <Link to="/register">Go to Register</Link>
    </div>
  );
}
