import { useState } from "react";
import Button from "../../components/Button";
import { Input } from "../../components/Input";
import { useFirebaseUser } from "../../hooks/useFirebaseUser";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { moderateText } from "../../utils/moderationUtils";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { sendNotification } from "../../hooks/useNotifications";
import { usePostRepo } from "../../hooks/usePostRepo";

export default function LoggedInUser() {
  const { user } = useFirebaseUser();
  const { posts, createPost, deletePost } = usePostRepo();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const handleLike = (postId: string, postOwner: string) => {
    console.log(`El post ${postId} fue dado like por el usuario ${user?.uid}`);
    sendNotification(postOwner, "liked", postId, user);
  
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  
  const handleDislike = (postId: string, postOwner: string) => {
    console.log(
      `El post ${postId} fue dado dislike por el usuario ${user?.uid}`
    );
    sendNotification(postOwner, "disliked", postId, user);
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!content.trim()) {
      console.warn("El contenido está vacío.");
      return;
    }

    try {
      console.log("Usuario:", user);
      let imageUrl = null;

      const moderatedContent = moderateText(content);

      if (imageFile) {
        console.log("Subiendo imagen...");
        imageUrl = await uploadToCloudinary(imageFile);
        console.log("URL de imagen:", imageUrl);

        if (!imageUrl) {
          alert("Error al subir la imagen.");
          return;
        }
      }

      await createPost(moderatedContent, imageUrl);

      setContent("");
      setImageFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("ERROR:", error);
      alert("Hubo un problema al crear el post.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6 p-4 border rounded shadow-sm bg-white">
        <div className="flex items-center gap-3 mb-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Tu avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300" />
          )}
          <Input
            placeholder="¿Qué estás pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded">
            Agregar foto
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </label>
          {imageFile && (
            <span className="text-sm text-gray-600">{imageFile.name}</span>
          )}
          {imageFile && (
            <button
              onClick={() => {
                setImageFile(null);
                setPreviewImage(null);
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Quitar imagen
            </button>
          )}
        </div>

        {previewImage && (
          <img
            src={previewImage}
            alt="Vista previa"
            className="w-full max-h-96 object-cover rounded mb-3"
          />
        )}

        <Button onClick={handleCreate}>Postear</Button>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border p-4 mb-4 rounded shadow-sm bg-white"
        >
          <div className="flex items-center gap-3 mb-2">
            {post.photoURL ? (
              <img
                src={post.photoURL}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            )}
            <div className="flex-1">
              <span className="font-bold block">{post.displayName}</span>
              <span className="text-xs text-gray-500">
                {post.createdAt?.toDate?.().toLocaleString?.() ?? "Sin hora"}
              </span>
            </div>
          </div>
          <p className="text-sm mb-2">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full max-h-96 object-cover rounded mb-2"
            />
          )}

          {/* <div className="flex gap-3 mt-2">
            <Button
              onClick={() => handleLike(post.id, post.uid)}
              className={`flex items-center gap-2 ${likedPosts[post.id] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              <FaThumbsUp />
              Like
            </Button>
            <Button
              onClick={() => handleDislike(post.id, post.uid)}
              className="flex items-center gap-2"
            >
              <FaThumbsDown />
              Dislike
            </Button>
          </div> */}

          {user?.uid === post.uid && (
            <Button
              onClick={() => deletePost(post.id)}
              className="mt-2 bg-red-500"
            >
              Eliminar
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
