import React, {useEffect, useState} from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, ChevronLeft, Car } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/auth-store.js";
import { useNavigate } from "react-router-dom";
import ErrorFormulir from "@/components/ui/error-formulir.jsx";

const AuthPage = () => {
    const {signup, isLoading, error, verifyToken, login, resendEmailVerify, clearError} = useAuthStore();
    const [activeTab, setActiveTab] = useState('login');
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    const [registerForm, setRegisterForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleCheckboxChange = (checked) => {
        setLoginForm(prev => ({
            ...prev,
            rememberMe: checked
        }));
    };

    const handleOtpChange = (value) => {
        setOtp(value);
    };

    const validateRegister = () => {
        const newErrors = {};

        // if (!registerForm.fullName.trim()) {
        //     newErrors.fullName = 'Nama Lengkap wajib diisi';
        // }
        //
        // if (!registerForm.email.trim()) {
        //     newErrors.email = 'Email wajib diisi';
        // } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
        //     newErrors.email = 'Format email tidak valid';
        // }
        //
        // if (!registerForm.password) {
        //     newErrors.password = 'Password wajib diisi';
        // } else if (registerForm.password.length < 8) {
        //     newErrors.password = 'Password minimal 8 karakter';
        // }
        //
        // if (!registerForm.confirmPassword) {
        //     newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        // } else if (registerForm.password !== registerForm.confirmPassword) {
        //     newErrors.confirmPassword = 'Password tidak cocok';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLogin = () => {
        const newErrors = {};

        // if (!loginForm.email.trim()) {
        //     newErrors.loginEmail = 'Email wajib diisi';
        // }
        //
        // if (!loginForm.password) {
        //     newErrors.loginPassword = 'Password wajib diisi';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (validateRegister()) {
            try {
                await signup(registerForm.fullName, registerForm.email, registerForm.password)
                toast.info('Kode OTP telah dikirim ke email Anda. Silakan verifikasi untuk melanjutkan.', {
                    duration: 5000,
                });
                clearError();
                setShowOtpVerification(true)
            } catch (e) {
                toast.info('Pendaftaran gagal!', {
                    duration: 5000,
                });
            }
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 6) {
            toast.error('Masukkan kode OTP 6 digit', {
                duration: 3000,
            });
            return;
        }

        try {
            await verifyToken(otp)
            toast.success('Verifikasi berhasil! Akun Anda telah aktif.', {
                duration: 4000,
            });

            clearError();

            setRegisterForm({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
            setOtp("");
            setShowOtpVerification(false);

            setTimeout(() => {
                toast.success('Mengalihkan ke dashboard...', {
                    duration: 2000,
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }, 1500);
        } catch (e) {
            toast.error('Verifikasi gagal!', {
                duration: 4000,
            });
        }
    };

    const handleResendOtp = async () => {
        let email;
        try {
            if (loginForm.email) {
                email = loginForm.email;
            } else if (registerForm.email) {
                email = registerForm.email;
            }

            await resendEmailVerify(email);
            toast.info('Kode OTP baru telah dikirim ke email Anda.', {
                duration: 4000,
            });
        } catch (e) {
            toast.info('Gagal mengirim ke email Anda.', {
                duration: 4000,
            });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (validateLogin()) {
            try {
                await login(loginForm.email, loginForm.password, loginForm.rememberMe);
                toast.success('Login berhasil! Mengalihkan ke dashboard...', {
                    duration: 3000,
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);

                clearError();

            } catch (e) {
                if (e.response.data.errors.includes("terverifikasi")) {
                    toast.info('Verifikasi email dulu!', {
                        duration: 3000,
                    });
                    setShowOtpVerification(true);
                    await resendEmailVerify(loginForm.email);
                    return;
                }

                toast.error('Login gagal!', {
                    duration: 3000,
                });
                console.log("Error:", error)
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Toaster position="top-center" richColors closeButton />

            <div className="w-full md:w-2/5 p-6 md:p-12 flex flex-col bg-white">
                <div className="mb-6 md:mb-8">
                    <a href="/" className="flex items-center text-slate-500 hover:text-slate-700 transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Beranda</span>
                    </a>
                </div>

                <div className="mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">Masuk/Daftar</h1>
                    <p className="text-slate-500">Masukkan alamat email Anda untuk memulai</p>
                </div>

                {showOtpVerification ? (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-slate-800">Verifikasi OTP</h2>
                            <p className="text-slate-500 text-sm">
                                Masukkan kode 6 digit yang telah kami kirim ke email Anda.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center py-4 w-full">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className="gap-2"
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            {error && (
                                <ErrorFormulir error={error} />
                            )}

                            <Button
                                onClick={handleVerifyOtp}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2"
                                disabled={isLoading}
                            >
                                {isLoading ? "MEMVERIFIKASI..." : "VERIFIKASI"}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-slate-500">
                                    Belum menerima kode?{' '}
                                    <button
                                        type="button"
                                        className="text-blue-500 hover:underline"
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                    >
                                        Kirim ulang
                                    </button>
                                </p>
                            </div>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    className="text-sm text-slate-500 hover:underline"
                                    onClick={() => setShowOtpVerification(false)}
                                    disabled={isLoading}
                                >
                                    Kembali ke formulir pendaftaran
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                        <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                            >
                                Masuk
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                            >
                                Daftar
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-0">
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="loginEmail" className="text-slate-700">Alamat Email</Label>
                                    <Input
                                        id="loginEmail"
                                        name="email"
                                        type="email"
                                        placeholder="Masukkan email Anda"
                                        value={loginForm.email}
                                        onChange={handleLoginChange}
                                        className={`${errors.loginEmail ? "border-red-500" : "border-slate-300"} focus-visible:ring-blue-500`}
                                    />
                                    {errors.loginEmail && (
                                        <p className="text-red-500 text-xs">{errors.loginEmail}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="loginPassword" className="text-slate-700">Password</Label>
                                        <a href="#" className="text-xs text-blue-500 hover:underline">Lupa password?</a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="loginPassword"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Masukkan password Anda"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            className={`${errors.loginPassword ? "border-red-500" : "border-slate-300"} pr-10 focus-visible:ring-blue-500`}
                                        />

                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.loginPassword && (
                                        <p className="text-red-500 text-xs">{errors.loginPassword}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 py-1">
                                    <Checkbox
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={loginForm.rememberMe}
                                        onCheckedChange={handleCheckboxChange}
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <Label
                                        htmlFor="rememberMe"
                                        className="text-sm text-slate-700 cursor-pointer leading-none"
                                    >
                                        Ingat saya
                                    </Label>
                                </div>

                                {error && (
                                    <ErrorFormulir error={error} />
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "SEDANG MASUK..." : "MASUK"}
                                </Button>

                                <div className="text-center pt-2">
                                    <p className="text-sm text-slate-500">
                                        Belum punya akun?{' '}
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:underline"
                                            onClick={() => setActiveTab('register')}
                                        >
                                            Daftar sekarang
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="register" className="space-y-0">
                            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-slate-700">Nama Lengkap</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Masukkan nama lengkap Anda"
                                        value={registerForm.fullName}
                                        onChange={handleRegisterChange}
                                        className={`${errors.fullName ? "border-red-500" : "border-slate-300"} focus-visible:ring-blue-500`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-xs">{errors.fullName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Masukkan email Anda"
                                        value={registerForm.email}
                                        onChange={handleRegisterChange}
                                        className={`${errors.email ? "border-red-500" : "border-slate-300"} focus-visible:ring-blue-500`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Buat password"
                                            value={registerForm.password}
                                            onChange={handleRegisterChange}
                                            className={`${errors.password ? "border-red-500" : "border-slate-300"} pr-10 focus-visible:ring-blue-500`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4"/>
                                            ) : (
                                                <Eye className="h-4 w-4"/>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-700">Konfirmasi
                                        Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Konfirmasi password Anda"
                                            value={registerForm.confirmPassword}
                                            onChange={handleRegisterChange}
                                            className={`${errors.confirmPassword ? "border-red-500" : "border-slate-300"} pr-10 focus-visible:ring-blue-500`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4"/>
                                            ) : (
                                                <Eye className="h-4 w-4"/>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="py-1">
                                    <p className="text-xs text-slate-500">
                                        Dengan mendaftar, Anda menyetujui <a href="#"
                                                                             className="text-blue-500 hover:underline">Syarat
                                        & Ketentuan</a> dan <a href="#" className="text-blue-500 hover:underline">Kebijakan
                                        Privasi</a> kami.
                                    </p>
                                </div>

                                {error && (
                                    <ErrorFormulir error={error} />
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "SEDANG MENDAFTAR..." : "DAFTAR"}
                                </Button>

                                <div className="text-center pt-2">
                                    <p className="text-sm text-slate-500">
                                        Sudah punya akun?{' '}
                                        <button
                                            type="button"
                                            className="text-blue-500 hover:underline"
                                            onClick={() => setActiveTab('login')}
                                        >
                                            Masuk di sini
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <div className="hidden md:flex md:w-3/5 bg-slate-50 text-slate-800 flex-col justify-between p-6 md:p-16">
                <div className="flex items-center mb-8">
                    <Car className="h-8 w-8 mr-2 text-blue-500" />
                    <div className="text-2xl font-bold">WheelGo</div>
                </div>

                <div className="mt-auto">
                    <h2 className="text-4xl md:text-5xl leading-tight font-bold mb-4 text-slate-800">WheelGo<br/>Rental Mobil</h2>
                    <p className="text-base md:text-lg mb-6 text-slate-600">Platform rental mobil terbaik dan terpercaya di Indonesia.</p>

                    <div className="mt-8 md:mt-16 bg-white shadow-md p-4 md:p-6 rounded-lg border border-slate-100">
                        <div className="flex mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                                </svg>
                            ))}
                        </div>
                        <p className="mb-4 text-slate-600">"Saya sudah mencoba banyak jasa rental mobil dan WheelGo adalah yang terbaik. Pelayanan cepat dan mobilnya selalu dalam kondisi prima."</p>

                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden mr-3">
                                <img src="/api/placeholder/100/100" alt="user" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Budi Santoso</p>
                                <p className="text-sm text-slate-500">Pelanggan Setia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-sm text-slate-500">
                    <p>&copy; 2025 WheelGo. Semua hak dilindungi.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;