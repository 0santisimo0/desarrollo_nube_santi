import { useState } from "react";
import { Bell } from "react-bootstrap-icons";
import { useFirebaseUser } from "../hooks/useFirebaseUser";
import { useNotifications } from "../hooks/useNotifications";

const MenuLogged = () => {
  const { user } = useFirebaseUser();
  const { notifications, markAsSeen } = useNotifications();
  const [open, setOpen] = useState(false);
  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <nav className="bg-gray-900 text-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-semibold">Red Social</div>

          <div className="flex items-center gap-4">
            {/* Icono de notificaciones */}
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="relative">
                <Bell size={22} />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
                    {unseenCount}
                  </span>
                )}
              </button>

              {/* Dropdown de notificaciones */}
              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-md max-h-96 overflow-y-auto">
                  <div className="p-3 border-b font-semibold">
                    Notificaciones
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      No hay notificaciones
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsSeen(n.id)} // Marcar como vista
                        className="p-3 border-b hover:bg-gray-100 text-sm flex gap-3"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={n.senderPhotoURL || "/avatar-default.png"}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div>
                            📢 <strong>{n.senderDisplayName}</strong> publicó
                            algo nuevo.
                          </div>
                          {!n.seen && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();  // Evitar que se cierre el dropdown al hacer clic
                                markAsSeen(n.id);  // Llamar a la función para marcar como vista
                              }}
                              className="text-blue-500 text-xs mt-1 hover:underline"
                            >
                              Marcar como vista
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Foto y nombre */}
            {user && (
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || ""}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm">{user.displayName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuLogged;
