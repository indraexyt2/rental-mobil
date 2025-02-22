import Joi from "joi";

export const userSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(100)
        .required()
        .messages({
            'string.email': 'Format email tidak valid!',
            'string.empty': 'Email tidak boleh kosong!',
            'string.max': 'Email maksimal 100 karakter!',
            'any.required': 'Email harus diisi!'
        }),

    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Password tidak boleh kosong!',
            'string.min': 'Password minimal 6 karakter!',
            'string.max': 'Password maksimal 255 karakter!',
            'any.required': 'Password harus diisi!'
        }),

    full_name: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.empty': 'Nama lengkap tidak boleh kosong!',
            'string.max': 'Nama lengkap maksimal 100 karakter!',
            'any.required': 'Nama lengkap harus diisi!'
        }),
});

export const userUpdateSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(100)
        .required()
        .messages({
            'string.email': 'Format email tidak valid!',
            'string.empty': 'Email tidak boleh kosong!',
            'string.max': 'Email maksimal 100 karakter!',
            'any.required': 'Email harus diisi!'
        }),

    full_name: Joi.string()
        .max(100)
        .required()
        .messages({
            'string.empty': 'Nama lengkap tidak boleh kosong!',
            'string.max': 'Nama lengkap maksimal 100 karakter!',
            'any.required': 'Nama lengkap harus diisi!'
        }),

    phone: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'Nomor telepon tidak boleh kosong!',
            'string.max': 'Nomor telepon maksimal 50 karakter!',
            'any.required': 'Nomor telepon harus diisi!'
        }),

    address: Joi.string()
        .required()
        .messages({
            'string.empty': 'Alamat tidak boleh kosong!',
            'any.required': 'Alamat harus diisi!'
        }),

    sim_number: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'Nomor SIM tidak boleh kosong!',
            'string.max': 'Nomor SIM maksimal 50 karakter!',
            'any.required': 'Nomor SIM harus diisi!'
        })
});

export const carSchema = Joi.object({
    brand: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': 'Brand tidak boleh kosong!',
            'string.max': 'Brand maksimal 50 karakter!',
            'any.required': 'Brand harus diisi!'
        }),

    model: Joi.string()
        .max(40)
        .required()
        .messages({
            'string.empty': 'Model tidak boleh kosong!',
            'string.max': 'Model maksimal 40 karakter!',
            'any.required': 'Model harus diisi!'
        }),

    year: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.base': 'Tahun harus berupa angka!',
            'number.min': 'Tahun minimal 1900!',
            'number.max': `Tahun maksimal ${new Date().getFullYear()}!`,
            'any.required': 'Tahun harus diisi!'
        }),

    transmission: Joi.string()
        .valid('Manual', 'Automatic')
        .required()
        .messages({
            'any.only': 'Transmission harus Manual atau Automatic!',
            'any.required': 'Transmission harus diis!'
        }),

    capacity: Joi.number()
        .integer()
        .min(2)
        .max(100)
        .required()
        .messages({
            'number.base': 'Kapasitas harus berupa angka!',
            'number.min': 'Kapasitas minimal 2 orang!',
            'number.max': 'Kapasitas maksimal 50 orang!',
            'any.required': 'Kapasitas harus diisi!'
        }),

    fuel_type: Joi.string()
        .valid('Bensin', 'Solar', 'Listrik')
        .required()
        .messages({
            'any.only': 'Fuel type harus Bensin, Solar, atau Listrik!',
            'any.required': 'Fuel type harus diisi!'
        }),

    price_per_day: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Harga harus berupa angka!',
            'number.positive': 'Harga harus lebih dari 0!',
            'any.required': 'Harga harus diisi!'
        }),

    is_active: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Status harus berupa boolean!'
        }),

    description: Joi.string()
        .required()
        .messages({
            'string.empty': 'Deskripsi tidak boleh kosong!',
            'any.required': 'Deskripsi harus diisi!'
        }),

    mileage: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Mileage harus berupa angka!',
            'number.min': 'Mileage minimal 0!',
            'any.required': 'Mileage harus diisi!'
        }),

    features: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            'array.min': 'Minimal harus ada 1 fitur!',
            'array.base': 'Features harus berupa array!',
            'any.required': 'Features harus diisi11!'
        }),

    category: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            'array.min': "Category harus diisi!",
            'number.base': 'Category harus diisi!',
            'any.required': 'Category harus diisi!'
        }),

    images: Joi.array()
        .items(
            Joi.object({
                path: Joi.string()
                    .required()
                    .messages({
                        'string.empty': 'Minimal harus ada 1 gambar!',
                        'any.required': 'Minimal harus ada 1 gambar!'
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'Minimal harus ada 1 gambar!',
            'any.required': 'Minimal harus ada 1 gambar!'
        })
})
    .required()
    .messages({
        'object.missing': "Semua kolom wajib diisi!"
    });
