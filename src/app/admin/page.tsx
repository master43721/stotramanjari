"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import initialVignanamData from "@/data/vignanam-data.json";
import { Stotram } from "@/types";

// Extends Stotram to support pdfLink and matches the readings route data
interface AdminStotram extends Stotram {
  slug: string;
  pdfLink: string | null;
  contentLines: string[];
}

export default function AdminPage() {
  const [stotrams, setStotrams] = useState<AdminStotram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStotram, setSelectedStotram] = useState<AdminStotram | null>(null);
  
  // Form States
  const [editId, setEditId] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editTitleEnglish, setEditTitleEnglish] = useState("");
  const [editTitleTelugu, setEditTitleTelugu] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPdfLink, setEditPdfLink] = useState("");
  const [editContentText, setEditContentText] = useState("");
  
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial data
  useEffect(() => {
    // Standardize vignanam data layout
    const formattedData = (initialVignanamData as any[]).map((item) => ({
      id: item.id || item.slug || "",
      slug: item.slug || item.id || "",
      title_english: item.title || item.title_english || "",
      title_telugu: item.title_telugu || "",
      category: item.category || "devotional",
      contentLines: item.contentLines || item.content_lines || [],
      content_lines: item.contentLines || item.content_lines || [],
      pdfLink: item.pdfLink || null
    }));
    setStotrams(formattedData);
    if (formattedData.length > 0) {
      selectStotram(formattedData[0]);
    }
  }, []);

  const selectStotram = (item: AdminStotram) => {
    setSelectedStotram(item);
    setEditId(item.id);
    setEditSlug(item.slug);
    setEditTitleEnglish(item.title_english);
    setEditTitleTelugu(item.title_telugu);
    setEditCategory(item.category);
    setEditPdfLink(item.pdfLink || "");
    setEditContentText(item.contentLines.join("\n"));
    setStatusMessage(null);
  };

  const handleCreateNew = () => {
    const newItem: AdminStotram = {
      id: "new-stotram-" + Date.now().toString().slice(-4),
      slug: "new-stotram",
      title_english: "New Stotram",
      title_telugu: "కొత్త స్తోత్రం",
      category: "devotional",
      contentLines: ["మొదటి లైన్", "రెండవ లైన్"],
      content_lines: ["మొదటి లైన్", "రెండవ లైన్"],
      pdfLink: null
    };
    
    setStotrams((prev) => [newItem, ...prev]);
    selectStotram(newItem);
  };

  const handleDelete = (idToDelete: string) => {
    if (confirm("Are you sure you want to delete this stotram?")) {
      const updated = stotrams.filter((s) => s.id !== idToDelete);
      setStotrams(updated);
      if (updated.length > 0) {
        selectStotram(updated[0]);
      } else {
        setSelectedStotram(null);
      }
      setStatusMessage({ text: "Item deleted. Click Save Database to commit changes.", isError: false });
    }
  };

  // Sync edits to state array in memory
  const handleApplyChanges = () => {
    if (!editId.trim() || !editTitleEnglish.trim() || !editTitleTelugu.trim()) {
      setStatusMessage({ text: "ID, English Title, and Telugu Title cannot be empty.", isError: true });
      return;
    }

    const lines = editContentText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const updatedItem: AdminStotram = {
      id: editId.trim(),
      slug: editSlug.trim() || editId.trim().toLowerCase().replace(/\s+/g, "-"),
      title_english: editTitleEnglish.trim(),
      title_telugu: editTitleTelugu.trim(),
      category: editCategory.trim().toLowerCase(),
      contentLines: lines,
      content_lines: lines,
      pdfLink: editPdfLink.trim() || null
    };

    const updatedList = stotrams.map((s) => (s.id === selectedStotram?.id ? updatedItem : s));
    setStotrams(updatedList);
    setSelectedStotram(updatedItem);
    setStatusMessage({ text: "Applied edits in memory. Don't forget to save database!", isError: false });
  };

  // Save to Disk via Standalone admin server (port 3001) in Dev mode
  const handleSaveDatabase = async () => {
    try {
      setStatusMessage({ text: "Saving changes to file system...", isError: false });
      
      const res = await fetch("http://localhost:3001/api/stotrams/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stotrams),
      });

      const data = await res.json();
      
      if (data.success) {
        setStatusMessage({ text: `Success: Database saved successfully (${stotrams.length} items).`, isError: false });
      } else {
        throw new Error(data.error || "Failed to save.");
      }
    } catch (err: any) {
      console.warn("[Admin] Save failed. Check if local server is running.", err);
      setStatusMessage({ 
        text: "Notice: Unable to write directly to disk. If running locally, make sure to start the admin server with:\n'npx tsx scripts/admin-server.ts'\n\nYou can also download the JSON file using 'Export JSON' and replace vignanam-data.json manually.", 
        isError: true 
      });
    }
  };

  // Export JSON Database file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stotrams, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "vignanam-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ text: "JSON exported successfully as 'vignanam-data.json'.", isError: false });
  };

  // Import JSON Database file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error("Uploaded file must be a JSON array of stotrams.");
        }

        const formatted = json.map((item: any) => ({
          id: item.id || item.slug || Date.now().toString(),
          slug: item.slug || item.id || "slug",
          title_english: item.title || item.title_english || "Imported Stotram",
          title_telugu: item.title_telugu || "",
          category: item.category || "devotional",
          contentLines: item.contentLines || item.content_lines || [],
          content_lines: item.contentLines || item.content_lines || [],
          pdfLink: item.pdfLink || null
        }));

        setStotrams(formatted);
        if (formatted.length > 0) {
          selectStotram(formatted[0]);
        }
        setStatusMessage({ text: `Successfully imported ${formatted.length} stotrams. Click 'Save Database' to store them.`, isError: false });
      } catch (err: any) {
        setStatusMessage({ text: "Failed to parse JSON file: " + err.message, isError: true });
      }
    };
    reader.readAsText(file);
  };

  const filteredList = stotrams.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title_english.toLowerCase().includes(q) ||
      s.title_telugu.includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container" style={{ paddingBlock: "3rem", minHeight: "90vh" }}>
      {/* Admin Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "var(--accent)" }}>Stotram Curation Console</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Add, edit, or delete items in the database.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
            ➕ Create New
          </button>
          <button onClick={handleSaveDatabase} className="btn" style={{ borderColor: "var(--accent)", color: "var(--accent)", fontSize: "0.85rem" }}>
            💾 Save Database
          </button>
          <button onClick={handleExportJSON} className="btn" style={{ fontSize: "0.85rem" }}>
            📤 Export JSON
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn" style={{ fontSize: "0.85rem" }}>
            📥 Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div style={{
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-md)",
          backgroundColor: statusMessage.isError ? "rgba(220, 53, 69, 0.1)" : "rgba(212, 175, 55, 0.08)",
          border: `1px solid ${statusMessage.isError ? "rgba(220, 53, 69, 0.3)" : "var(--border)"}`,
          color: statusMessage.isError ? "#ff6b6b" : "var(--text-primary)",
          marginBottom: "2rem",
          fontSize: "0.9rem",
          whiteSpace: "pre-line",
          lineHeight: "1.5"
        }}>
          {statusMessage.text}
        </div>
      )}

      {/* Main Two Column workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Left list Panel */}
        <div style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          backdropFilter: "blur(12px)"
        }}>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-base)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              marginBottom: "1.25rem",
              outline: "none"
            }}
          />

          {/* List items */}
          <div style={{ maxHeight: "550px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {filteredList.map((item) => {
              const isSelected = selectedStotram?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => selectStotram(item)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isSelected ? "var(--accent-light)" : "transparent",
                    border: `1px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                    cursor: "pointer",
                    transition: "var(--transition-fast)"
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.95rem", color: isSelected ? "var(--accent)" : "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title_english}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-telugu)", marginTop: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title_telugu || "(No Telugu Title)"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ff6b6b",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredList.length === 0 && (
              <p style={{ textAlign: "center", padding: "2rem 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                No items found
              </p>
            )}
          </div>
        </div>

        {/* Right Editing Panel */}
        {selectedStotram ? (
          <div style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
              Editing: <span style={{ color: "var(--accent)" }}>{selectedStotram.title_english}</span>
            </h2>

            {/* Core Form Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Unique ID
                </label>
                <input
                  type="text"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Title (English)
                </label>
                <input
                  type="text"
                  value={editTitleEnglish}
                  onChange={(e) => setEditTitleEnglish(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Title (Telugu)
                </label>
                <input
                  type="text"
                  value={editTitleTelugu}
                  onChange={(e) => setEditTitleTelugu(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-telugu)",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Category
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                  Google Drive PDF Link (Optional)
                </label>
                <input
                  type="text"
                  value={editPdfLink}
                  placeholder="https://drive.google.com/..."
                  onChange={(e) => setEditPdfLink(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Telugu lyrics Lines (One stanza per line)
              </label>
              <textarea
                value={editContentText}
                rows={12}
                onChange={(e) => setEditContentText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--bg-base)",
                  color: "var(--text-primary)",
                  fontSize: "1.1rem",
                  fontFamily: "var(--font-telugu)",
                  lineHeight: "1.8",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Action Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleApplyChanges} className="btn btn-primary" style={{ minWidth: "150px" }}>
                Apply Changes
              </button>
            </div>

          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "8rem 2rem",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px var(--shadow)"
          }}>
            <p style={{ fontSize: "1.4rem", fontWeight: "600", color: "var(--text-primary)" }}>
              No Stotram Selected
            </p>
            <p style={{ fontSize: "0.95rem", marginTop: "0.5rem", opacity: 0.8 }}>
              Select a stotram from the left list or create a new one to begin editing.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
