import { useEffect, useState } from "react";
import axios from "axios";
import "./ClientDashboard.css"

function ClientDashboard({ setIsLoggedIn }) {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem("token");
  const [updates, setUpdates] = useState({});
  const [updateInputs, setUpdateInputs] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [updatesVisible, setUpdatesVisible] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // GET CLIENT PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "https://flowforge-backend-ud7x.onrender.com/api/project/projects",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProjects(res.data);
    } catch (error) {
      console.log("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  //CREATE PROJECT
  const createProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://flowforge-backend-ud7x.onrender.com/api/project/createProject",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Project Created 🎉");

      setForm({ title: "", description: "" });

      fetchProjects(); // refresh list
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `https://flowforge-backend-ud7x.onrender.com/api/project/deleteProject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Project Deleted ❌");

      fetchProjects(); // refresh list
    } catch (error) {
      console.log("Delete Error:", error.response?.data || error.message);
    }
  };

  const updateProject = async (id) => {
    try {
      await axios.put(
        `https://flowforge-backend-ud7x.onrender.com/api/project/updateProject/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Project Updated ✏️");

      setEditingId(null);
      setForm({ title: "", description: "" });

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleToggleUpdates = (projectId) => {
    setUpdatesVisible((prev) => {
      const nowVisible = !prev[projectId];
      if (nowVisible && !updates[projectId]) {
        fetchUpdates(projectId);
      }
      return { ...prev, [projectId]: nowVisible };
    });
  };

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

  // VIEW APPLICANTS
  const viewApplicants = async (projectId) => {
    if (selectedProject === projectId) {
      setSelectedProject(null);
      setApplications([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://flowforge-backend-ud7x.onrender.com/api/application/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data.applications);
      setSelectedProject(projectId);
    } catch (error) {
      console.log(error);
    }
  };

  // ACCEPT / REJECT
  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `https://flowforge-backend-ud7x.onrender.com/api/application/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Application ${status}`);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status }
            : app
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  //Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1 className="title">FlowForge</h1>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CREATE PROJECT */}
      <div className="section">
        <h2>{editingId ? "Edit Project" : "Create Project"}</h2>

        <form
          onSubmit={
            editingId
              ? (e) => {
                e.preventDefault();
                updateProject(editingId);
              }
              : createProject
          }
        >
          <input
            type="text"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Project Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button type="submit" className="primary-btn">
            {editingId ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>


      {/* PROJECT LIST */}
      <div className="section">
        <h2>My Projects</h2>

        {projects.length === 0 ? (
          <p className="empty">No projects yet. Start by creating one 🚀</p>
        ) : (
          projects.map((p) => (
            <div key={p._id}>

              {/* PROJECT ROW */}
              <div className="project-row">
                <div className="project-info">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="edit"
                    onClick={() => {
                      setEditingId(p._id);
                      setForm({ title: p.title, description: p.description });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteProject(p._id)}
                  >
                    Delete
                  </button>

                  <button
                    className="view-btn"
                    onClick={() => viewApplicants(p._id)}
                  >
                    {selectedProject === p._id ? "Hide Applicants" : "View Applicants"}
                  </button>
                </div>
              </div>

              {/* APPLICANTS PANEL */}
              {selectedProject === p._id && (
                <div className="applicants-inline">
                  <h3 className="inline-title">Applicants</h3>

                  {applications.length === 0 ? (
                    <p className="empty">No applicants yet.</p>
                  ) : (
                    applications.map((app) => (
                      <div key={app._id} className="applicant-row">
                        <div className="project-info">
                          <h3>{app.freelancerId?.name}</h3>
                          <p>{app.freelancerId?.email}</p>
                          <p>Status: {app.status}</p>
                        </div>

                        <div className="actions">
                          <button
                            className="edit"
                            onClick={() => updateStatus(app._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="delete"
                            onClick={() => updateStatus(app._id, "rejected")}
                          >
                            Reject
                          </button>
                          {app.status === "accepted" && (
                            <button
                              className="view-btn"
                              onClick={() => {
                                handleToggleUpdates(p._id);
                                setSelectedApplicant(app.freelancerId);
                              }}
                            >
                              {updatesVisible[p._id] ? "Hide Updates" : "Updates"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* UPDATES PANEL*/}
      {selectedProject && updatesVisible[selectedProject] && (
        <div className="updates-panel">
          <div className="updates-panel-header">
            <span className="updates-panel-project">
              📁 {projects.find((p) => p._id === selectedProject)?.title}
            </span>
            <span className="updates-panel-applicant">
              👤 {selectedApplicant?.name}
            </span>
          </div>

          <div className="updates-input-row">
            <input
              type="text"
              placeholder="Write an update..."
              value={updateInputs[selectedProject] || ""}
              onChange={(e) =>
                setUpdateInputs((prev) => ({
                  ...prev,
                  [selectedProject]: e.target.value,
                }))
              }
            />
            <button
              className="post-btn"
              onClick={() => handlePostUpdate(selectedProject)}
            >
              Post
            </button>
          </div>

          {(updates[selectedProject] || []).length === 0 ? (
            <p className="empty">No updates yet.</p>
          ) : (
            (updates[selectedProject] || []).map((u) => (
              <div key={u._id} className="update-card">
                <p className="update-author">
                  {u.userId?.name}
                  <span className="update-role"> ({u.userId?.role})</span>
                </p>
                <p className="update-message">{u.message}</p>
                <p className="update-time">
                  {new Date(u.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

export default ClientDashboard;