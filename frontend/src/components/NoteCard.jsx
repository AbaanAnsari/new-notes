import { Link, useNavigate } from "react-router";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils.js";
import toast from "react-hot-toast";

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();

  const handleDelete = (e, id) => {
    e.preventDefault();      // stop Link navigation
    e.stopPropagation();     // stop bubbling to card
    navigate(`/confirm/delete-note/${id}`);
  };

  return (
    <div
      className="card bg-base-100 drop-shadow-xl transition-transform duration-300
                 hover:scale-105 border-t-4 border-[#5e81ac]"
    >
      <div className="card-body">
        <h3 className="card-title">{note.title}</h3>

        <p className="text-base-content/70 line-clamp-3">
          {note.description}
        </p>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>

          <div className="flex items-center gap-1">
            <Link
              to={`/note/${note._id}`}
            >
              <button
                className="btn btn-ghost btn-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <PenSquareIcon className="size-4" />
              </button>
            </Link>

            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
