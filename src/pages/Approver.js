import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import queryString from "query-string";
import { addApproverData, getListItemById } from "../api/sharepoint";
import { useFlashMessage } from "../contexts/FlashMessageContext";
import Header from "../components/Header";

const Approver = () => {
  const { isAuthenticated, userProfile, token } = useAuth();
  const { search } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const { message, clearMessage, showMessage } = useFlashMessage();
  const navigate = useNavigate();

  let { id, formId, user } = queryString.parse(search);

  useEffect(() => {
    if (token) {
      if (
        (user?.toLowerCase() === "approver" ||
          user?.toLowerCase() === "temp") &&
        id
      ) {
        console.log("in");
        if (
          formId == null ||
          formId === undefined ||
          formId === ""
          //   || user === null ||
          //   user === undefined ||
          //   user === ""
        ) {
          console.log("The user will redirect to initiate the request");
          navigate("/Initiator");
        }
        if (id > 0 && formId && user) {
          console.log("adsfss");
          fetchData();
        }
      } else {
        console.log("go back to initiator from approver");
        navigate("/Initiator");
      }
    }
  }, [id, formId, user, token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      //   const accessToken = await getAccessTokenSP();
      const data = await getListItemById(token, "EHS_initiator", id); // Replace with your list name

      if (
        user?.toLowerCase() === "temp" &&
        data.Reviewer2AddedData &&
        !data.ApproverAddedData
      ) {
        console.log("user is temp and the reviewer1 is not added data");
        navigate("/Initiator");
      }
      if (data.FormId === formId && data.Reviewer2AddedData === true) {
        setFormData({
          ID: data.ID,
          InitiatorName: data.InitiatorName,
          InitiatorEmail: data.InitiatorEmail,
          InitiatorAddedData: data.InitiatorAddedData,
          InitiatorAddedDate: data.Created ? data.Created.split("T")[0] : "",
          Reviewer1Name: data.Reviewer1Name,
          Reviewer1Email: data.Reviewer1Email,
          Reviewer1Comments: data.Reviewer1Comments,
          Reviewer1AddedData: data.Reviewer1AddedData,
          Reviewer1AddedDate: data.Reviewer1AddedDate
            ? data.Reviewer1AddedDate.split("T")[0]
            : "",
          Reviewer2Name: data.Reviewer2Name,
          Reviewer2Email: data.Reviewer2Email,
          Reviewer2Comments: data.Reviewer2Comments,
          Reviewer2AddedData: data.Reviewer2AddedData,
          Reviewer2AddedDate: data.Reviewer2AddedDate
            ? data.Reviewer1AddedDate.split("T")[0]
            : "",
          ApproverName: data.ApproverName,
          ApproverEmail: data.ApproverEmail,
          ApproverComments: data.ApproverComments,
          ApproverAddedData: data.ApproverAddedData,
          ApproverAddedDate: data.ApproverAddedDate
            ? data.ApproverAddedDate.split("T")[0]
            : "",
          Element: data.Element,
          Program: data.Program,
          TargetDate: data.TargetDate ? data.TargetDate.split("T")[0] : "",
          Comments: data.Comments,
          FileName: data.FileName,
          FormId: data.FormId,
        });
      } else {
        console.log("form id is not equal OR reviewer2 is not added the data");
        navigate("/Initiator");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle TextArea changes initiator
  const handleTextAreaChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const siteUrl = process.env.REACT_APP_SP_SITE_URL;

  let isReadOnly = false;
  if (formData.ApproverAddedData) {
    isReadOnly = true;
  }

  const userResultExp =
    user?.toLowerCase() === "approver" || user?.toLowerCase() === "temp";
  const condRendering =
    userResultExp &&
    formData.ID &&
    !formData.ApproverAddedData &&
    user.toLowerCase() === "approver";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //   const accessToken = await getAccessTokenSP();
      const updatedItemStatus = await addApproverData(
        token,
        "EHS_initiator",
        id,
        formData
      );
      // console.log("item after updated the data", updatedItemStatus);
      if (updatedItemStatus === 204) {
        showMessage(
          "success",
          "Your request was submitted successfully.",
          true
        );
        navigate(`/Approver?user=temp&id=${id}&formId=${formId}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      showMessage("error", "Something went wrong while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

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

            <form onSubmit={handleSubmit}>
              <h3>Approver Section</h3>
              <div className="row">
                <div className="form-group col-md-6">
                  <label>Approver Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ApproverName"
                    value={formData.ApproverName}
                    onChange={handleInputChange}
                    required
                    readOnly={user === "temp" || formData.ApproverAddedData}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Approver Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="ApproverEmail"
                    value={formData.ApproverEmail}
                    onChange={handleInputChange}
                    required
                    readOnly={user === "temp" || formData.ApproverAddedData}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label className="form-label">Approver Comments:</label>
                  <textarea
                    className="form-control"
                    name="ApproverComments"
                    value={formData.ApproverComments}
                    onChange={handleTextAreaChange}
                    readOnly={user === "temp" || formData.ApproverAddedData}
                  />
                </div>
              </div>

              <div className="d-flex" style={{ gap: 10 }}>
                {condRendering ? (
                  <a
                    href={`${siteUrl}/Lists/EHS_initiator/Attachments/${formData.ID}/${formData.FileName}?web=1`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button
                      type="button"
                      className="btn btn-primary submit-button mt-2"
                    >
                      Open Document
                    </button>
                  </a>
                ) : (
                  ""
                )}

                <button
                  disabled={user === "temp" || formData.ApproverAddedData}
                  type="submit"
                  className={`btn btn-success ${
                    isReadOnly ? "disabled" : ""
                  } mt-2`}
                >
                  {formData.ApproverAddedData ? "Submitted" : "Submit Review"}
                </button>
              </div>
            </form>
            <hr />
            <form
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
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-group">
                  <label className="form-label">Initiator Comments:</label>
                  <textarea
                    className="form-control"
                    name="Comments"
                    value={formData.Comments}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Approver;
