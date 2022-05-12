import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const tooptipProps = {
  tooltip: {
    sx: {
      color: "#fff",
      fontSize: "10px",
      fontWeight: "500",
      lineHeight: "14px",
      fontStyle: "normal",
      fontFamily: "Roboto",
      // Override MUI defaults
      backgroundColor: "#616161",
      [`& .${tooltipClasses.arrow}`]: {
        color: "#616161",
      },
    },
  },
};

function App() {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    setButtonClicked((current) => !current);
  };

  return (
    <Container sx={{ padding: "25px", textAlign: "center" }} role="main">
      <h1>Hello from React</h1>
      <Paper sx={{ padding: "25px" }}>
        <Tooltip
          title={buttonClicked ? "ChangeText" : "DeleteText"}
          componentsProps={buttonClicked ? tooptipProps : {}}
          PopperProps={{
            disablePortal: true,
          }}
        >
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Box>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat velit
          vero totam debitis facilis! Dicta dolorum iusto inventore
          reprehenderit accusamus, perspiciatis nihil expedita eum delectus
          corrupti rerum sit eos architecto.
        </Box>
      </Paper>
      <Box sx={{ padding: "25px" }}>
        <Button variant="contained" onClick={handleClick}>
          Add Class
        </Button>
      </Box>
    </Container>
  );
}

export default App;
