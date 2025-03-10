// import React from "react";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Home from './pages/Home';


// const App = () => {
//     return (
//         <div>
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/" element={<Home />} />
//                 </Routes>
//             </BrowserRouter>    
//         </div>
//     )
// }

// export default App;

import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentuParvaldiba from "./pages/StudentuParvaldiba";
import GrupuParvaldiba from "./pages/GrupuParvaldiba";
import ApmacibuSessijuParvaldiba from "./pages/ApmacibuSessijuParvaldiba";
import ApmeklejumaUzskaite from "./pages/ApmeklejumaUzskaite";
import ApliecibuParvaldiba from "./pages/ApliecibuParvaldiba";
import ApliecibuRegistrs from "./pages/ApliecibuRegistrs";
function App() {
    return (
        <Router>
            <Sidebar />
            <Routes>
                <Route
                    path="/studentu-parvaldiba"
                    element={<StudentuParvaldiba />}
                />
                <Route
                    path="/grupu-parvaldiba"
                    element={<GrupuParvaldiba />}
                />
                <Route
                    path="/apmacibu-sessiju-parvaldiba"
                    element={<ApmacibuSessijuParvaldiba />}
                />
                <Route
                    path="/apmeklejuma-uzskaite"
                    element={<ApmeklejumaUzskaite />}
                />
                <Route
                    path="/apliecibu-parvaldiba"
                    element={<ApliecibuParvaldiba />}
                />
                <Route
                    path="/apliecibu-registrs"
                    element={<ApliecibuRegistrs />}
                />
            </Routes>
        </Router>
    );
}

export default App;
