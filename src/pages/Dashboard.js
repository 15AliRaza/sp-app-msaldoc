import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { getListItems } from "../api/sharepoint";
import { useAppContext } from "../contexts/AppContext";
import {DataTable} from "primereact/datatable";
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Choose a theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Tag } from 'primereact/tag';

const items = [
  { requestID: 1, ID:1, title: 'Item A', price: 100, status:'Approved' },
  { requestID: 5, ID:1, title: 'Item B', price: 150, status:'Pending' },
  { requestID: 1, ID:2, title: 'Item c', price: 250, status:'Approved' },
  { requestID: 2, ID:1, title: 'Item d', price: 140, status:'Pending' },
  { requestID: 4, ID:1, title: 'Item B', price: 450, status:'Approved' },
  { requestID: 5, ID:2, title: 'Item Bd', price: 120, status:'Pending' },
  { requestID: 1, ID:3, title: 'Item cd', price: 110, status:'Pending' },
  { requestID: 2, ID:2, title: 'Item ad', price: 200, status:'Approved' }
];

const statusBodyTemplate = (rowData) => {
  let severity;
  switch (rowData.status) {
    case 'Approved':
      severity = 'success';
      break;
    case 'Pending':
      severity = 'warning';
      break;
    case 'Rejected':
      severity = 'danger';
      break;
    default:
      severity = null;
  }

  return <Tag value={rowData.status} severity={severity} />;
};

const Dashboard = () => {
  const { isAuthenticated, user, token, logout } = useAuth();
  const { appData, updateAppData } = useAppContext();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);

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

  const rowExpansionTemplate= (rowData) =>{
    const requestItems = items.filter((item) => item.requestID === rowData.Id );

    return (
      <DataTable value={requestItems} responsiveLayout="scroll">
        <Column field="ID" header="ID" />
        <Column field="title" header="Title" />
        <Column field="price" header="Price" />
        <Column field="status" body={statusBodyTemplate} header="Status" />
      </DataTable>
    );
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
          <DataTable value={lists} 
            stripedRows rowsPerPageOptions={[5, 10, 25, 50]}
            paginator rows={5} responsiveLayout="scroll"
            expandedRows = {expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="Id"
            >
              <Column expander style={{ width: '3em' }} />
              <Column field="Id" header="ID" />
              <Column field="FirstName" header="First Name" />
              <Column field="LastName" header="Last Name" />
              <Column field="Email" header="Email" />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
