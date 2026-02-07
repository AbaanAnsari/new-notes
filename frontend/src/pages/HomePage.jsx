import React, { use } from "react"
import { BrowserRouter } from "react-router"
import Navbar from "../components/Navbar.jsx"
import RateLimitAlert from "../components/RateLimiterUI.jsx"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"
import NoteCard from "../components/NoteCard.jsx"
import NotesnotFound from "../components/NotesnotFound.jsx"

const HomePage = () => {

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
       const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get("/notes");
        setNotes(res.data)
        setIsRateLimited(false)
      } catch (error) {
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to Load notes")
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div>
      <Navbar  />

      {isRateLimited && <RateLimitAlert />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="flex justify-center gap-3 text-center text-primary py-10"><span className="loading loading-spinner"></span>Loading notes...</div>}

        {notes.length === 0 && !loading && !isRateLimited && <NotesnotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default HomePage