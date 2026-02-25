import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import { auth, signInWithEmailAndPassword } from './firebaseconfig/index.jsx';
// 1. SweetAlert2 Import karein
import Swal from 'sweetalert2';

function LoginModal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => navigate('/');

    // SweetAlert Toast Configuration (Optional: for success messages)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const PhoneSvg = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="h-5 w-5">
            <path fill="currentColor" fillRule="evenodd" d="M18.39 19.98A15.07 15.07 0 0 1 4.02 5.6l3.52-1.4 2.15 4.3-1.67.83v.62a6.03 6.03 0 0 0 6.02 6.02h.62l.28-.56.56-1.1 4.3 2.14-1.41 3.52zm3.13-4.9l-6.02-3.01-1.35.45-.7 1.4a4.02 4.02 0 0 1-3.38-3.37l1.41-.7.45-1.35-3.01-6.02L7.65 2 2.63 4 2 4.95C2 14.34 9.65 22 19.06 22l.93-.63L22 16.35l-.48-1.27z" clipRule="evenodd"></path>
        </svg>
    );

const handleSubmitEmail = () => {
    // Basic Validation
    if (!email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Fields Required',
            text: 'Please enter both email and password.',
            confirmButtonColor: '#002f34'
        });
        return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            setLoading(false);
            
            // Success Toast (English)
            Swal.fire({
                icon: 'success',
                title: 'Signed in successfully',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });

            navigate('/', { replace: true });
        })
        .catch((error) => {
            setLoading(false);
            
            // Firebase Error handling in English
            let errorMessage = "An error occurred. Please try again.";
            
            if (error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid email or password. Please check your credentials.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please try again later.";
            }

            // SweetAlert Popup (English)
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                confirmButtonColor: '#002f34',
            });
        });
};

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-[2px] font-sans p-4">
            <div className="relative w-full max-w-[450px] bg-white rounded-md shadow-xl flex flex-col h-[530px] overflow-hidden transition-all">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center p-3 bg-white z-20">
                    <div className="w-8">
                        {step > 1 && (
                            <button onClick={() => setStep(1)} className="text-[#002f34] hover:bg-gray-100 p-1.5 rounded-full transition cursor-pointer">
                                <ChevronLeftIcon className="h-6 w-6 stroke-2" />
                            </button>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-[#002f34] hover:bg-gray-100 p-1.5 rounded-full transition cursor-pointer">
                        <XMarkIcon className="h-6 w-6 stroke-2" />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="flex-grow overflow-y-scroll px-10 custom-olx-scrollbar">
                    {step === 1 && (
                        <div className="flex flex-col animate-in fade-in duration-300">
                            <div className="flex justify-center mb-2">
                                <svg className="h-[80px] w-[80px] text-[#002f34]" fill="currentColor" viewBox="0 0 36.289 20.768">
                                    <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
                                </svg>
                            </div>
                            <h2 className="text-center text-[24px] font-bold text-[#002f34] mb-8 leading-tight">Login into your OLX account</h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center border-[1px] border-[#002f34] py-3 px-5 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 hover:ring-[2px] hover:ring-[#002f34] transition-all">
                                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-6 w-6" alt="google" />
                                    <span className="flex-grow text-center text-[16px]">Login with Google</span>
                                </button>
                                <button className="w-full flex items-center border-[1px] border-[#002f34] py-3 px-5 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 hover:ring-[2px] hover:ring-[#002f34] transition-all">
                                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-6 w-6" alt="Facebook" />
                                    <span className="flex-grow text-center text-[16px]">Login with Facebook</span>
                                </button>
                                <div className="flex items-center gap-2 my-5">
                                    <div className="flex-grow h-[1px] bg-gray-200"></div>
                                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">OR</span>
                                    <div className="flex-grow h-[1px] bg-gray-200"></div>
                                </div>
                                <button onClick={() => setStep(2)} className="w-full flex items-center border-[1px] border-[#002f34] py-3 px-5 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 hover:ring-[2px] hover:ring-[#002f34] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="flex-grow text-center text-[16px]">Login with Email</span>
                                </button>
                                <button onClick={() => setStep(3)} className="w-full flex items-center border-[1px] border-[#002f34] py-3 px-5 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 hover:ring-[2px] hover:ring-[#002f34] transition-all">
                                    <PhoneSvg />
                                    <span className="flex-grow text-center text-[16px]">Login with phone</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col animate-in slide-in-from-right duration-300">
                            <h2 className="text-center text-[24px] font-bold text-[#002f34] mb-8">Enter your email</h2>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[#002f34] mb-2">Email address</label>
                                <input disabled={loading} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 border border-gray-300 rounded focus:border-[#002f34] outline-none text-lg" placeholder="Email" />
                            </div>
                            <div className="mb-6 relative">
                                <label className="block text-sm font-bold text-[#002f34] mb-2">Password</label>
                                <div className="relative">
                                    <input 
                                        disabled={loading} 
                                        type={showPassword ? "text" : "password"} 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full p-4 pr-12 border border-gray-300 rounded focus:border-[#002f34] outline-none text-lg" 
                                        placeholder="Password" 
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#002f34] cursor-pointer">
                                        {showPassword ? <EyeSlashIcon className="h-6 w-6 stroke-2" /> : <EyeIcon className="h-6 w-6 stroke-2" />}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSubmitEmail} disabled={loading} className="w-full py-4 rounded font-bold text-white bg-[#002f34] text-lg hover:bg-[#003d45] transition-colors">
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col animate-in slide-in-from-right duration-300">
                            <h2 className="text-center text-[24px] font-bold text-[#002f34] mb-8">Enter your phone</h2>
                            <div className="mb-6 border-2 border-[#002f34] rounded flex h-14 items-center">
                                <span className="px-4 h-full flex items-center border-r bg-gray-50 font-bold text-lg">+92</span>
                                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 outline-none text-lg" placeholder="Phone Number" />
                            </div>
                            <button className="w-full bg-[#002f34] text-white py-4 rounded font-bold text-lg hover:bg-[#003d45] transition-colors">Next</button>
                        </div>
                    )}

                    <div className="mt-6 text-center pb-10">
                        <p className="text-[13px] text-gray-500 leading-relaxed mb-8 px-4">
                            We won't share your personal details with anyone. By continuing, you agree to <span className="font-bold text-black underline cursor-pointer">Terms</span> and <span className="font-bold text-black underline cursor-pointer">Privacy Policy</span>
                        </p>
                        <button onClick={() => navigate('/signup')} className="text-[#3a77ff] font-bold text-[15px] hover:underline cursor-pointer block w-full text-center">
                            New to OLX? Create an account
                        </button>
                    </div>
                </div>
            </div>
            <style>{`.custom-olx-scrollbar::-webkit-scrollbar { width: 12px; } .custom-olx-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; } .custom-olx-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; border: 3px solid #f1f1f1; } .custom-olx-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }`}</style>
        </div>
    );
}

export default LoginModal;