"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
// import { transform } from "next/dist/build/swc";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const normalizeItemName = (name) => name.toLowerCase();

  const handleError = (error) => {
    console.error("Error:", error);
    setError("An error occurred. Please try again.");
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
  };

  // add inventory function
  const addItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    try {
      setLoading(true);
      const docRef = doc(collection(firestore, "inventory"), normalizedItem);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
        handleSuccess("Item quantity updated successfully!");
      } else {
        await setDoc(docRef, { quantity: 1 });
        handleSuccess("Item added successfully!");
      }
      await updateInventory();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  // update inventory function
  const updateInventory = async () => {
    setLoading(true);
    try {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  // remove inventory function
  const removeItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    try {
      setLoading(true);
      const docRef = doc(collection(firestore, "inventory"), normalizedItem);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
          handleSuccess("Item removed successfully!");
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
          handleSuccess("Item quantity decreased successfully!");
        }
      }
      await updateInventory();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (itemName.trim()) {
        addItem(itemName);
        setItemName("");
        handleClose();
      }
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{ p: { xs: 2, sm: 4 } }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <Typography variant="">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Box border="1px solid #333">
          <Box
            width="800px"
            height="100px"
             bgcolor="#FFC107"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">
              Inventory Items
            </Typography>
          </Box>

          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#FFFFFF"
                padding={3}
                borderRadius="8px"
                boxShadow='rgba(0, 0, 0, 0.2)'
              >
                <Typography variant="h5" color="#333" sx={{ flex: 1 }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  Quantity: {quantity}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ backgroundColor: "#388E3C" }}
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ backgroundColor: "#D32F2F" }}
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
