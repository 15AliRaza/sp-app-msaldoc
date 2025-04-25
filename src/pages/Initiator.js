import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import {
  addInitiatorData,
  getListItemById,
  getListItems,
} from "../api/sharepoint";
import { useAppContext } from "../contexts/AppContext";
import { useFlashMessage } from "../contexts/FlashMessageContext";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import Header from "../components/Header";
import "./Overlay.css";

const Initiator = () => {
  const { isAuthenticated, userProfile, token } = useAuth();
  const { search } = useLocation();
  //   const { appData, updateAppData } = useAppContext();
  const { message, clearMessage, showMessage } = useFlashMessage();
  const [formData, setFormData] = useState({
    InitiatorName: userProfile?.name,
    InitiatorEmail: userProfile?.username,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  let { id, formId, user } = queryString.parse(search);
  let isReadOnly = false;
  console.log(id, formId, user);

  if (user === "temp") {
    isReadOnly = true;
  }

  console.log(userProfile);

  useEffect(() => {
    console.log(userProfile, "before and after submission");
    if (token) {
      console.log(token);
      setFormData((prevData) => {
        return {
          ...prevData,
          InitiatorEmail: userProfile.username,
          InitiatorName: userProfile.name,
        };
      });
      //   fetchSharePointData();

      if (id) {
        console.log("in");
        if (
          user?.toLowerCase() === "initiator" ||
          user?.toLowerCase() === "temp"
        ) {
          if (id > 0 && formId && user) {
            console.log("adsfss");
            fetchData();
          }
          if (formId == null || formId === undefined || formId === "") {
            console.log("The user will redirect to initiate the request");
            navigate("/Initiator");
          }
        } else {
          console.log(
            "The user will redirect to initiate the request due to incorrect user"
          );
          navigate("/Initiator");
        }
      }
    }
    console.log("initiator:", userProfile);
  }, [token, id, formId, user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      //   const accessToken = await getAccessTokenSP();
      const data = await getListItemById(token, "EHS_initiator", id); // Replace with your list name
      console.log(data);
      if (data.FormId === formId) {
        setFormData({
          ID: data.ID,
          InitiatorName: data.InitiatorName,
          InitiatorEmail: data.InitiatorEmail,
          InitiatorAddedData: data.InitiatorAddedData,
          InitiatorAddedDate: data.Created,
          Element: data.Element,
          Program: data.Program,
          TargetDate: data.TargetDate ? data.TargetDate.split("T")[0] : "",
          Comments: data.Comments,
          FileName: data.FileName,
          FormId: data.FormId,
        });
      } else {
        console.log("form id is not equal");
        // navigate("/Initiator");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  /*const fetchSharePointData = async () => {
    try {
      console.log(token);
      setIsLoading(true);
      const sharepointData = await getListItems(token, "Employees");
      updateAppData({ sharepointData });
      formData(sharepointData);
      console.log(sharepointData);
    } catch (error) {
      console.error("Error fetching SharePoint data:", error);
    } finally {
      console.log("AppData: t ", appData);
      setIsLoading(false);
    }
  };*/

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle File changes initiator
  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : undefined;

    if (file) {
      const allowedExtensions = ["doc", "docx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes

      // Check file extension
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert("Only Microsoft Word files (.doc, .docx) are allowed!");
        event.target.value = ""; // Reset file input
        return;
      }
      if (file.size > maxSize) {
        alert("File size must be less than 10MB!");
        event.target.value = ""; // Reset file input
        return;
      }
    }
    setFormData((prevState) => ({
      ...prevState,
      Attachments: file,
    }));
  };

  // Handle TextArea changes initiator
  const handleTextAreaChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission Initiator
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      //   const accessToken = await getAccessTokenSP();
      const newItem = await addInitiatorData(token, "EHS_initiator", formData);
      showMessage("success", "Your request was initiated successfully.", true);
      navigate(
        `/Initiator?id=${newItem.ID}&formId=${newItem.FormId}&user=temp`
      );
    } catch (error) {
      showMessage("error", "Something went wrong while submitting.");
      console.error("Error adding item:", error);
    } finally {
      setIsLoading(false);
      setFormData((prevData) => ({
        ...prevData,
        Element: "",
        Program: "",
        TargetDate: "",
        Comments: "",
        FileName: "",
        Attachments: "",
      }));
    }
  };

  const userResultExp =
    user === "Initiator" ||
    user === "temp" ||
    user === "Reviewer1" ||
    user === "Reviewer2" ||
    user === "Approver";
  const condRendering = userResultExp && formData.ID;
  const siteUrl = process.env.REACT_APP_SP_SITE_URL;

  return (
    <>
      <Header userProfile={userProfile} />
      <div className="container mt-5 pt-5">
        {isLoading ? (
          <div className="overlay">
            <img src="/Loading.gif" alt="Loading..." className="loader" />
          </div>
        ) : (
          <>
            {message && (
              <div className={`alert alert-${message.type} alert-dismissible`}>
                <button type="button" className="close" onClick={clearMessage}>
                  &times;
                </button>
                <strong>
                  {message.type === "success"
                    ? "Success!"
                    : message.type === "error"
                    ? "Error!"
                    : "Info:"}
                </strong>{" "}
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`form-container ${isLoading ? "disable-form" : ""}`}
            >
              <div className="form-group">
                <label className="form-label">Initiator Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.InitiatorName}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initiator Email:</label>
                <input
                  className="form-control"
                  type="email"
                  value={formData.InitiatorEmail}
                  readOnly
                />
              </div>
              <hr />

              <div className="form-group mb-2">
                <label className="form-label">Program:</label>
                <input
                  className="form-control"
                  type="text"
                  name="Program"
                  value={formData.Program}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  required
                />
              </div>

              <div className="row mb-2">
                <div className="form-group col-md-6">
                  <label className="form-label">Element (Number/Float):</label>
                  <input
                    className="form-control"
                    type="text"
                    name="Element"
                    value={formData.Element}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    pattern="^\d+(\.\d+)?$" // Only accepts numbers or floats
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label">Target Date:</label>
                  <input
                    className="form-control"
                    type="date"
                    name="TargetDate"
                    value={formData.TargetDate}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label className="form-label">Comments:</label>
                  <textarea
                    className="form-control"
                    name="Comments"
                    value={formData.Comments}
                    onChange={handleTextAreaChange}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              {!isReadOnly && (
                <div className="mb-2">
                  <label className="form-label">Upload File:</label>
                  <input
                    type="file"
                    name="Attachments"
                    onChange={handleFileChange}
                    accept=".doc,.docx"
                    required
                    // disabled={isReadonly}
                  />
                </div>
              )}

              {!user && !formData.ID && (
                <button type="submit" className="btn btn-primary submit-button">
                  Submit
                </button>
              )}

              {condRendering ? (
                <a
                  href={`${siteUrl}/Lists/EHS_initiator/Attachments/${formData.ID}/${formData.FileName}?web=1`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    type="button"
                    className="btn btn-primary submit-button"
                  >
                    Open Document
                  </button>
                </a>
              ) : (
                ""
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Initiator;
