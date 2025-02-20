export const EMAIL_SEND_VERIFICATION = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email - Rental Mobil</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f4f4f4;
        }
        .content {
            padding: 30px 0;
            text-align: center;
        }
        .verification-code {
            letter-spacing: 8px;
            font-size: 32px;
            font-weight: bold;
            color: #333;
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            padding-top: 20px;
            border-top: 2px solid #f4f4f4;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Rental Mobil</div>
        </div>
        
        <div class="content">
            <h2>Verifikasi Email Anda</h2>
            <p>Terima kasih telah mendaftar di Rental Mobil. Untuk menyelesaikan pendaftaran, masukkan kode verifikasi berikut:</p>
            
            <div class="verification-code">{verification_token}</div>
            
            <p>Kode verifikasi ini akan kedaluwarsa dalam 10 menit.</p>
            <p>Jika Anda tidak merasa mendaftar di Rental Mobil, abaikan email ini.</p>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
            <p>© 2025 Rental Mobil. Seluruh hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>`

export const EMAIL_SEND_WELCOME = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang - Rental Mobil</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #2d3436;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            padding: 30px;
            color: white;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .content {
            padding: 40px;
        }
        .welcome-message {
            font-size: 32px;
            color: #2d3436;
            margin-bottom: 25px;
            font-weight: 600;
            text-align: left;
        }
        .sub-message {
            color: #636e72;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .feature-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        .feature-icon {
            font-size: 24px;
            min-width: 40px;
        }
        .feature-text {
            font-size: 15px;
        }
        .feature-text strong {
            display: block;
            margin-bottom: 5px;
            color: #2d3436;
        }
        .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        .button {
            display: inline-block;
            padding: 16px 32px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .social-links {
            text-align: center;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e9ecef;
        }
        .social-links a {
            margin: 0 15px;
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #636e72;
            font-size: 14px;
        }
        .help-text {
            margin-top: 20px;
            padding: 15px;
            background: #e9ecef;
            border-radius: 8px;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .features-grid {
                grid-template-columns: 1fr;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Rental Mobil</div>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                Halo, {full_name}! 👋
            </div>
            
            <div class="sub-message">
                Selamat datang di keluarga Rental Mobil! Kami sangat senang Anda memilih kami sebagai partner perjalanan Anda. Mari mulai petualangan Anda dengan berbagai kemudahan yang kami tawarkan.
            </div>
            
            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">🚗</div>
                    <div class="feature-text">
                        <strong>Pilihan Mobil Premium</strong>
                        Akses ke 100+ mobil berkualitas yang selalu terawat
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-text">
                        <strong>Booking Instan</strong>
                        Proses pemesanan cepat kurang dari 2 menit
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💎</div>
                    <div class="feature-text">
                        <strong>Member Rewards</strong>
                        Kumpulkan poin dan nikmati berbagai privilese
                    </div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🛡️</div>
                    <div class="feature-text">
                        <strong>Asuransi Premium</strong>
                        Perjalanan aman dengan perlindungan menyeluruh
                    </div>
                </div>
            </div>

            <div class="cta-section">
                <h2>Siap untuk memulai?</h2>
                <p>Dapatkan diskon 15% untuk pemesanan pertama Anda</p>
                <a href="#" class="button">Mulai Rental Sekarang</a>
            </div>
            
            <div class="help-text">
                💡 Tips: Download aplikasi kami untuk pengalaman booking yang lebih mudah dan akses ke promo eksklusif.
            </div>

            <div class="social-links">
                <p>Ikuti kami untuk updates terbaru:</p>
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Ada pertanyaan? Tim support kami siap membantu 24/7<br>
            Email: support@rentalmobil.com | WhatsApp: 0812-xxxx-xxxx</p>
            <p>© 2025 Rental Mobil. Seluruh hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>`