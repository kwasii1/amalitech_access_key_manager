import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import ResetPassword from './pages/auth/ResetPassword'
import PasswordResetForm from './pages/auth/PasswordResetForm'
import Keys from './pages/user/Keys'
import PurchaseKey from './pages/user/PurchaseKey'
import Profile from './pages/user/Profile'
import AdminProfile from './pages/admin/AdminProfile'

function App() {
	
  return (
    <>
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />}/>
				<Route path='/register' element={<Register />}/>
				<Route path='/reset-password' element={<ResetPassword />}/>
				<Route path='/verify-email' element={<VerifyEmail />}/>
				<Route path='/reset-password-form/:id/:token' element={<PasswordResetForm />}/>
				<Route path='/' element={<Keys />}/>
				<Route path='/purchase' element={<PurchaseKey />}/>
				<Route path='/profile' element={<Profile />}/>
				<Route path='/admin-profile' element={<AdminProfile />}/>
			</Routes>
		</BrowserRouter>
    </>
  )
}

export default App
