import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./ListUsers.css";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        toast.error("Không thể tải danh sách người dùng.", {
          className: "custom-toast-error",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user.user_id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (field === "extra_info") {
      try {
        value = JSON.parse(value); // Parse JSON for extra_info
      } catch (error) {
        console.error("Invalid JSON format for extra_info:", error);
        toast.error("Thông tin thêm phải ở định dạng JSON hợp lệ.", {
          className: "custom-toast-error",
        });
        return;
      }
    }

    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${editingUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(editedUser),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          className: "custom-toast-success",
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === editingUserId ? { ...editedUser } : user
          )
        );
        setEditingUserId(null);
      } else {
        toast.error(`Lỗi: ${data.message}`, {
          className: "custom-toast-error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật user.", {
        className: "custom-toast-error",
      });
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
          className: "custom-toast-success",
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
      } else {
        toast.error(`Lỗi: ${data.message}`, {
          className: "custom-toast-error",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      toast.error("Đã xảy ra lỗi khi xóa user.", {
        className: "custom-toast-error",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2>Danh sách người dùng</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>User_Id</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thông tin thêm</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.user_id}
              style={{
                backgroundColor: editingUserId === user.user_id ? "#d3f9d8" : "white",
              }}
            >
              <td>
                {editingUserId === user.user_id ? (
                  <input
                    type="text"
                    value={editedUser.user_id}
                    onChange={(e) => handleInputChange(e, "user_id")}
                  />
                ) : (
                  user.user_id
                )}
              </td>
              <td>
                {editingUserId === user.user_id ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.user_id ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.user_id ? (
                  <input
                    type="text"
                    value={editedUser.role}
                    onChange={(e) => handleInputChange(e, "role")}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                {editingUserId === user.user_id ? (
                  <input
                    type="text"
                    value={editedUser.status}
                    onChange={(e) => handleInputChange(e, "status")}
                  />
                ) : (
                  user.status
                )}
              </td>
              <td>
                  {editingUserId === user.user_id ? (
                    <textarea
                      value={JSON.stringify(editedUser.extra_info || {}, null, 2)} // Hiển thị JSON đẹp
                      onChange={(e) => {
                        try {
                          const parsedValue = JSON.parse(e.target.value); // Kiểm tra JSON hợp lệ
                          handleInputChange({ target: { value: parsedValue } }, "extra_info");
                        } catch (error) {
                          console.error("Invalid JSON format:", error);
                          toast.error("Thông tin thêm phải ở định dạng JSON hợp lệ.", {
                            className: "custom-toast-error",
                          });
                        }
                      }}
                    />
                      ) : user.extra_info && Object.keys(user.extra_info).length > 0 ? (
                        Object.entries(user.extra_info).map(([key, value]) => (
                          <p key={key}>{`${key}: ${value}`}</p> // Hiển thị từng cặp key-value
                        ))
                      ) : (
                        "Không có dữ liệu" // Hiển thị khi extra_info trống
                      )}
             </td>
              <td>
                {editingUserId === user.user_id ? (
                  <>
                    <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
                      Lưu
                    </button>
                    <button onClick={() => setEditingUserId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{ marginRight: "10px" }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      style={{ backgroundColor: "red", color: "white" }}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;