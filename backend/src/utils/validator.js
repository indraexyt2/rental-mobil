import Joi from "joi";

export const userSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(255).required(),
    full_name: Joi.string().max(100).required(),
    phone: Joi.string().max(50).allow(null, ""),
    address: Joi.string().allow(null, ""),
    sim_number: Joi.string().max(50).allow(null, ""),
    sim_image: Joi.string().allow(null, ""),
    avatar: Joi.string().allow(null, ""),
    role: Joi.string().valid("USER", "ADMIN").default("USER"),
    is_verified: Joi.boolean().default(false),
});
