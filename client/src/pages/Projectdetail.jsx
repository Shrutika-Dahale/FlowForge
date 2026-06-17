import { useEffect, useState } from "react";
import axios from "axios";

function ProjectDetail({ projectId, onBack }) {
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [projectId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      // Fetch project info
      const projectRes = await axios.get(
        `http://localhost:5000/api/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(projectRes.data.project);

      // Fetch my applications and find if applied to this one
      const appRes = await axios.get(
        "http://localhost:5000/api/application/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allApps = appRes.data.applications || [];
      const myApp = allApps.find((a) => a.projectId?._id === projectId);
      setApplication(myApp || null);
    } catch (err) {
      console.error("Error loading project detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyProject = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/application/apply/${projectId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied 🚀");
      fetchDetail(); // refresh status
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  const getStatusColor = (status) => {
    if (status === "accepted") return "green";
    if (status === "rejected") return "red";
    return "orange"; // pending
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!project) return <p style={{ padding: 20 }}>Project not found.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>

      {/* Back button */}
      <button onClick={onBack} style={{ marginBottom: 16 }}>
        ← Back to Dashboard
      </button>

      {/* Project Info */}
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h2>{project.title}</h2>
        <p>{project.description}</p>

        <p>
          <strong>Budget:</strong>{" "}
          {project.budget ? `$${project.budget}` : "Not specified"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {project.deadline
            ? new Date(project.deadline).toLocaleDateString()
            : "Not specified"}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Client:</strong>{" "}
          {project.clientId?.name || project.clientId || "Unknown"}
        </p>

        {project.skills && project.skills.length > 0 && (
          <p>
            <strong>Skills required:</strong> {project.skills.join(", ")}
          </p>
        )}
      </div>

      {/* Application Status or Apply */}
      <div
        style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}
      >
        <h3>Your Application</h3>

        {application ? (
          <div>
            <p>
              Status:{" "}
              <strong style={{ color: getStatusColor(application.status) }}>
                {application.status.toUpperCase()}
              </strong>
            </p>
            {application.coverLetter && (
              <p>
                <strong>Your cover letter:</strong> {application.coverLetter}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p>You have not applied to this project yet.</p>
            <button
              onClick={applyProject}
              style={{ padding: "8px 20px", cursor: "pointer" }}
            >
              Apply Now 🚀
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default ProjectDetail;