import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/js/LoginPage';
import Dashboard from './pages/js/Dashboard';
import Shared from './needed/Shared';
import Projects from './pages/js/Projects';
import Redirect from './pages/js/Redirect';
import PersonalTasks from './pages/js/PersonalTasks';
import CalendarPage from './pages/js/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<LoginPage />} />
          <Route element={<Shared />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='projects' element={<Projects />} />
            <Route path='personaltasks' element={<PersonalTasks />} />
            <Route path='calendar' element={<CalendarPage />} />
            <Route path='*' element={<Redirect />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
