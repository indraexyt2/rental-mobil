import UserController from "../../../src/controllers/user.controller";
import UserRepository from "../../../src/repositories/user.repository";
import bcrypt from "bcrypt";
import {logger} from "../../../src/utils/logger";
import {userSchema} from "../../../src/utils/validator";

jest.mock('../../../src/repositories/user.repository');
jest.mock("bcrypt");
jest.mock("../../../src/utils/logger");
jest.mock('../../../src/utils/validator');

describe('UserController', () => {
    let userController;
    let userRepository;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        jest.clearAllMocks();

        userController = new UserController();
        userRepository = new UserRepository();
        userController.userRepo = userRepository;

        mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('registerNewUser', () => {
        it('should successfully register a new user', async () => {
            const validatedData = { ...mockRequest.body };
            const value = { ...validatedData };
            userSchema.validate.mockReturnValue({
                value,
                error: null
            });

            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            const mockNewUser = {
                id: 1,
                email: value.email,
                name: value.name,
                password: hashedPassword
            };
            userRepository.addUser = jest.fn().mockResolvedValue(mockNewUser);

            await userController.registerNewUser(mockRequest, mockResponse);

            expect(userSchema.validate).toHaveBeenCalledWith(
                mockRequest.body,
                { abortEarly: false }
            );
            expect(bcrypt.hash).toHaveBeenCalledWith(mockRequest.body.password, 10);
            expect(userRepository.addUser).toHaveBeenCalledWith({
                ...value,
                password: hashedPassword
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Pendaftan berhasil!',
                data: mockNewUser
            });
        });

        it('should return validation error when user data is invalid', async () => {
            const mockError = {
                details: [
                    { message: '"email" is required' },
                    { message: '"password" is required' }
                ]
            };
            userSchema.validate.mockReturnValue({
                value: null,
                error: mockError
            });

            await userController.registerNewUser(mockRequest, mockResponse);

            expect(logger.error).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Pendaftaran tidak berhasil!',
                data: ['email is required', 'password is required']
            });
        });

        it('should handle duplicate email error', async () => {
            const value = { ...mockRequest.body };
            userSchema.validate.mockReturnValue({
                value,
                error: null
            });

            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            userRepository.addUser = jest.fn().mockRejectedValue({
                code: 'P2002'
            });

            await userController.registerNewUser(mockRequest, mockResponse);

            expect(logger.error).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Pendaftaran tidak berhasil!',
                data: 'Alamat email sudah digunakan!'
            });
        });

        it('should handle generic server errors', async () => {
            const value = { ...mockRequest.body };
            userSchema.validate.mockReturnValue({
                value,
                error: null
            });

            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);

            userRepository.addUser = jest.fn().mockRejectedValue(new Error('Database error'));

            await userController.registerNewUser(mockRequest, mockResponse);

            expect(logger.error).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Pendaftaran tidak berhasil!',
                data: 'Terjadi kesalahan pada server'
            });
        });
    });
});