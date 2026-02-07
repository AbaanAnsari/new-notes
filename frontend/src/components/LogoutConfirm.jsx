import { useNavigate, useParams } from "react-router";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

const LogoutConfirm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading,setLoading] = useState(false)

    const handleConfirmLogout = async () => {
        try {
            setLoading(true)
            await axiosInstance.post("/users/logout");
            toast.success("LogOut Successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error("Failed to logout");
            navigate(-1);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-xl bg-base-100 p-6 shadow-xl">
                <h3 className="text-lg font-semibold">Logout</h3>

                <p className="mt-2 text-sm text-base-content/70">
                    This action cannot be undone. Are you sure you want Logout?
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                        Cancel
                    </button>

                    <button className="btn btn-error" onClick={handleConfirmLogout}>
                        {loading ? (<span className="loading loading-spinner"></span>) : ("Logout")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirm;
