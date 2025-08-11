import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";

const apiURL = import.meta.env.VITE_API_URL;

const EditNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado inicial en null para saber si todavía no hay datos
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`${apiURL}/api/notes/${id}`);
        setInitialData({
          title: res.data.title || "",
          description: res.data.description || "",
        });
      } catch (error) {
        console.error("Error al obtener la nota:", error);
        toast.error("Error al cargar la nota", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async (note) => {
    try {
      const res = await axios.put(`${apiURL}/api/notes/${id}`, note);
      if (res.status === 200) {
        toast.success("¡Nota actualizada con éxito!", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
        navigate("/");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      toast.error("Error al actualizar la nota", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando nota...</p>;
  }

  if (!initialData) {
    return (
      <p className="text-center mt-10 text-red-500">
        No se encontró la nota para editar.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-center mb-8">Editar Nota</h1>
      <NoteForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditNotePage;