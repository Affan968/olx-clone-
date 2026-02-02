import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import { auth, signInWithEmailAndPassword } from './firebaseconfig/index.jsx';

function LoginModal() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // 1. Loading State yahan add kar di
    const [loading, setLoading] = useState(false);

    const handleClose = () => navigate('/');

    const handleSubmit = () => {
        // 2. Loading start
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("ye user abhi login hai ", user);
                setLoading(false); // Success par loading khatam
                navigate('/');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                setLoading(false); // Error par loading khatam
                alert(errorMessage);
            });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
            <div className="relative w-full max-w-[400px] bg-white rounded-md shadow-xl flex flex-col h-[530px] overflow-hidden">

                <div className="flex justify-between items-center p-2 bg-white z-20">
                    <div className="w-8">
                        {step > 1 && (
                            <button
                                disabled={loading} // Loading ke waqt back disable
                                onClick={() => setStep(1)}
                                className="text-[#002f34] hover:bg-gray-100 p-1 rounded-full transition cursor-pointer disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="h-6 w-6 stroke-2" />
                            </button>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-[#002f34] hover:bg-gray-100 p-1 rounded-full transition cursor-pointer">
                        <XMarkIcon className="h-6 w-6 stroke-2" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-scroll px-8 custom-olx-scrollbar">

                    {step === 1 && (
                        <div className="flex flex-col animate-in fade-in duration-300">
                            <div className="flex justify-center mb-1">
                                <svg className="h-[80px] w-[80px] text-[#002f34]" fill="currentColor" viewBox="0 0 36.289 20.768">
                                    <path d="M18.9 20.77V0h4.93v20.77zM0 10.39a8.56 8.56 0 1 1 8.56 8.56A8.56 8.56 0 0 1 0 10.4zm5.97-.01a2.6 2.6 0 1 0 2.6-2.6 2.6 2.6 0 0 0-2.6 2.6zm27 5.2l-1.88-1.87-1.87 1.88H25.9V12.3l1.9-1.9-1.9-1.89V5.18h3.27l1.92 1.92 1.93-1.92h3.27v3.33l-1.9 1.9 1.9 1.9v3.27z"></path>
                                </svg>
                            </div>
                            <h2 className="text-center text-[25px] font-semibold text-[#002f34] mb-8 leading-tight">
                                Login to your OLX account
                            </h2>
                            <div className="space-y-3">
                                <button className="w-full flex items-center border-1 border-[#002f34] py-3 px-18 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 transition-all hover:ring-[2.5px] hover:ring-[#002f34]">
                                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-6 w-6" alt="google" />
                                    <span className="flex-grow text-center text-[15px]">Login with Google</span>
                                </button>
                                <button className="w-full flex items-center border-1 border-[#002f34] py-3 px-15 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 transition-all hover:ring-[2.5px] hover:ring-[#002f34]">
                                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-6 w-6 rounded-xl" alt="Facebook" />
                                    <span className="flex-grow text-center text-[15px]">Login with Facebook</span>
                                </button>
                                <div className="flex items-center gap-2 my-4">
                                    <div className="flex-grow h-[1px] bg-gray-200"></div>
                                    <span className="text-[12px] font-bold text-gray-500">OR</span>
                                    <div className="flex-grow h-[1px] bg-gray-200"></div>
                                </div>
                                <button onClick={() => setStep(2)} className="w-full flex items-center border-1 border-[#002f34] py-3 px-20 rounded-md font-bold text-[#002f34] bg-white cursor-pointer hover:bg-gray-50 hover:ring-[2.5px] hover:ring-[#002f34] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="flex-grow text-center text-[15px]">Loin with Email</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col animate-in slide-in-from-right duration-300">
                            <h2 className="text-center text-[24px] font-bold text-[#002f34] mb-8">Login with Email</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-[#002f34] mb-2">Email</label>
                                <input 
                                    disabled={loading}
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full p-4 border border-gray-300 rounded focus:border-[#002f34] outline-none disabled:bg-gray-50" 
                                    placeholder="Email" 
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-[#002f34] mb-2">Password</label>
                                <input 
                                    disabled={loading}
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full p-4 border border-gray-300 rounded focus:border-[#002f34] outline-none disabled:bg-gray-50" 
                                    placeholder="Password" 
                                />
                            </div>

                            {/* 3. BUTTON KE ANDAR LOADING SPINNER */}
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading}
                                className="w-full py-3 rounded font-bold text-white bg-[#002f34] hover:bg-[#003d45] flex justify-center items-center min-h-[48px] disabled:opacity-80 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Log In"
                                )}
                            </button>
                            
                            <p className="mt-4 text-center text-[#3a77ff] text-sm font-bold cursor-pointer hover:underline">
                                Forgot password?
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center pb-8">
                        <p className="text-[12px] text-gray-500 leading-snug mb-8">
                            We won't share your personal details with anyone
                        </p>
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="text-[#3a77ff] font-bold text-[14px] hover:underline cursor-pointer block w-full text-center"
                        >
                            New to OLX? Create an account
                        </button>
                    </div>

                </div>
            </div>

            <style>{`
                .custom-olx-scrollbar::-webkit-scrollbar { width: 12px; }
                .custom-olx-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-olx-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; border: 3px solid #f1f1f1; }
                .custom-olx-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            `}</style>
        </div>
    );
}

export default LoginModal;