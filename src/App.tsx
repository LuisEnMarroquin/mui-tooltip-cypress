import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

function App() {
  return (
    <Container sx={{ padding: "25px", textAlign: "center" }} role="main">
      <h1>Hello from React</h1>
      <Paper sx={{ padding: "25px" }}>
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </Container>
  );
}

export default App;
