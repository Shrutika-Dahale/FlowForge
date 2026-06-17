import { useEffect, useState } from "react";
import axios from "axios";
import "./FreelancerDashboard.css";

function FreelancerDashboard({ setIsLoggedIn }) {
  const [view, setView] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [updates, setUpdates] = useState({});
  const [updateInputs, setUpdateInputs] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);

  const token = localStorage.getItem("token");
  // APPLICATION SUMMARY COUNTS
  const acceptedCount = applications.filter(
    (a) => a.status === "accepted"
  ).length;

  const pendingCount = applications.filter(
    (a) => a.status === "pending"
  ).length;

  const rejectedCount = applications.filter(
    (a) => a.status === "rejected"
  ).length;

  useEffect(() => {
    fetchProjects();
    fetchApplications();
  }, []);

  // GET ALL PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://flowforge-backend-ud7x.onrender.com/api/project/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects || []);
    } catch (error) {
      console.log("fetchProjects error:", error);
    }
  };

  // GET MY APPLICATIONS
  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://flowforge-backend-ud7x.onrender.com/api/application/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications || []);
    } catch (error) {
      console.log("fetchApplications error:", error);
    }
  };

  // APPLY TO PROJECT
  const applyProject = async (id) => {
    try {
      await axios.post(
        `https://flowforge-backend-ud7x.onrender.com/api/application/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied 🚀");
      fetchApplications();
    } catch (error) {
      console.log("applyProject error:", error);
    }
  };

  // FETCH UPDATES
  const fetchUpdates = async (projectId) => {
    try {
      const res = await axios.get(
        `https://flowforge-backend-ud7x.onrender.com/api/updates/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdates((prev) => ({ ...prev, [projectId]: res.data }));
    } catch (error) {
      console.log("fetchUpdates error:", error);
    }
  };

  // TOGGLE UPDATES VISIBILITY
  const handleToggleWorkspace = (project) => {
    if (selectedProject?._id === project._id) {
      setSelectedProject(null);
      return;
    }

    setSelectedProject(project);

    if (!updates[project._id]) {
      fetchUpdates(project._id);
    }
  };

  // POST UPDATE
  const handlePostUpdate = async (projectId) => {
    const message = updateInputs[projectId]?.trim();
    if (!message) return;
    try {
      const res = await axios.post(
        `https://flowforge-backend-ud7x.onrender.com/api/updates/${projectId}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdates((prev) => ({
        ...prev,
        [projectId]: [res.data, ...(prev[projectId] || [])],
      }));
      setUpdateInputs((prev) => ({ ...prev, [projectId]: "" }));
    } catch (error) {
      console.log("postUpdate error:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="fl-dashboard">

      {/* HEADER */}
      <div className="fl-header">
        <h1 className="fl-title">FlowForge</h1>

        <div className="fl-nav">
          <button
            className={view === "projects" ? "active" : ""}
            onClick={() => setView("projects")}
          >
            Projects
          </button>

          <button
            className={view === "applications" ? "active" : ""}
            onClick={() => setView("applications")}
          >
            My Applications
          </button>
        </div>

        <button className="fl-logout" onClick={logout}>
          Logout
        </button>
      </div>

      {/* PROJECTS TAB */}
      {view === "projects" && (
        <div className="fl-section">
          <h2>All Projects</h2>

          {projects.length === 0 ? (
            <p className="fl-empty">No projects available yet.</p>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="fl-card">
                <div className="fl-project-row">
                  <div className="fl-project-text">
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>

                  {applications.some(
                    (a) => a.projectId?._id === p._id
                  ) ? (
                    <button className="fl-apply-btn" disabled>
                      Applied ✓
                    </button>
                  ) : (
                    <button
                      className="fl-apply-btn"
                      onClick={() => applyProject(p._id)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {view === "applications" && (
        <>
          <div className="fl-section">

            <h2>My Applications</h2>

            {/* SUMMARY */}
            <div className="fl-summary">

              <div className="fl-summary-card accepted">
                <span>✅ Accepted</span>
                <h3>{acceptedCount}</h3>
              </div>

              <div className="fl-summary-card pending">
                <span>⏳ Pending</span>
                <h3>{pendingCount}</h3>
              </div>

              <div className="fl-summary-card rejected">
                <span>❌ Rejected</span>
                <h3>{rejectedCount}</h3>
              </div>

            </div>

            {applications.length === 0 ? (
              <p className="fl-empty">No applications yet.</p>
            ) : (
              applications.map((a) => (
                <div key={a._id} className="fl-card">

                  <div className="fl-app-row">

                    <div className="fl-project-info">

                      <span className={`fl-status-dot ${a.status === "accepted" ? "active" : "inactive"}`}></span>
                      <h3>{a.projectId?.title}</h3>

                    </div>

                    {a.status === "accepted" && (
                      <button
                        className="fl-updates-btn"
                        onClick={() =>
                          handleToggleWorkspace(a.projectId)
                        }
                      >
                        {selectedProject?._id === a.projectId?._id
                          ? "Hide Updates ▲"
                          : "Open Updates ▼"}
                      </button>
                    )}

                  </div>

                </div>
              ))
            )}

          </div>

          {/* SINGLE WORKSPACE PANEL */}
          {selectedProject && (
            <div className="fl-section">

              <div className="fl-workspace-panel">

                <h3>
                  Workspace: {selectedProject.title}
                </h3>

                <div className="fl-updates-section">

                  <div className="fl-input-row">

                    <input
                      type="text"
                      placeholder="Write an update..."
                      value={
                        updateInputs[selectedProject._id] || ""
                      }
                      onChange={(e) =>
                        setUpdateInputs((prev) => ({
                          ...prev,
                          [selectedProject._id]:
                            e.target.value,
                        }))
                      }
                    />

                    <button
                      className="fl-post-btn"
                      onClick={() =>
                        handlePostUpdate(
                          selectedProject._id
                        )
                      }
                    >
                      Post
                    </button>

                  </div>

                  {(updates[selectedProject._id] || [])
                    .length === 0 ? (
                    <p className="fl-empty">
                      No updates yet.
                    </p>
                  ) : (
                    (updates[selectedProject._id] || []).map(
                      (u) => (
                        <div
                          key={u._id}
                          className="fl-update-card"
                        >

                          <p className="fl-update-author">
                            {u.userId?.name}

                            <span className="fl-update-role">
                              ({u.userId?.role})
                            </span>
                          </p>

                          <p className="fl-update-message">
                            {u.message}
                          </p>

                          <p className="fl-update-time">
                            {new Date(
                              u.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>
                      )
                    )
                  )}

                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}

export default FreelancerDashboard;