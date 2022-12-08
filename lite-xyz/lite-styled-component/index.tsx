import { createRoot } from "react-dom/client"
import liteStyled from "./lite-styled"

const StyledButton = liteStyled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
`

const StyledButton2 = liteStyled.button`
  padding: 32px;
  background-color: #1489cd;
  font-size: 24px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
`

const App = () => {
  return (
    <div>
      <StyledButton>Button1</StyledButton>
      <StyledButton>Button2</StyledButton>
      <StyledButton2>Button with different style</StyledButton2>
    </div>
  )
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)
