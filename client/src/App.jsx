import { useState, useEffect } from "react";
import Login from "./pages/SignIn";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerHome";
import ProjectDetail from "./pages/Projectdetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);


  if (isLoggedIn && !role) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Login
      setIsLoggedIn={setIsLoggedIn}
      setRole={setRole}
    />
  }

  if (selectedProjectId) {
    return (
      <ProjectDetail
        projectId={selectedProjectId}
        onBack={() => setSelectedProjectId(null)}
      />
    );
  }

  if (role === "client") {

    return <ClientDashboard setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <FreelancerDashboard
      setIsLoggedIn={setIsLoggedIn}
      onSelectProject={(id) => setSelectedProjectId(id)}
    />
  );
}

export default App;