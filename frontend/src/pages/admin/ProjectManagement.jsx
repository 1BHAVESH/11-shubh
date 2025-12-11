import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, ExternalLink, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/admin/ProjectForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  useGetProjectsQuery,
  useDeleteProjectMutation
} from "@/redux/features/adminApi";

import DataTable from "@/components/common/DataTable";
import useDataTable from "@/hooks/useDataTable";

const BASE_URL = "http://localhost:3001";

export default function ProjectManagement() {
  const { data: projectsData, isLoading, error } = useGetProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const projects = projectsData?.data || [];

  // ⭐ Apply reusable search + filter + pagination system
  const {
    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    currentPage,
    setCurrentPage,

    itemsPerPage,
    setItemsPerPage,

    totalPages,
    filteredData: filteredProjects,
    paginatedData: paginatedProjects,
  } = useDataTable(projects, {
    searchKeys: ["title", "location", "price"],
    filterFunction: (item, status) => {
      if (status === "all") return true;
      return item.status === status;
    },
  });

  // ---------------- ACTION HANDLERS ----------------

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(projectToDelete._id).unwrap();
      toast.success("Project deleted successfully!");
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete project");
    }
  };

  // ---------------- RENDER ----------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load projects. Try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Project Management</h1>

        <Button
          onClick={handleAdd}
          className="bg-[#d4af37] hover:bg-[#b8962f] text-black"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* ⭐ REUSABLE DATA TABLE */}
      <DataTable
        title="Projects"
        subtitle="Manage your real estate projects"

        data={projects}
        paginatedData={paginatedProjects}
        filteredData={filteredProjects}

        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}

        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}

        currentPage={currentPage}
        setCurrentPage={setCurrentPage}

        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}

        totalPages={totalPages}

        filterOptions={[
          { value: "all", label: "All" },
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
          { value: "upcoming", label: "Upcoming" },
        ]}

        columns={[
          {
            key: "image",
            label: "Image",
            render: (project) =>
              project.imageUrl ? (
                <img
                  src={`${BASE_URL}${project.imageUrl}`}
                  className="w-16 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-12 bg-zinc-800 rounded flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-zinc-500" />
                </div>
              ),
          },

          {
            key: "title",
            label: "Title",
            render: (project) => (
              <div>
                <p className="text-white font-medium">{project.title}</p>
                <p className="text-zinc-500 text-sm">{project.price}</p>
              </div>
            ),
          },

          {
            key: "location",
            label: "Location",
          },

          {
            key: "status",
            label: "Status",
            render: (project) => {
              const statusColors = {
                ongoing: "text-blue-400 bg-blue-500/20",
                completed: "text-green-400 bg-green-500/20",
                upcoming: "text-yellow-400 bg-yellow-500/20",
              };

              return (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[project.status] || "text-blue-400 bg-blue-500/20"
                  }`}
                >
                  {project.status}
                </span>
              );
            },
          },

          {
            key: "pdf",
            label: "PDF",
            render: (project) =>
              project.pdfUrl ? (
                <Link
                  to={project.pdfUrl}
                  target="_blank"
                  className="text-[#d4af37] inline-flex items-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-zinc-500">-</span>
              ),
          },

          {
            key: "actions",
            label: "Actions",
            render: (project) => (
              <div className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleEdit(project)}
                  className="text-zinc-400 hover:text-white"
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleDeleteClick(project)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* PROJECT FORM MODAL */}
      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={selectedProject}
      />

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
