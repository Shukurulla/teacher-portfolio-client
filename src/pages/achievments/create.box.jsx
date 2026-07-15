import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
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

  const closeModal = () => setState({ value: state, state: false });

  return (
    <Dialog
      open={Boolean(state)}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      scroll="paper"
    >
      <Box component="form" onSubmit={submitHandler}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{state.title}</DialogTitle>

        <DialogContent dividers>
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<UploadFileRoundedIcon />}
            disabled={files.length >= maxFiles}
            sx={{ justifyContent: "flex-start", py: 1.25 }}
          >
            {files.length >= maxFiles
              ? "Fayllar limitiga yetdingiz"
              : "Hujjat tanlash"}
            <input
              hidden
              type="file"
              onChange={changeFiles}
              disabled={files.length >= maxFiles}
            />
          </Button>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            {files.length < maxFiles
              ? `Siz ${
                  maxFiles - files.length
                } tadan ortiq file qo'sha olmaysiz`
              : "Siz boshqa file qo'sha olmaysiz"}
          </Typography>

          {/* File previews */}
          {filePreviews.length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected files:
              </Typography>
              <Stack spacing={1}>
                {filePreviews.map((preview, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ minWidth: 0 }}
                    >
                      {preview.type.startsWith("image/") ? (
                        <Box
                          component="img"
                          src={preview.url}
                          alt="Preview"
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 1.5,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: alpha("#2563eb", 0.12),
                            color: "primary.main",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                          }}
                        >
                          <DescriptionRoundedIcon fontSize="small" />
                        </Box>
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
                          {preview.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(preview.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFile(index)}
                      aria-label="remove file"
                    >
                      <Box
                        component="span"
                        sx={{ fontSize: 20, lineHeight: 1, fontWeight: 700 }}
                      >
                        ×
                      </Box>
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={<CheckRoundedIcon />}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateBox;
