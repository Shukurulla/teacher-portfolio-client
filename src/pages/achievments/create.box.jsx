import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";
import AchievmentService from "../../service/achievment.service";

const CreateBox = ({ state, setState, id }) => {
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(state.ratings[0]?.about || "");
  const { isLoading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.user);
  const maxFiles = state.ratings.length;

  const changeFiles = (e) => {
    const selectedFile = e.target.files[0]; // Get only the first file

    if (!selectedFile) return;

    // Check if we've reached the maximum number of files
    if (files.length >= maxFiles) {
      alert(`You can only upload ${maxFiles} files for this achievement`);
      return;
    }

    // Add the new file to the existing files
    const newFiles = [...files, selectedFile];
    setFiles(newFiles);

    // Create preview for the new file
    const newPreview = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      url: URL.createObjectURL(selectedFile),
    };

    setFilePreviews([...filePreviews, newPreview]);

    // Reset the input value to allow selecting the same file again if needed
    e.target.value = null;
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...filePreviews];
    URL.revokeObjectURL(newPreviews[index].url); // Clean up memory
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    const formData = new FormData();

    // Append all files
    files.forEach((file, index) => {
      formData.append("files", file);
    });

    // Append other data
    formData.append("title", state.title);
    formData.append("teacherId", user._id);
    formData.append("achievmentId", state._id);
    formData.append("job", id);

    // Append ratings information
    const ratingsData = state.ratings.map((rating) => ({
      about: rating.about,
      rating: rating.rating,
    }));
    formData.append("ratings", JSON.stringify(ratingsData));

    try {
      await FilesService.postFiles(dispatch, formData);
      await AchievmentService.getAchievments(dispatch, id);
      setState({ state: false, value: {} });

      // Clean up object URLs
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Error submitting files:", error);
    }
  };
  // Cast to ObjectId failed for value "undefined" (type string) at path "_id" for model "job"
  return (
    <div className="w-100 h-[100vh] bg-[#504f4f6c] fixed top-0 flex items-center py-5 justify-center left-0 z-50">
      <div className="w-[80%] md:w-[50%] max-h-[90vh] overflow-y-auto">
        <BoxComponent>
          <h1 className="font-semibold text-lg mb-4">{state.title}</h1>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                <input
                  type="file"
                  onChange={changeFiles}
                  className="form-control mt-1"
                  disabled={files.length >= maxFiles}
                  required={files.length === 0}
                />
              </label>
              <p className="text-xs text-gray-500">
                {files.length < maxFiles
                  ? `Siz ${
                      maxFiles - files.length
                    } tadan ortiq file qo'sha olmaysiz`
                  : "Siz boshqa file qo'sha olmaysiz"}
              </p>
            </div>

            {/* File previews */}
            {filePreviews.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Selected files:</h3>
                <div className="space-y-2">
                  {filePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        {preview.type.startsWith("image/") ? (
                          <img
                            src={preview.url}
                            alt="Preview"
                            className="w-10 h-10 object-cover mr-2"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs">File</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm truncate w-40">
                            {preview.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(preview.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setState({ value: state, state: false })}
                disabled={isLoading}
                className="bg-secondary text-[15px] px-4 py-2 rounded-md text-white hover:bg-secondary-dark transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary px-4 py-2 text-[15px] rounded-md text-white hover:bg-primary-dark transition disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </BoxComponent>
      </div>
    </div>
  );
};

export default CreateBox;
