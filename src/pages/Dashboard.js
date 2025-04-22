import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { getListItems } from "../api/sharepoint";
import { useAppContext } from "../contexts/AppContext";

const Dashboard = () => {
  const { isAuthenticated, user, token, logout } = useAuth();
  const { appData, updateAppData } = useAppContext();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  /*useEffect(() => {
    if (isAuthenticated && token) {
      console.log(token);
      fetchSharePointData();
    }
  }, [isAuthenticated, token]);*/
  useEffect(() => {
    if (token) {
      console.log(token);
      fetchSharePointData();
    }
  }, [token]);

  const fetchSharePointData = async () => {
    try {
      console.log(token);
      setLoading(true);
      const sharepointData = await getListItems(token, "Employees");
      updateAppData({ sharepointData });
      setLists(sharepointData);
      console.log(sharepointData);
      /*const sharepoint = await getSharePointApi(token);
      const site = await sharepoint.getSite();
      const lists = await sharepoint.getLists();

      updateAppData({ site });
      setLists(lists);*/
    } catch (error) {
      console.error("Error fetching SharePoint data:", error);
    } finally {
      console.log("AppData: t ", appData);
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Please login to view this page</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <button onClick={logout} className="btn btn-outline-danger">
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">User Information</div>
        <div className="card-body">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.username}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">SharePoint Lists</div>
          <div className="card-body">
            {/* {lists.length > 0 ? (
              <ul className="list-group">
                {lists.map((list) => (
                  <li key={list.id} className="list-group-item">
                    {list.name} ({list.description || "No description"})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No lists found</p>
            )} */}
            <table className="table table-bordered">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
              {/* {appData?.sharepointData?.map((data) => (
                <li>{data.ID}</li>
              ))} */}
              {lists.map((list) => (
                <tr>
                  <td>{list.ID}</td>
                  <td>{list.FirstName}</td>
                  <td>{list.LastName}</td>
                  <td>{list.Email}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
