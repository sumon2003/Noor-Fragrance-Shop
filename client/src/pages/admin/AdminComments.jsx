import { useEffect, useState } from "react";
import { commentService } from "../../services/comment.service";
import { Check, X, Trash2, MessageSquare, Star } from "lucide-react";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminComments();
  }, []);

  const fetchAdminComments = async () => {
    try {
      const res = await commentService.getAllCommentsForAdmin();
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await commentService.updateCommentStatus(id, status);
      fetchAdminComments(); 
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) return <div className="p-10 text-amber-300">Loading comments...</div>;

  return (
    <div className="p-6 space-y-8 bg-[#0a0a0a] min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-50 flex items-center gap-3">
          <MessageSquare className="text-amber-300" /> Product Reviews
        </h2>
        <span className="bg-amber-300/10 text-amber-300 px-4 py-1 rounded-full border border-amber-300/20 text-sm">
          Total: {comments.length}
        </span>
      </div>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <div 
            key={comment._id} 
            className="bg-white/5 border border-amber-300/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.07] transition"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-300">{comment.userName}</span>
                <span className="text-[10px] text-amber-50/40 uppercase">on {comment.product?.name || 'Unknown Product'}</span>
              </div>
              
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < comment.rating ? 'text-amber-400' : 'text-white/10'} 
                    fill={i < comment.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="text-amber-50/70 text-sm italic">"{comment.commentText}"</p>
              
              <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-amber-50/30">Status:</span>
                <span className={
                  comment.status === 'Approved' ? 'text-emerald-400' : 
                  comment.status === 'Pending' ? 'text-amber-400' : 'text-red-400'
                }>
                  {comment.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {comment.status !== 'Approved' && (
                <button 
                  onClick={() => handleStatusUpdate(comment._id, 'Approved')}
                  className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition"
                  title="Approve"
                >
                  <Check size={18} />
                </button>
              )}
              
              {comment.status !== 'Rejected' && (
                <button 
                  onClick={() => handleStatusUpdate(comment._id, 'Rejected')}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
                  title="Reject"
                >
                  <X size={18} />
                </button>
              )}

              <button 
                className="p-3 bg-white/5 text-amber-50/40 rounded-xl hover:bg-red-600 hover:text-white transition"
                title="Delete Permanently"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-amber-300/10">
            <p className="text-amber-50/20 uppercase tracking-tighter">No comments found to manage</p>
          </div>
        )}
      </div>
    </div>
  );
}