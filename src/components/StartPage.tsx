import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { exportProgress, importProgress } from "../utils/progressBackup";
import "./StartPage.css";

export default function StartPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if the user has already visited
    const hasVisited = localStorage.getItem("qc_has_visited");
    if (hasVisited === "true") {
      // Skip start page and go directly to chapters
      navigate("/chapters", { replace: true });
    }
  }, [navigate]);

  const handleEnter = () => {
    // Mark as visited
    localStorage.setItem("qc_has_visited", "true");
    // Navigate to chapters page
    navigate("/chapters");
  };

  const handleExport = () => {
    exportProgress();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importProgress(file);
      } catch (error) {
        // Error already handled in importProgress
        console.error('Import error:', error);
      }
      // Reset file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="start-page">
      <div className="start-content">
        <div className="start-logo">
          <div className="logo-character">快</div>
        </div>
        
        <h1 className="start-title">QuickCard</h1>
        
        <button className="start-enter-button" onClick={handleEnter}>
          Enter
        </button>

        <div className="backup-controls">
          <button className="backup-button export-button" onClick={handleExport}>
            Export Progress
          </button>
          <button className="backup-button import-button" onClick={handleImportClick}>
            Import Progress
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
